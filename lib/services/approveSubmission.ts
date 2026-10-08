import prisma from '@/lib/prisma';

/**
 * Promotes a pending mic_submissions row into the live, normalized mic tables
 * (mic + address + cost + signup + occurrence + host), geocoding the address for
 * a map pin. Mirrors the shape the seed script uses. Wrapped in a transaction so
 * a partial insert can't leave orphaned rows.
 *
 * Host email is intentionally never copied from the submission — the mic page
 * renders host email publicly, and submitter_email is a private contact.
 */

async function geocode(address: string): Promise<{ lat: string; lng: string } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      address
    )}&format=json&limit=1`;
    const res = await fetch(url, { headers: { 'User-Agent': 'OpenMYC-Geocoder/1.0' } });
    const data = await res.json();
    return data.length > 0 ? { lat: data[0].lat, lng: data[0].lon } : null;
  } catch {
    return null;
  }
}

/** "18:00" / "18:00:00" -> a Time-only Date; null for blank/unparseable. */
function toTime(value: string | null): Date | null {
  if (!value) return null;
  const m = value.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!m) return null;
  const hh = m[1].padStart(2, '0');
  return new Date(`1970-01-01T${hh}:${m[2]}:${m[3] ?? '00'}.000Z`);
}

export type ApproveResult = { micId: bigint; geocoded: boolean };

export async function approveSubmission(id: bigint): Promise<ApproveResult> {
  const sub = await prisma.mic_submissions.findUnique({ where: { id } });
  if (!sub) throw new Error('Submission not found');
  if (sub.status !== 'pending') throw new Error(`Submission is already "${sub.status}"`);

  // Geocode before the transaction so no network latency holds it open.
  const coords =
    (await geocode(sub.street_address)) ?? (await geocode(`${sub.street_address}, New York, NY`));

  const today = new Date().toLocaleDateString('en-US');

  // Normalized key so the same venue under a different spelling reuses one row.
  const venueSlug = sub.venue.toLowerCase().replace(/[^a-z0-9]+/g, '');

  const mic = await prisma.$transaction(async (tx) => {
    // Find-or-create the canonical venue; reuse its stored name so the display
    // stays consistent with venues created earlier.
    const venue =
      (venueSlug &&
        ((await tx.venues.findUnique({ where: { slug: venueSlug } })) ??
          (await tx.venues.create({ data: { name: sub.venue, slug: venueSlug } })))) ||
      null;

    const address = await tx.mic_address.create({
      data: {
        venue: venue?.name ?? sub.venue,
        venue_id: venue?.id ?? null,
        street_name: sub.street_address,
        neighborhood: sub.neighborhood,
        unit_number: 0,
        latitude: coords?.lat ?? null,
        longitude: coords?.lng ?? null,
      },
    });

    const cost = sub.cost ? await tx.mic_cost.create({ data: { cost_amount: sub.cost } }) : null;

    const signup = sub.signup_info
      ? await tx.signup_instructions.create({ data: { instructions: sub.signup_info } })
      : null;

    // occurrence_id has no autoincrement default — derive the next id.
    let occurrenceId: bigint | null = null;
    if (sub.schedule) {
      const maxOcc = await tx.mic_occurrence.aggregate({ _max: { occurrence_id: true } });
      const next = (maxOcc._max.occurrence_id ?? 0n) + 1n;
      await tx.mic_occurrence.create({ data: { occurrence_id: next, schedule: sub.schedule } });
      occurrenceId = next;
    }

    const created = await tx.mics.create({
      data: {
        name: sub.name,
        day: sub.day,
        borough: sub.borough,
        start_time: toTime(sub.start_time),
        end_time: toTime(sub.end_time),
        confirmed: `Submission #${id.toString()}, approved ${today}`,
        instagram: sub.instagram,
        website: sub.website,
        venue_type: sub.venue_type,
        stage_time: sub.stage_time,
        notes: sub.notes ? sub.notes.slice(0, 255) : null, // mics.notes is VarChar(255)
        address_id: address.address_id,
        cost_id: cost?.cost_id ?? null,
        signup_id: signup?.signup_id ?? null,
        occurrence_id: occurrenceId,
      },
    });

    if (sub.host_name) {
      const host = await tx.mic_host.create({
        data: { first_host: sub.host_name, instagram: sub.host_instagram },
      });
      await tx.host_mics.create({ data: { mics_id: created.id, host_id: host.host_id } });
    }

    await tx.mic_submissions.update({ where: { id }, data: { status: 'approved' } });

    return created;
  });

  return { micId: mic.id, geocoded: coords !== null };
}

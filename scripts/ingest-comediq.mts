/**
 * One-time ingest of the comediq.us public Google Sheet (NYC subset) into the
 * live mic tables. Reads an auditable plan from scripts/data/comediq-ingest.json
 * (generated from the sheet-vs-snapshot reconcile) and applies two things:
 *
 *   1. TIME fixes  — update start_time/end_time on existing mics by id.
 *   2. NEW mics    — insert mics (+venue, address, cost, signup, host),
 *                    geocoded for a map pin.
 *
 * Safety:
 *   - Dry-run by default; pass --apply to write.
 *   - Time fixes skip any mic whose LIVE value no longer matches the snapshot
 *     value we diffed against (someone edited it since) — reported, not applied.
 *   - New mics are deduped against the live DB (name/venue + day) so re-running
 *     is idempotent.
 *   - Every geocode is bounds-checked to NYC; an out-of-bounds hit is discarded
 *     (guards against the Nominatim "London" class of error).
 *   - Each new mic is inserted in its own transaction (mirrors approveSubmission).
 *
 *   npx tsx scripts/ingest-comediq.mts            # dry-run
 *   npx tsx scripts/ingest-comediq.mts --apply    # write to Neon
 */
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const APPLY = process.argv.includes('--apply');
const prisma = new PrismaClient();

type TimeUpdate = {
  id: string; name: string; venue: string; day: string; confidence: string;
  set: { start_time?: string; end_time?: string };
  snapshot_current: { start_time?: string | null; end_time?: string | null };
};
type NewMic = {
  name: string; day: string; borough: string | null; neighborhood: string | null;
  venue: string; start_time: string | null; end_time: string | null;
  street_name: string; city: string; state: string; zipcode: string | null;
  address_full: string; venue_type: string | null; cost: string | null;
  stage_time: string | null; signup: string | null;
  first_host: string | null; host_instagram: string | null;
};

const plan = JSON.parse(
  readFileSync(join(__dirname, 'data', 'comediq-ingest.json'), 'utf-8')
) as { time_updates: TimeUpdate[]; new_mics: NewMic[] };

// --- helpers ---
function toTime(value: string | null): Date | null {
  if (!value) return null;
  const m = value.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!m) return null;
  return new Date(`1970-01-01T${m[1].padStart(2, '0')}:${m[2]}:${m[3] ?? '00'}.000Z`);
}
// Prisma Time(6) comes back as a 1970 Date; take the "HH:MM:SS" clock part.
function clock(d: Date | null): string | null {
  return d ? d.toISOString().slice(11, 19) : null;
}

// NYC bounding box — anything outside is a bad geocode, not an NYC venue.
const NYC = { latMin: 40.4, latMax: 41.0, lngMin: -74.3, lngMax: -73.6 };
function inNYC(lat: string, lng: string): boolean {
  const la = parseFloat(lat), ln = parseFloat(lng);
  return la >= NYC.latMin && la <= NYC.latMax && ln >= NYC.lngMin && ln <= NYC.lngMax;
}
async function geocode(address: string): Promise<{ lat: string; lng: string } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      address
    )}&format=json&limit=1`;
    const res = await fetch(url, { headers: { 'User-Agent': 'OpenMYC-Geocoder/1.0' } });
    const data = await res.json();
    if (data.length === 0) return null;
    const hit = { lat: data[0].lat as string, lng: data[0].lon as string };
    return inNYC(hit.lat, hit.lng) ? hit : null; // discard out-of-NYC hits
  } catch {
    return null;
  }
}
async function geocodeNYC(street: string, city: string, state: string) {
  // Try the specific address, then an NYC-qualified fallback; bounds-checked.
  await new Promise((r) => setTimeout(r, 1100)); // Nominatim 1 req/s
  return (
    (await geocode(`${street}, ${city}, ${state}`)) ??
    (await geocode(`${street}, New York, NY`))
  );
}

async function runTimeUpdates() {
  console.log(`\n=== TIME UPDATES (${plan.time_updates.length}) ===`);
  let applied = 0, noop = 0, conflict = 0, missing = 0;
  for (const u of plan.time_updates) {
    const id = BigInt(u.id);
    const live = await prisma.mics.findUnique({
      where: { id },
      select: { name: true, start_time: true, end_time: true },
    });
    if (!live) { console.log(`  MISSING  #${u.id} ${u.name} — not in DB, skip`); missing++; continue; }

    const data: { start_time?: Date | null; end_time?: Date | null } = {};
    const notes: string[] = [];
    let blocked = false;
    for (const f of ['start_time', 'end_time'] as const) {
      if (!(f in u.set)) continue;
      const liveClock = clock(live[f]);
      const target = u.set[f]!;
      if (liveClock === target) { notes.push(`${f} already ${target}`); continue; }
      // live must still match the snapshot value we diffed against
      const snapVal = u.snapshot_current[f] ?? null;
      if (liveClock !== snapVal) {
        notes.push(`${f} CONFLICT live=${liveClock} expected=${snapVal} (skip)`);
        blocked = true; continue;
      }
      data[f] = toTime(target);
      notes.push(`${f} ${liveClock} -> ${target}`);
    }
    if (Object.keys(data).length === 0) {
      if (blocked) { conflict++; console.log(`  SKIP     #${u.id} ${live.name}: ${notes.join('; ')}`); }
      else { noop++; }
      continue;
    }
    console.log(`  ${APPLY ? 'APPLY' : 'PLAN '}   #${u.id} ${live.name} [${u.confidence}]: ${notes.join('; ')}`);
    if (APPLY) await prisma.mics.update({ where: { id }, data });
    applied++;
  }
  console.log(`  -> ${APPLY ? 'applied' : 'to apply'}: ${applied}, no-op: ${noop}, conflict-skipped: ${conflict}, missing: ${missing}`);
}

async function findExisting(n: NewMic) {
  // Idempotency: same day + (same venue name OR same mic name) already present?
  const rows = await prisma.mics.findMany({
    where: {
      day: n.day || undefined,
      OR: [
        { name: { equals: n.name, mode: 'insensitive' } },
        { mic_address: { venue: { equals: n.venue, mode: 'insensitive' } } },
      ],
    },
    select: { id: true, name: true, mic_address: { select: { venue: true } } },
  });
  return rows;
}

async function runNewMics() {
  console.log(`\n=== NEW MICS (${plan.new_mics.length}) ===`);
  let inserted = 0, skipped = 0, nogeo = 0;
  const today = new Date().toLocaleDateString('en-US');

  for (const n of plan.new_mics) {
    const existing = await findExisting(n);
    // Treat a same-name OR same-venue+day hit as an existing mic.
    const dupe = existing.find(
      (e) =>
        e.name?.toLowerCase() === n.name.toLowerCase() ||
        e.mic_address?.venue?.toLowerCase() === n.venue.toLowerCase()
    );
    if (dupe) {
      console.log(`  SKIP   "${n.name}" @ ${n.venue} [${n.day}] — matches existing #${dupe.id} "${dupe.name}"`);
      skipped++;
      continue;
    }

    const coords = APPLY ? await geocodeNYC(n.street_name, n.city, n.state) : null;
    if (APPLY && !coords) nogeo++;

    console.log(
      `  ${APPLY ? 'INSERT' : 'PLAN  '} "${n.name}" @ ${n.venue} [${n.day} ${n.start_time ?? '—'}]` +
        ` ${n.street_name}, ${n.city}${APPLY ? ` ${coords ? `(${coords.lat},${coords.lng})` : 'NO-GEOCODE'}` : ''}`
    );
    if (!APPLY) continue;

    const venueSlug = n.venue.toLowerCase().replace(/[^a-z0-9]+/g, '');
    await prisma.$transaction(async (tx) => {
      const venue =
        (venueSlug &&
          ((await tx.venues.findUnique({ where: { slug: venueSlug } })) ??
            (await tx.venues.create({ data: { name: n.venue, slug: venueSlug } })))) ||
        null;

      const address = await tx.mic_address.create({
        data: {
          venue: venue?.name ?? n.venue,
          venue_id: venue?.id ?? null,
          street_name: n.street_name,
          neighborhood: n.neighborhood,
          city: n.city,
          state: n.state,
          zipcode: n.zipcode,
          country: 'USA',
          unit_number: 0,
          latitude: coords?.lat ?? null,
          longitude: coords?.lng ?? null,
        },
      });

      const cost = n.cost ? await tx.mic_cost.create({ data: { cost_amount: n.cost } }) : null;
      const signup = n.signup
        ? await tx.signup_instructions.create({ data: { instructions: n.signup.slice(0, 500) } })
        : null;

      const created = await tx.mics.create({
        data: {
          name: n.name,
          day: n.day || null,
          borough: n.borough,
          start_time: toTime(n.start_time),
          end_time: toTime(n.end_time),
          confirmed: `Imported from comediq sheet ${today}`,
          venue_type: n.venue_type,
          stage_time: n.stage_time,
          address_id: address.address_id,
          cost_id: cost?.cost_id ?? null,
          signup_id: signup?.signup_id ?? null,
        },
      });

      if (n.first_host || n.host_instagram) {
        const host = await tx.mic_host.create({
          data: { first_host: n.first_host, instagram: n.host_instagram },
        });
        await tx.host_mics.create({ data: { mics_id: created.id, host_id: host.host_id } });
      }
    });
    inserted++;
  }
  console.log(`  -> ${APPLY ? 'inserted' : 'to insert'}: ${inserted}, skipped(dupe): ${skipped}` + (APPLY ? `, no-geocode: ${nogeo}` : ''));
}

async function main() {
  console.log(APPLY ? '*** APPLY MODE — writing to Neon ***' : '*** DRY RUN (no writes) — pass --apply to write ***');
  await runTimeUpdates();
  await runNewMics();
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => prisma.$disconnect());

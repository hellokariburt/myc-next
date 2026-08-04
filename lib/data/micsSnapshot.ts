import { MicListItem, MicDetail } from '../types/mic';
import snapshot from './mics-snapshot.json';

/**
 * Read-side snapshot backing the mic listing/search surface as an automatic
 * fallback when Neon is unavailable (getMics/getMic try the DB first, then this;
 * see scripts/build-mics-snapshot.mts). Rebuild it with that script whenever the
 * live data drifts, so the fallback stays faithful.
 *
 * The snapshot is a full dump of the live DB by id — coordinates, host records,
 * website/email/phone, notes and mic_occurrence.schedule are all present — so
 * the fallback listing keeps its map pins and the detail fallback is complete.
 */

interface SnapshotRecord {
  id: string | null;
  name: string;
  day: string | null;
  start_time: string | null;
  end_time: string | null;
  venue_name: string | null;
  borough: string | null;
  neighborhood: string | null;
  address: {
    street_name?: string | null;
    unit_number?: number | null;
    city?: string | null;
    state?: string | null;
    zipcode?: string | null;
    country?: string | null;
    latitude?: string | null;
    longitude?: string | null;
  };
  venue_type: string | null;
  cost: string | null;
  stage_time: string | null;
  schedule: string | null;
  signup_instructions: string | null;
  host: string | null;
  host_email: string | null;
  host_instagram: string | null;
  instagram: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  confirmed: string | null;
  other_rules: string | null;
}

const records = snapshot as SnapshotRecord[];

// "14:00:00" -> "1970-01-01T14:00:00.000Z", matching the serialized Prisma Date
// the components consume (changeTime reads chars 11..15 of this string).
function toTimeValue(t: string | null): string | null {
  return t ? `1970-01-01T${t}.000Z` : null;
}

/**
 * Project a snapshot record into the exact MicListItem shape the listing
 * components expect (post-serialize). `venue_image` is left for the caller to
 * attach via venueImageFor, mirroring the original Prisma read path.
 */
export function toMicListItem(r: SnapshotRecord): MicListItem {
  return {
    id: r.id ? Number(r.id) : 0,
    borough: r.borough,
    confirmed: r.confirmed,
    day: r.day,
    name: r.name,
    start_time: toTimeValue(r.start_time),
    end_time: toTimeValue(r.end_time),
    instagram: r.instagram,
    website: r.website,
    email_address: r.email,
    venue_type: r.venue_type,
    stage_time: r.stage_time,
    other_rules: r.other_rules,
    mic_address: {
      venue: r.venue_name,
      street_name: r.address?.street_name ?? null,
      unit_number: r.address?.unit_number ?? 0,
      latitude: r.address?.latitude ?? null,
      longitude: r.address?.longitude ?? null,
      neighborhood: r.neighborhood,
    },
    mic_cost: r.cost ? { cost_amount: r.cost } : null,
    mic_occurrence: r.schedule ? { schedule: r.schedule } : null,
  };
}

/** All mics as MicListItem, in snapshot (seed) order. */
export function allMics(): MicListItem[] {
  return records.map(toMicListItem);
}

/**
 * A single mic as MicDetail, by id — the getMic fallback when the DB is down.
 * The snapshot dumps the live DB, so detail fields (lat/long, phone, notes,
 * host records) are all present. `venue_image` is left for the caller to attach
 * (avoids a circular import with mics.service).
 */
export function snapshotMicById(id: bigint | number): MicDetail | null {
  const wanted = String(id);
  const r = records.find((rec) => rec.id === wanted);
  if (!r) return null;
  return {
    ...toMicListItem(r),
    phone_number: r.phone,
    notes: r.notes,
    signup_instructions: r.signup_instructions ? { instructions: r.signup_instructions } : null,
    host_mics: r.host
      ? [{ mic_host: { first_host: r.host, email: r.host_email, instagram: r.host_instagram } }]
      : [],
  };
}

/** Total mic count — replaces prisma.mics.count() on the read surface. */
export const micCount = records.length;

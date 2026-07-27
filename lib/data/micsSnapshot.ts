import { MicListItem, MicDetail } from '../types/mic';
import snapshot from './mics-snapshot.json';

/**
 * Read-side snapshot backing the mic listing/search surface while Neon is
 * unavailable (see scripts/build-mics-snapshot.mts). This is deliberately the
 * only read path for listings during that window; detail pages (getMic) stay on
 * Prisma. Rebuilt faithfully from a live DB dump once the compute limit resets.
 *
 * Fidelity notes for this snapshot generation:
 *  - `id` is recovered from the production sitemap by slug. 5 records had no
 *    match (name drift since the seed) and carry id 0 — callers must treat a
 *    falsy id as "no detail link" rather than build /mics/0-...
 *  - lat/long, website, email, phone, host records and mic_occurrence.schedule
 *    are not in the seed file, so they are null/absent here.
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
    street_name?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    country?: string;
  };
  venue_type: string | null;
  cost: string | null;
  stage_time: string | null;
  signup_instructions: string | null;
  host: string | null;
  instagram: string | null;
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
    website: null,
    email_address: null,
    venue_type: r.venue_type,
    stage_time: r.stage_time,
    other_rules: r.other_rules,
    mic_address: {
      venue: r.venue_name,
      street_name: r.address?.street_name ?? null,
      unit_number: 0,
      latitude: null,
      longitude: null,
      neighborhood: r.neighborhood,
    },
    mic_cost: r.cost ? { cost_amount: r.cost } : null,
    mic_occurrence: null,
  };
}

/** All mics as MicListItem, in snapshot (seed) order. */
export function allMics(): MicListItem[] {
  return records.map(toMicListItem);
}

/**
 * A single mic as MicDetail, by recovered id — the getMic fallback when the DB
 * is down. Detail-only fields absent from the seed (lat/long, phone, notes,
 * structured host records) are null/synthesized; the map component degrades to
 * a "View on Google Maps" link when lat/long is null. `venue_image` is left for
 * the caller to attach (avoids a circular import with mics.service).
 */
export function snapshotMicById(id: bigint | number): MicDetail | null {
  const wanted = String(id);
  const r = records.find((rec) => rec.id === wanted);
  if (!r) return null;
  return {
    ...toMicListItem(r),
    phone_number: null,
    notes: null,
    signup_instructions: r.signup_instructions ? { instructions: r.signup_instructions } : null,
    host_mics: r.host
      ? [{ mic_host: { first_host: r.host, email: null, instagram: r.instagram } }]
      : [],
  };
}

/** Total mic count — replaces prisma.mics.count() on the read surface. */
export const micCount = records.length;

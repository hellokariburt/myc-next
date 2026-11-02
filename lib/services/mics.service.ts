import { existsSync } from 'fs';
import { join } from 'path';
import { unstable_cache } from 'next/cache';
import prisma from '../prisma';
import { MicQueryParams, ALL_BOROUGHS, ALL_DAYS } from '../types/api';
import { clubArtDirectory, venueMatchesClub } from './clubs.service';
import { nameSlug } from '../utils/nameSlug';
import { isFreeCost } from '../utils/isFree';
import { allMics, snapshotMicById } from '../data/micsSnapshot';
import { MicListItem, MicListResponse } from '../types/mic';
import { serialize } from '../utils/serialize';
import { buildMicSlug, buildMicPath, type MicUrlSource } from '../utils/micUrl';

/**
 * Cache tag for every cached mic-listing read. Bust it with
 * `revalidateTag(MICS_CACHE_TAG)` after a mutation that changes live mics
 * (e.g. approving a submission) so the cached `/mics` + `/api/mics` payloads
 * refresh immediately instead of waiting out the revalidate window.
 */
export const MICS_CACHE_TAG = 'mics';

// Data cache lives for an hour; correctness between deploys relies on the tag
// bust above, not the TTL. A new deploy ships a cold cache anyway.
const MICS_CACHE_TTL = 3600;

// venue -> image lookup: club directory art first, then venue's own art
// (public/venue-art/<venue-slug>.<ext>); cached per lambda instance
let clubArtCache: { name: string; image: string }[] | null = null;
const venueArtCache = new Map<string, string | null>();

async function venueImageFor(venue: string | null | undefined): Promise<string | null> {
  if (!venue) return null;
  if (!clubArtCache) {
    clubArtCache = clubArtDirectory();
  }
  const hit = clubArtCache.find((c) => venueMatchesClub(venue, c.name));
  if (hit) return hit.image;

  const key = nameSlug(venue);
  if (venueArtCache.has(key)) return venueArtCache.get(key)!;
  let found: string | null = null;
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    if (existsSync(join(process.cwd(), 'public', 'venue-art', `${key}.${ext}`))) {
      found = `/venue-art/${key}.${ext}`;
      break;
    }
  }
  venueArtCache.set(key, found);
  return found;
}

const DAY_INDEX: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

// "today" in the city the mics are in, not the server's timezone. Exported
// because the Tonight pill has to agree with the today-first sort — a client
// computing this from the browser clock would disagree outside ET.
function nycDayName(): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    timeZone: 'America/New_York',
  })
    .format(new Date())
    .toLowerCase();
}

function nycDayIndex(): number {
  return DAY_INDEX[nycDayName()] ?? 0;
}

/**
 * Total mics per borough, ignoring the active filters. Used to weight the
 * borough chips and to hide boroughs with no inventory at all (Staten Island
 * currently has none). Deliberately unfiltered: these read as "how big is this
 * borough's scene", not "how many match your current query".
 */
// Seed every borough at 0 first: a borough with no mics needs to read as
// "zero mics" (chip hidden) rather than "counts unavailable" (empty object).
const seededBoroughCounts = (): Record<string, number> =>
  Object.fromEntries(ALL_BOROUGHS.map((b) => [b, 0]));

async function getBoroughCountsFromDb(): Promise<Record<string, number>> {
  const counts = seededBoroughCounts();
  const rows = await prisma.mics.groupBy({
    by: ['borough'],
    where: { active: true },
    _count: { _all: true },
  });
  for (const row of rows) {
    if (row.borough) counts[row.borough] = row._count._all;
  }
  return counts;
}

function boroughCountsFromSnapshot(): Record<string, number> {
  const counts = seededBoroughCounts();
  for (const m of allMics()) {
    if (m.borough) counts[m.borough] = (counts[m.borough] ?? 0) + 1;
  }
  return counts;
}

async function getBoroughCounts(): Promise<Record<string, number>> {
  try {
    return await getBoroughCountsFromDb();
  } catch {
    // DB unavailable (e.g. Neon compute-quota lockout) — count from the snapshot.
    return boroughCountsFromSnapshot();
  }
}

// "1970-01-01T14:00:00.000Z" -> "14:00:00" for HH:MM:SS string comparison.
function timeOfDay(startTime: string | null): string | null {
  return startTime ? startTime.slice(11, 19) : null;
}

const getMics = async (params: MicQueryParams) => {
  try {
    return await getMicsFromDb(params);
  } catch {
    // DB unavailable (e.g. Neon compute-quota lockout) — serve listings from the
    // snapshot. The map loses its pins in this window (the snapshot carries no
    // lat/long), but search and the cards stay up.
    return getMicsFromSnapshot(params);
  }
};

const getMicsFromDb = async (params: MicQueryParams) => {
  const boroughs = params.borough.length === 0 ? [...ALL_BOROUGHS] : params.borough;
  const days = params.day.length === 0 ? [...ALL_DAYS] : params.day;
  // Mirror isFreeCost (lib/utils/isFree.ts): empty/absent cost counts as free,
  // case-insensitive on a leading "free" — same predicate the Free badge uses.
  const freeFilter =
    params.cost === 'true'
      ? {
          OR: [
            { cost_id: null },
            { mic_cost: { is: { cost_amount: null } } },
            { mic_cost: { is: { cost_amount: '' } } },
            {
              mic_cost: {
                is: { cost_amount: { startsWith: 'free', mode: 'insensitive' as const } },
              },
            },
          ],
        }
      : null;
  const qFilter = params.q
    ? {
        OR: [
          { name: { contains: params.q, mode: 'insensitive' as const } },
          { mic_address: { is: { venue: { contains: params.q, mode: 'insensitive' as const } } } },
          {
            mic_address: {
              is: { neighborhood: { contains: params.q, mode: 'insensitive' as const } },
            },
          },
        ],
      }
    : null;

  const startTime =
    params.start_time !== '00:00:00' ? `1970-01-01T${params.start_time}.000Z` : undefined;

  // Both filters carry their own `OR`, so combine through `AND` — spreading them
  // into one object would silently drop whichever came first.
  const where = {
    active: true,
    day: { in: days },
    borough: { in: boroughs },
    ...(startTime && { start_time: { gte: startTime } }),
    AND: [freeFilter, qFilter].filter(Boolean) as object[],
  };

  // Order by relevance for a comic looking for stage time: today's mics first
  // (time ascending), then the rest of the week. Day-distance can't be expressed
  // in a Prisma orderBy, so sort a lightweight id list in JS and hydrate the page.
  const keys = await prisma.mics.findMany({
    where,
    select: { id: true, day: true, start_time: true },
  });
  const today = nycDayIndex();
  keys.sort((a, b) => {
    const da = ((DAY_INDEX[a.day || ''] ?? 7) - today + 7) % 7;
    const db = ((DAY_INDEX[b.day || ''] ?? 7) - today + 7) % 7;
    if (da !== db) return da - db;
    const ta = a.start_time ? a.start_time.getTime() : 0;
    const tb = b.start_time ? b.start_time.getTime() : 0;
    if (ta !== tb) return ta - tb;
    return Number(a.id - b.id);
  });
  const pageIds = keys.slice(params.offset, params.offset + params.limit).map((k) => k.id);

  const rows = await prisma.mics.findMany({
    include: { mic_address: true, mic_cost: true, mic_occurrence: true },
    where: { id: { in: pageIds } },
  });
  const byId = new Map(rows.map((r) => [r.id.toString(), r]));
  const ordered = pageIds
    .map((id) => byId.get(id.toString()))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  const mics = await Promise.all(
    ordered.map(async (m) => ({
      ...m,
      venue_image: await venueImageFor(m.mic_address?.venue),
    }))
  );

  return { mics, count: keys.length };
};

const getMicsFromSnapshot = async (params: MicQueryParams) => {
  const boroughSet = new Set(params.borough.length === 0 ? ALL_BOROUGHS : params.borough);
  const daySet = new Set(params.day.length === 0 ? ALL_DAYS : params.day);
  const q = params.q ? params.q.toLowerCase() : '';
  // start_time '00:00:00' means "no lower bound"; nulls are excluded once a
  // bound is set, matching the old Prisma `gte`.
  const timeFilter = params.start_time !== '00:00:00' ? params.start_time : null;

  const filtered = allMics().filter((m) => {
    if (!m.day || !daySet.has(m.day)) return false;
    if (!m.borough || !boroughSet.has(m.borough)) return false;
    if (timeFilter) {
      const t = timeOfDay(m.start_time);
      if (!t || t < timeFilter) return false;
    }
    // Mirror isFreeCost: empty/absent cost counts as free, case-insensitive
    // leading "free" — same predicate the Free badge uses.
    if (params.cost === 'true' && !isFreeCost(m.mic_cost?.cost_amount)) return false;
    if (q) {
      const haystack = [m.name, m.mic_address?.venue, m.mic_address?.neighborhood]
        .filter((s): s is string => Boolean(s))
        .map((s) => s.toLowerCase());
      if (!haystack.some((s) => s.includes(q))) return false;
    }
    return true;
  });

  // Order by relevance for a comic looking for stage time: today's mics first
  // (time ascending), then the rest of the week.
  const today = nycDayIndex();
  filtered.sort((a, b) => {
    const da = ((DAY_INDEX[a.day || ''] ?? 7) - today + 7) % 7;
    const db = ((DAY_INDEX[b.day || ''] ?? 7) - today + 7) % 7;
    if (da !== db) return da - db;
    const ta = timeOfDay(a.start_time) ?? '';
    const tb = timeOfDay(b.start_time) ?? '';
    if (ta !== tb) return ta < tb ? -1 : 1;
    return a.id - b.id;
  });

  const page = filtered.slice(params.offset, params.offset + params.limit);
  const mics: MicListItem[] = await Promise.all(
    page.map(async (m) => ({
      ...m,
      venue_image: await venueImageFor(m.mic_address?.venue),
    }))
  );

  return { mics, count: filtered.length };
};

// Stable, order-independent cache key for a filter combo. Borough/day arrays are
// sorted so ?borough=a,b and ?borough=b,a share one entry.
function micsCacheKey(p: MicQueryParams): string {
  return JSON.stringify([
    p.q ?? '',
    [...p.borough].sort(),
    [...p.day].sort(),
    p.start_time,
    p.cost,
    p.limit,
    p.offset,
  ]);
}

/**
 * The read surface for the dynamic `/mics` page and the `/api/mics` endpoint,
 * both of which are request-time (searchParams / force-dynamic) and so are NOT
 * covered by route-level ISR. Without this, every request — including each
 * distinct crawler filter combo — ran getMics against Neon and kept the
 * compute instance from auto-suspending.
 *
 * Only genuine DB results are cached: if Neon is down, getMicsFromDb throws,
 * we skip the cache and serve the snapshot uncached, so the cache repopulates
 * with real data the moment Neon recovers. Returns the already-serialized
 * envelope (BigInt ids -> numbers) so the value is cache-safe and both callers
 * can return it as-is.
 */
export async function getMicsResponseCached(params: MicQueryParams): Promise<MicListResponse> {
  // getMicsFromDb yields raw rows with BigInt ids; serialize() converts those to
  // numbers, producing the MicListResponse shape. Typed loosely here for that
  // reason (same cast the page/route used before).
  const toEnvelope = (mics: unknown[], count: number): MicListResponse =>
    serialize({
      totalMics: count,
      offset: params.offset,
      limit: params.limit,
      mics,
    }) as unknown as MicListResponse;

  try {
    return await unstable_cache(
      async () => {
        const { mics, count } = await getMicsFromDb(params);
        return toEnvelope(mics, count);
      },
      ['mics-list', micsCacheKey(params)],
      { revalidate: MICS_CACHE_TTL, tags: [MICS_CACHE_TAG] }
    )();
  } catch {
    const { mics, count } = await getMicsFromSnapshot(params);
    return toEnvelope(mics, count);
  }
}

/** Cached borough chip counts for the dynamic `/mics` page. See getMicsResponseCached. */
export async function getBoroughCountsCached(): Promise<Record<string, number>> {
  try {
    return await unstable_cache(getBoroughCountsFromDb, ['borough-counts'], {
      revalidate: MICS_CACHE_TTL,
      tags: [MICS_CACHE_TAG],
    })();
  } catch {
    return boroughCountsFromSnapshot();
  }
}

const getMic = async (id: bigint) => {
  try {
    const mic = await prisma.mics.findUnique({
      where: { id },
      include: {
        mic_address: true,
        mic_cost: true,
        mic_occurrence: true,
        signup_instructions: true,
        host_mics: {
          include: { mic_host: true },
        },
      },
    });
    if (!mic) return mic;
    return { ...mic, venue_image: await venueImageFor(mic.mic_address?.venue) };
  } catch {
    // DB unavailable (e.g. Neon compute-quota lockout) — serve from the snapshot.
    // Detail loses map/geo and structured host data until the DB is back.
    const snap = snapshotMicById(id);
    if (!snap) return null;
    return { ...snap, venue_image: await venueImageFor(snap.mic_address?.venue) };
  }
};

// Every current mic reduced to the fields buildMicSlug needs, for legacy-URL
// recovery. Cheap (~a few hundred rows, no relations beyond venue/neighborhood)
// and only hit on a 404, so no caching layer is warranted.
const listMicUrlSources = async (): Promise<MicUrlSource[]> => {
  try {
    return await prisma.mics.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
        borough: true,
        day: true,
        mic_address: { select: { venue: true, neighborhood: true } },
      },
    });
  } catch {
    // DB unavailable (e.g. Neon compute-quota lockout) — recover from the snapshot.
    return allMics().filter((m) => m.id);
  }
};

/**
 * Legacy-URL recovery for /mics/[id]. The mic table was reseeded and IDs shifted
 * into a new range, so URLs Google indexed under the old IDs now 404 even though
 * the same mic still exists under a new ID. The path slug
 * (`{id}-{name-venue-neighborhood-borough-day}`) is regenerable from any current
 * mic, so we strip the dead ID and match the slug against live mics.
 *
 * Returns the canonical path to 301 to, or null if nothing confidently matches
 * (caller should then notFound()).
 *
 * Exact-slug match only for now — it fires solely when a current mic produces the
 * identical slug, which means it IS the same mic under a new ID. A fuzzy
 * token-overlap fallback for slugs that drifted (renamed venue, tweaked title) is
 * intentionally deferred until the GSC "Not found (404)" export confirms how many
 * URLs need it and what they look like. See scripts/analyze-404s (TODO).
 */
export async function resolveLegacyMicPath(segment: string): Promise<string | null> {
  const slug = segment.replace(/^\d+-?/, '');
  if (!slug) return null; // bare old id with no slug — unrecoverable

  const candidates = await listMicUrlSources();
  const exact = candidates.find((m) => buildMicSlug(m) === slug);
  if (exact) {
    const path = buildMicPath(exact);
    // Guard against redirecting a URL to itself (would loop): only a genuinely
    // different id should ever reach here, but belt-and-suspenders.
    return path === `/mics/${segment}` ? null : path;
  }

  // TODO(B, gated on GSC export): fuzzy token-overlap match for drifted slugs.
  return null;
}

export { getMics, getMic, venueImageFor, getBoroughCounts, nycDayName };

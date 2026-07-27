import { existsSync } from 'fs';
import { join } from 'path';
import prisma from '../prisma';
import { MicQueryParams, ALL_BOROUGHS, ALL_DAYS } from '../types/api';
import { clubArtDirectory, venueMatchesClub } from './clubs.service';
import { nameSlug } from '../utils/nameSlug';
import { isFreeCost } from '../utils/isFree';
import { allMics, snapshotMicById } from '../data/micsSnapshot';
import { MicListItem } from '../types/mic';

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
async function getBoroughCounts(): Promise<Record<string, number>> {
  // Seed every borough at 0 first: a borough with no mics needs to read as
  // "zero mics" (chip hidden) rather than "counts unavailable" (empty object).
  const counts: Record<string, number> = Object.fromEntries(
    ALL_BOROUGHS.map((b) => [b, 0])
  );
  for (const m of allMics()) {
    if (m.borough) counts[m.borough] = (counts[m.borough] ?? 0) + 1;
  }
  return counts;
}

// "1970-01-01T14:00:00.000Z" -> "14:00:00" for HH:MM:SS string comparison.
function timeOfDay(startTime: string | null): string | null {
  return startTime ? startTime.slice(11, 19) : null;
}

const getMics = async (params: MicQueryParams) => {
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

export { getMics, getMic, venueImageFor, getBoroughCounts, nycDayName };

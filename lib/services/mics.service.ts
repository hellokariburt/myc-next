import { existsSync } from 'fs';
import { join } from 'path';
import prisma from '../prisma';
import { MicQueryParams, ALL_BOROUGHS, ALL_DAYS } from '../types/api';
import { getClubs, venueMatchesClub } from './clubs.service';
import { nameSlug } from '../utils/nameSlug';

// venue -> image lookup: club directory art first, then venue's own art
// (public/venue-art/<venue-slug>.<ext>); cached per lambda instance
let clubArtCache: { name: string; image: string }[] | null = null;
const venueArtCache = new Map<string, string | null>();

async function venueImageFor(venue: string | null | undefined): Promise<string | null> {
  if (!venue) return null;
  if (!clubArtCache) {
    const clubs = await getClubs();
    clubArtCache = clubs
      .filter((c) => c.image)
      .map((c) => ({ name: c.name, image: c.image as string }));
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

// "today" in the city the mics are in, not the server's timezone
function nycDayIndex(): number {
  const day = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    timeZone: 'America/New_York',
  })
    .format(new Date())
    .toLowerCase();
  return DAY_INDEX[day] ?? 0;
}

const getMics = async (params: MicQueryParams) => {
  const boroughs = params.borough.length === 0 ? [...ALL_BOROUGHS] : params.borough;
  const days = params.day.length === 0 ? [...ALL_DAYS] : params.day;
  const freeFilter = params.cost === 'true'
    ? { mic_cost: { cost_amount: { contains: 'Free' } } }
    : {};
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
    : {};

  const startTime =
    params.start_time !== '00:00:00' ? `1970-01-01T${params.start_time}.000Z` : undefined;

  const where = {
    day: { in: days },
    borough: { in: boroughs },
    ...freeFilter,
    ...qFilter,
    ...(startTime && { start_time: { gte: startTime } }),
  };

  // Order by relevance for a comic looking for stage time: today's mics
  // first (time ascending), then the rest of the week. Day-distance can't be
  // expressed in a Prisma orderBy, so sort a lightweight id list in JS and
  // hydrate the requested page.
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

const getMic = async (id: bigint) => {
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
};

export { getMics, getMic, venueImageFor };

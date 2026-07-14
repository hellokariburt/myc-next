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

const getMics = async (params: MicQueryParams) => {
  const boroughs = params.borough.length === 0 ? [...ALL_BOROUGHS] : params.borough;
  const days = params.day.length === 0 ? [...ALL_DAYS] : params.day;
  const freeFilter = params.cost === 'true'
    ? { mic_cost: { cost_amount: { contains: 'Free' } } }
    : {};

  const startTime =
    params.start_time !== '00:00:00' ? `1970-01-01T${params.start_time}.000Z` : undefined;

  const where = {
    day: { in: days },
    borough: { in: boroughs },
    ...freeFilter,
    ...(startTime && { start_time: { gte: startTime } }),
  };

  const [rows, count] = await prisma.$transaction([
    prisma.mics.findMany({
      include: { mic_address: true, mic_cost: true, mic_occurrence: true },
      where,
      orderBy: { id: 'asc' },
      skip: params.offset,
      take: params.limit,
    }),
    prisma.mics.count({ where }),
  ]);

  const mics = await Promise.all(
    rows.map(async (m) => ({
      ...m,
      venue_image: await venueImageFor(m.mic_address?.venue),
    }))
  );

  return { mics, count };
};

const getMic = async (id: bigint) =>
  prisma.mics.findUnique({
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

export { getMics, getMic };

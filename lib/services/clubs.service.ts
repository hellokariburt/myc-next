import { existsSync } from 'fs';
import { join } from 'path';
import { showSlug } from './shows.service';
import prisma from '../prisma';


// Optional imagery harvested from each club's own website.
// <name-slug>.<ext> = photo/banner (cover rendering); <name-slug>.logo.<ext> =
// logo fallback (contained rendering on a tinted band) used until a photo exists.
function findClubArt(name: string): string | null {
  const key = showSlug(name);
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    if (existsSync(join(process.cwd(), 'public', 'club-art', `${key}.${ext}`))) {
      return `/club-art/${key}.${ext}`;
    }
  }
  for (const ext of ['png', 'webp', 'jpg']) {
    if (existsSync(join(process.cwd(), 'public', 'club-art', `${key}.logo.${ext}`))) {
      return `/club-art/${key}.logo.${ext}`;
    }
  }
  return null;
}

export type ClubListItem = {
  id: string;
  name: string;
  address: string | null;
  zipcode: string | null;
  borough: string | null;
  neighborhood: string | null;
  website: string | null;
  instagram: string | null;
  description: string | null;
  latitude: string | null;
  longitude: string | null;
  image: string | null;
  micCount: number;
  showCount: number;
};

export function clubSlug(name: string): string {
  return showSlug(name);
}

const squash = (s: string | null | undefined) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

// venue-name match: club "The Stand" ~ mic venue "The Stand NYC", etc.
export function venueMatchesClub(venue: string | null | undefined, clubName: string): boolean {
  const v = squash(venue);
  const c = squash(clubName.replace(/\((williamsburg|east village)\)/i, ''));
  if (!v || v.length < 5 || !c) return false;
  return v.includes(c) || c.includes(v);
}

// All mics whose venue matches a club name (for club detail pages)
export async function getMicsAtClub(clubName: string) {
  const mics = await prisma.mics.findMany({
    include: { mic_address: true, mic_cost: true, mic_occurrence: true },
    orderBy: { id: 'asc' },
  });
  return mics.filter((m) => venueMatchesClub(m.mic_address?.venue, clubName));
}

export async function getClubs(): Promise<ClubListItem[]> {
  const [rows, micVenues] = await Promise.all([
    prisma.clubs.findMany({
      where: { NOT: { confirmed: { startsWith: 'Stale' } } },
      orderBy: [{ borough: 'asc' }, { name: 'asc' }],
    }),
    prisma.mic_address.findMany({
      select: { venue: true, mics: { select: { id: true } } },
    }),
  ]);

  const countsFor = (name: string) => ({
    micCount: micVenues
      .filter((a) => venueMatchesClub(a.venue, name))
      .reduce((n, a) => n + a.mics.length, 0),
    showCount: 0, // shows section dormant
  });

  return rows.map((c) => ({
    ...countsFor(c.name),
    id: String(c.id),
    name: c.name,
    address: c.address,
    zipcode: c.zipcode,
    borough: c.borough,
    neighborhood: c.neighborhood,
    website: c.website,
    instagram: c.instagram,
    description: c.description,
    latitude: c.latitude,
    longitude: c.longitude,
    image: findClubArt(c.name),
  }));
}

import { PrismaClient } from '@prisma/client';
import { existsSync } from 'fs';
import { join } from 'path';
import { showSlug } from './shows.service';

const prisma = new PrismaClient();

// Optional imagery harvested from each club's own website: public/club-art/<name-slug>.<ext>
function findClubArt(name: string): string | null {
  const key = showSlug(name);
  for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
    if (existsSync(join(process.cwd(), 'public', 'club-art', `${key}.${ext}`))) {
      return `/club-art/${key}.${ext}`;
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
  const rows = await prisma.clubs.findMany({
    where: { NOT: { confirmed: { startsWith: 'Stale' } } },
    orderBy: [{ borough: 'asc' }, { name: 'asc' }],
  });

  return rows.map((c) => ({
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

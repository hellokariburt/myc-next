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

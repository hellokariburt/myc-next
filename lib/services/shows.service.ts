import { PrismaClient } from '@prisma/client';
import { existsSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

export type ShowListItem = {
  id: string;
  name: string;
  venue: string | null;
  borough: string | null;
  neighborhood: string | null;
  day: string | null;
  time_text: string | null;
  instagram: string | null;
  schedule: string | null;
  location_note: string | null;
  latitude: string | null;
  longitude: string | null;
  image: string | null;
};

export function showSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Optional artwork: public/show-art/<instagram-handle>.<ext>, else <name-slug>.<ext>
function findShowArt(instagram: string | null, name: string): string | null {
  const keys = [instagram, showSlug(name)].filter(Boolean) as string[];
  for (const key of keys) {
    for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
      if (existsSync(join(process.cwd(), 'public', 'show-art', `${key}.${ext}`))) {
        return `/show-art/${key}.${ext}`;
      }
    }
  }
  return null;
}

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export async function getShows(): Promise<ShowListItem[]> {
  const rows = await prisma.shows.findMany({
    where: { NOT: { confirmed: { startsWith: 'Stale' } } },
    orderBy: [{ name: 'asc' }],
  });

  return rows
    .map((s) => ({
      id: String(s.id),
      name: s.name,
      venue: s.venue,
      borough: s.borough,
      neighborhood: s.neighborhood,
      day: s.day,
      time_text: s.time_text,
      instagram: s.instagram,
      schedule: s.schedule,
      location_note: s.location_note,
      latitude: s.latitude,
      longitude: s.longitude,
      image: findShowArt(s.instagram, s.name),
    }))
    .sort((a, b) => {
      const da = a.day ? DAY_ORDER.indexOf(a.day) : DAY_ORDER.length;
      const db = b.day ? DAY_ORDER.indexOf(b.day) : DAY_ORDER.length;
      if (da !== db) return da - db;
      return a.name.localeCompare(b.name);
    });
}

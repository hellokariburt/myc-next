import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';
import { buildMicUrl } from '@/lib/utils/micUrl';
import { allMics } from '@/lib/data/micsSnapshot';
import clubsSeed from '@/prisma/clubs-seed-data.json';

const boroughs = ['manhattan', 'brooklyn', 'queens', 'bronx', 'staten-island'];
const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const clubUrl = (name: string) =>
  `https://findopenmyc.com/clubs/${name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let micPages: MetadataRoute.Sitemap;
  let clubPages: MetadataRoute.Sitemap;

  try {
    const mics = await prisma.mics.findMany({
      select: {
        id: true,
        name: true,
        borough: true,
        day: true,
        mic_address: { select: { venue: true, neighborhood: true } },
      },
      orderBy: { id: 'asc' },
    });
    micPages = mics.map((mic) => ({
      url: buildMicUrl(mic),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    const clubs = await prisma.clubs.findMany({
      where: { NOT: { confirmed: { startsWith: 'Stale' } } },
      select: { name: true },
    });
    clubPages = clubs.map((c) => ({
      url: clubUrl(c.name),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch {
    // DB unavailable — build the URL set from the snapshot + club seed. Records
    // without a recovered id (id 0) are skipped rather than emit /mics/0-...
    micPages = allMics()
      .filter((m) => m.id)
      .map((m) => ({
        url: buildMicUrl(m),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    clubPages = (clubsSeed as { name: string; confirmed: string | null }[])
      .filter((c) => !(c.confirmed || '').toLowerCase().startsWith('stale'))
      .map((c) => ({
        url: clubUrl(c.name),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
  }

  const boroughPages = boroughs.map((b) => ({
    url: `https://findopenmyc.com/mics/${b}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const boroughDayPages = boroughs.flatMap((b) =>
    days.map((d) => ({
      url: `https://findopenmyc.com/mics/${b}/${d}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  );

  return [
    {
      url: 'https://findopenmyc.com',
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://findopenmyc.com/mics',
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://findopenmyc.com/mics/tonight',
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://findopenmyc.com/mics/free',
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://findopenmyc.com/clubs',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...clubPages,
    ...boroughPages,
    ...boroughDayPages,
    {
      url: 'https://findopenmyc.com/about',
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://findopenmyc.com/submit',
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://findopenmyc.com/contact',
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: 'https://findopenmyc.com/privacy',
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: 'https://findopenmyc.com/terms',
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...micPages,
  ];
}

import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';
import { guideArticles } from '@/lib/content/guides';
import { buildMicUrl } from '@/lib/utils/micUrl';

const boroughs = ['manhattan', 'brooklyn', 'queens', 'bronx', 'staten-island'];
const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const mics = await prisma.mics.findMany({
    select: {
      id: true,
      name: true,
      borough: true,
      day: true,
      mic_address: {
        select: {
          venue: true,
          neighborhood: true,
        },
      },
    },
    orderBy: { id: 'asc' },
  });

  const micPages = mics.map((mic) => ({
    url: buildMicUrl(mic),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const clubs = await prisma.clubs.findMany({
    where: { NOT: { confirmed: { startsWith: 'Stale' } } },
    select: { name: true },
  });
  const clubPages = clubs.map((c) => ({
    url: `https://findopenmyc.com/clubs/${c.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

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
      url: 'https://findopenmyc.com/shows',
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
      url: 'https://findopenmyc.com/guides',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...guideArticles.map((article) => ({
      url: `https://findopenmyc.com/guides/${article.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
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

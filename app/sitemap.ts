import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

const boroughs = ['manhattan', 'brooklyn', 'queens', 'bronx', 'staten-island'];
const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const mics = await prisma.mics.findMany({
    select: { id: true },
    orderBy: { id: 'asc' },
  });

  const micPages = mics.map((mic) => ({
    url: `https://findopenmyc.com/mics/${mic.id}`,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
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
    ...micPages,
  ];
}

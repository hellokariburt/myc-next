import prisma from '@/lib/prisma';
import { getUpcomingMics } from '@/lib/seo/upcomingMics';
import { serialize } from '@/lib/utils/serialize';
import { MicListItem } from '@/lib/types/mic';
import { HomePage } from '../components/homepage/HomePage';

export const revalidate = 300;

export default async function Page() {
  const [micCount, upcomingRaw] = await Promise.all([
    prisma.mics.count(),
    getUpcomingMics(4),
  ]);
  const upcoming = serialize(upcomingRaw) as unknown as MicListItem[];
  return <HomePage micCount={micCount} upcoming={upcoming} />;
}

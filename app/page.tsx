import prisma from '@/lib/prisma';
import { HomePage } from '../components/homepage/HomePage';

export const revalidate = 3600;

const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export default async function Page() {
  const micCount = await prisma.mics.count();
  const today = days[new Date().getDay()];

  return <HomePage micCount={micCount} today={today} />;
}

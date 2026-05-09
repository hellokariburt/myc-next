import prisma from '@/lib/prisma';
import { HomePage } from '../components/homepage/HomePage';

export const revalidate = 3600;

export default async function Page() {
  const micCount = await prisma.mics.count();
  return <HomePage micCount={micCount} />;
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SeoListingPage } from '@/components/seo/SeoListingPage';
import { generateBoroughDayMetadata, getBoroughDisplayName, capitalize, validDays } from '@/lib/seo/boroughDayPage';

export const revalidate = 3600;

const BOROUGH = 'bronx';

export async function generateStaticParams() {
  return validDays.map((day) => ({ day }));
}

export async function generateMetadata({ params }: { params: Promise<{ day: string }> }): Promise<Metadata> {
  const { day } = await params;
  if (!validDays.includes(day)) return {};
  return generateBoroughDayMetadata(BOROUGH, day);
}

export default async function Page({ params }: { params: Promise<{ day: string }> }) {
  const { day } = await params;
  if (!validDays.includes(day)) notFound();

  return (
    <SeoListingPage
      title={`${capitalize(day)} Open Mics in ${getBoroughDisplayName(BOROUGH)}`}
      subtitle={`Every ${capitalize(day)} comedy open mic in ${getBoroughDisplayName(BOROUGH)}, NYC`}
      borough={[BOROUGH]}
      day={[day]}
    />
  );
}

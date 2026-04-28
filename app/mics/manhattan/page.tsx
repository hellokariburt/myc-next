import type { Metadata } from 'next';
import { SeoListingPage } from '@/components/seo/SeoListingPage';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Open Mics in Manhattan | OpenMYC',
  description: 'Find every comedy open mic in Manhattan, NYC. Browse by day, time, and cost. Free to use.',
  openGraph: {
    title: 'Open Mics in Manhattan | OpenMYC',
    description: 'Find every comedy open mic in Manhattan, NYC.',
    url: 'https://findopenmyc.com/mics/manhattan',
  },
};

export default function Page() {
  return (
    <SeoListingPage
      title="Open Mics in Manhattan"
      subtitle="Every comedy open mic in Manhattan, NYC"
      borough={['manhattan']}
    />
  );
}

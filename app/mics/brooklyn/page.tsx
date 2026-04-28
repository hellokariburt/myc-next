import type { Metadata } from 'next';
import { SeoListingPage } from '@/components/seo/SeoListingPage';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Open Mics in Brooklyn | OpenMYC',
  description: 'Find every comedy open mic in Brooklyn, NYC. Browse by day, time, and cost. Free to use.',
  openGraph: {
    title: 'Open Mics in Brooklyn | OpenMYC',
    description: 'Find every comedy open mic in Brooklyn, NYC.',
    url: 'https://findopenmyc.com/mics/brooklyn',
  },
};

export default function Page() {
  return (
    <SeoListingPage
      title="Open Mics in Brooklyn"
      subtitle="Every comedy open mic in Brooklyn, NYC"
      borough={['brooklyn']}
    />
  );
}

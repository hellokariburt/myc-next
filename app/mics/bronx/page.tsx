import type { Metadata } from 'next';
import { SeoListingPage } from '@/components/seo/SeoListingPage';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Open Mics in the Bronx | OpenMYC',
  description: 'Find every comedy open mic in the Bronx, NYC. Browse by day, time, and cost. Free to use.',
  openGraph: {
    title: 'Open Mics in the Bronx | OpenMYC',
    description: 'Find every comedy open mic in the Bronx, NYC.',
    url: 'https://findopenmyc.com/mics/bronx',
  },
};

export default function Page() {
  return (
    <SeoListingPage
      title="Open Mics in the Bronx"
      subtitle="Every comedy open mic in the Bronx, NYC"
      borough={['bronx']}
    />
  );
}

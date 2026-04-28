import type { Metadata } from 'next';
import { SeoListingPage } from '@/components/seo/SeoListingPage';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Open Mics in Staten Island | OpenMYC',
  description: 'Find every comedy open mic in Staten Island, NYC. Browse by day, time, and cost. Free to use.',
  openGraph: {
    title: 'Open Mics in Staten Island | OpenMYC',
    description: 'Find every comedy open mic in Staten Island, NYC.',
    url: 'https://findopenmyc.com/mics/staten-island',
  },
};

export default function Page() {
  return (
    <SeoListingPage
      title="Open Mics in Staten Island"
      subtitle="Every comedy open mic in Staten Island, NYC"
      borough={['staten-island']}
    />
  );
}

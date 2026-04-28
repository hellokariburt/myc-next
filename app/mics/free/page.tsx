import type { Metadata } from 'next';
import { SeoListingPage } from '@/components/seo/SeoListingPage';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Free Open Mics in NYC | OpenMYC',
  description: 'Find every free comedy open mic in New York City. No cover, no drink minimum. Browse by borough and day.',
  openGraph: {
    title: 'Free Open Mics in NYC | OpenMYC',
    description: 'Find every free comedy open mic in New York City.',
    url: 'https://findopenmyc.com/mics/free',
  },
};

export default function Page() {
  return (
    <SeoListingPage
      title="Free Open Mics in NYC"
      subtitle="Every free comedy open mic across the 5 boroughs"
      free
    />
  );
}

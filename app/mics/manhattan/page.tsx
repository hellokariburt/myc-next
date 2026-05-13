import type { Metadata } from 'next';
import { SeoListingPage } from '@/components/seo/SeoListingPage';
import { getBoroughBreadcrumbs } from '@/lib/seo/boroughDayPage';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Open Mics in Manhattan | OpenMYC',
  description: 'Find every comedy open mic in Manhattan, NYC. Browse by day, time, and cost. Free to use.',
  alternates: { canonical: 'https://findopenmyc.com/mics/manhattan' },
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
      borough={['manhattan']}
      boroughKey="manhattan"
      breadcrumbs={getBoroughBreadcrumbs('manhattan')}
      pageUrl="https://findopenmyc.com/mics/manhattan"
      dayLinksBorough="manhattan"
    />
  );
}

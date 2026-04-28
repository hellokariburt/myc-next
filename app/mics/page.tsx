import type { Metadata } from 'next';
import { Suspense } from 'react';
import { MicListingPage2 } from '../../components/miclistingpage/MicListingPage';

export const metadata: Metadata = {
  title: 'Browse NYC Open Mics | OpenMYC',
  description:
    'Browse and filter comedy open mics across Manhattan, Brooklyn, Queens, the Bronx, and Staten Island. Filter by day, time, borough, and cost.',
  openGraph: {
    title: 'Browse NYC Open Mics | OpenMYC',
    description:
      'Browse and filter comedy open mics across all 5 NYC boroughs.',
    url: 'https://findopenmyc.com/mics',
  },
};

export default function Page() {
  return (
    <Suspense>
      <MicListingPage2 />
    </Suspense>
  );
}

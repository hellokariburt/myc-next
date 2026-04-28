import type { Metadata } from 'next';
import { SeoListingPage } from '@/components/seo/SeoListingPage';

export const revalidate = 60;

const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export async function generateMetadata(): Promise<Metadata> {
  const today = capitalize(days[new Date().getDay()]);
  return {
    title: `Open Mics Tonight in NYC — ${today} | OpenMYC`,
    description: `Find every comedy open mic happening tonight (${today}) in New York City. Browse by borough and cost.`,
    openGraph: {
      title: `Open Mics Tonight in NYC — ${today} | OpenMYC`,
      description: `Every comedy open mic happening tonight in NYC.`,
      url: 'https://findopenmyc.com/mics/tonight',
    },
  };
}

export default function Page() {
  const today = days[new Date().getDay()];
  return (
    <SeoListingPage
      title={`Open Mics Tonight — ${capitalize(today)}`}
      subtitle={`Every comedy open mic happening tonight in NYC`}
      day={[today]}
    />
  );
}

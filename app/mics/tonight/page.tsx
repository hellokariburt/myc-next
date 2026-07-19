import type { Metadata } from 'next';
import { SeoListingPage } from '@/components/seo/SeoListingPage';
import { nycDayName } from '@/lib/services/mics.service';

export const revalidate = 60;

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export async function generateMetadata(): Promise<Metadata> {
  // Must be NYC time, not the server's: Vercel runs UTC, so a local-clock
  // getDay() rolls over to tomorrow at 7/8pm ET — the exact hours this page
  // is for. getMics sorts by the same NYC day, so this keeps them agreeing.
  const today = capitalize(nycDayName());
  return {
    title: `Open Mics Tonight in NYC — ${today} | OpenMYC`,
    description: `Find every comedy open mic happening tonight (${today}) in New York City. Browse by borough and cost.`,
    alternates: { canonical: 'https://findopenmyc.com/mics/tonight' },
    openGraph: {
      title: `Open Mics Tonight in NYC — ${today} | OpenMYC`,
      description: `Every comedy open mic happening tonight in NYC.`,
      url: 'https://findopenmyc.com/mics/tonight',
    },
  };
}

export default function Page() {
  const today = nycDayName();
  return (
    <SeoListingPage
      title={`Open Mics Tonight — ${capitalize(today)}`}
      day={[today]}
      breadcrumbs={[
        { name: 'Home', url: 'https://findopenmyc.com/' },
        { name: 'Open Mics', url: 'https://findopenmyc.com/mics' },
        { name: 'Tonight', url: 'https://findopenmyc.com/mics/tonight' },
      ]}
      pageUrl="https://findopenmyc.com/mics/tonight"
    />
  );
}

import type { Metadata } from 'next';
import { ALL_DAYS } from '@/lib/types/api';

const boroughNames: Record<string, string> = {
  manhattan: 'Manhattan',
  brooklyn: 'Brooklyn',
  queens: 'Queens',
  bronx: 'the Bronx',
  'staten-island': 'Staten Island',
};

export function getBoroughDisplayName(slug: string): string {
  return boroughNames[slug] || slug;
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const validDays = [...ALL_DAYS] as string[];

export interface Breadcrumb {
  name: string;
  url: string;
}

export function getBoroughBreadcrumbs(borough: string): Breadcrumb[] {
  return [
    { name: 'Home', url: 'https://findopenmyc.com/' },
    { name: 'Open Mics', url: 'https://findopenmyc.com/mics' },
    { name: getBoroughDisplayName(borough), url: `https://findopenmyc.com/mics/${borough}` },
  ];
}

export function getBoroughDayBreadcrumbs(borough: string, day: string): Breadcrumb[] {
  return [
    ...getBoroughBreadcrumbs(borough),
    { name: capitalize(day), url: `https://findopenmyc.com/mics/${borough}/${day}` },
  ];
}

export function generateBoroughDayMetadata(borough: string, day: string): Metadata {
  const boroughName = getBoroughDisplayName(borough);
  const dayName = capitalize(day);
  const title = `${dayName} Open Mics in ${boroughName} | OpenMYC`;
  const description = `Find every ${dayName} comedy open mic in ${boroughName}, NYC. Browse by time and cost. Free to use.`;

  return {
    title,
    description,
    alternates: { canonical: `https://findopenmyc.com/mics/${borough}/${day}` },
    openGraph: {
      title,
      description,
      url: `https://findopenmyc.com/mics/${borough}/${day}`,
    },
  };
}

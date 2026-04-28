import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getMics } from '@/lib/services/mics.service';
import { serialize } from '@/lib/utils/serialize';
import { parseParams } from '@/lib/api/parseParams';
import { MicListResponse } from '@/lib/types/mic';
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

async function fetchInitialMics(
  searchParams: Record<string, string | string[] | undefined>
): Promise<MicListResponse | undefined> {
  try {
    const urlParams = new URLSearchParams();
    for (const [key, val] of Object.entries(searchParams)) {
      if (val !== undefined) {
        urlParams.set(key, Array.isArray(val) ? val.join(',') : val);
      }
    }

    // Convert page-based params to offset/limit (same logic as useMicSearch)
    const pageNo = parseInt(urlParams.get('pageNo') || '1', 10);
    const pageSize = parseInt(urlParams.get('pageSize') || '10', 10);
    urlParams.set('offset', String((pageNo - 1) * pageSize));
    urlParams.set('limit', String(pageSize));
    urlParams.delete('pageNo');
    urlParams.delete('pageSize');

    const parsed = parseParams(urlParams);
    if (typeof parsed === 'string') return undefined;

    const { mics, count } = await getMics(parsed);
    return serialize({
      totalMics: count,
      offset: parsed.offset,
      limit: parsed.limit,
      mics,
    }) as unknown as MicListResponse;
  } catch {
    return undefined;
  }
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const serverData = await fetchInitialMics(params);

  return (
    <Suspense>
      <MicListingPage2 serverData={serverData} />
    </Suspense>
  );
}

import type { Metadata } from 'next';
import { Suspense } from 'react';
import {
  getMicsResponseCached,
  getMicPinsCached,
  getBoroughCountsCached,
  nycDayName,
} from '@/lib/services/mics.service';
import { parseParams } from '@/lib/api/parseParams';
import { MicQueryParams } from '@/lib/types/api';
import { MicListResponse } from '@/lib/types/mic';
import { DEFAULT_PAGE_SIZE } from '@/lib/constants/pagination';
import { MicListingPage2 } from '../../components/miclistingpage/MicListingPage';
import AdSenseScript from '../../components/ads/AdSenseScript';

export const metadata: Metadata = {
  title: 'Browse NYC Open Mics | OpenMYC',
  description:
    'Browse and filter comedy open mics across Manhattan, Brooklyn, Queens, the Bronx, and Staten Island. Filter by day, time, borough, and cost.',
  alternates: { canonical: 'https://findopenmyc.com/mics' },
  openGraph: {
    title: 'Browse NYC Open Mics | OpenMYC',
    description: 'Browse and filter comedy open mics across all 5 NYC boroughs.',
    url: 'https://findopenmyc.com/mics',
  },
};

// Parse incoming searchParams into service params once, converting page-based
// params to offset/limit (same logic as useMicSearch). Returns null on bad input.
function parseMicParams(
  searchParams: Record<string, string | string[] | undefined>
): MicQueryParams | null {
  const urlParams = new URLSearchParams();
  for (const [key, val] of Object.entries(searchParams)) {
    if (val !== undefined) {
      urlParams.set(key, Array.isArray(val) ? val.join(',') : val);
    }
  }

  const pageNo = parseInt(urlParams.get('pageNo') || '1', 10);
  const pageSize = parseInt(urlParams.get('pageSize') || String(DEFAULT_PAGE_SIZE), 10);
  urlParams.set('offset', String((pageNo - 1) * pageSize));
  urlParams.set('limit', String(pageSize));
  urlParams.delete('pageNo');
  urlParams.delete('pageSize');

  const parsed = parseParams(urlParams);
  return typeof parsed === 'string' ? null : parsed;
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const parsed = parseMicParams(params);

  const [serverData, serverPins, boroughCounts] = await Promise.all([
    parsed ? getMicsResponseCached(parsed).catch(() => undefined) : undefined,
    // Map pins for the same filters, independent of the page slice. Cached under
    // a pagination-normalized key, so it's one read per filter combo.
    parsed ? getMicPinsCached(parsed).catch(() => undefined) : undefined,
    getBoroughCountsCached().catch(() => ({})),
  ]);

  return (
    <>
      <AdSenseScript />
      <Suspense>
        <MicListingPage2
          serverData={serverData}
          serverPins={serverPins}
          boroughCounts={boroughCounts}
          today={nycDayName()}
        />
      </Suspense>
    </>
  );
}

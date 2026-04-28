'use client';

import dynamic from 'next/dynamic';
import MicCard from '../mic/MicCard';
import PageLayout from '../pagelayout/PageLayout';
import { useMicSearch } from '@/lib/hooks/useMicSearch';
import { MicListResponse } from '@/lib/types/mic';

const MicMapLoad = dynamic(() => import('../map/MicMapLoad'), {
  ssr: false,
  loading: () => <div className="w-full h-[65vh] lg:fixed lg:top-0 lg:right-0 lg:w-[50vw] lg:h-[95vh] bg-slate-100 animate-pulse" />,
});

export function MicListingPage2({ serverData }: { serverData?: MicListResponse }) {
  const { mics, isLoading } = useMicSearch(serverData);

  return (
    <PageLayout className="pb-16 bg-[#F5F5F5] bg-cover" hasFilter>
      <MicCard serverData={serverData} />
      <MicMapLoad mics={mics} isLoading={isLoading} />
    </PageLayout>
  );
}

'use client';

import dynamic from 'next/dynamic';
import MicCard from '../mic/MicCard';
import PageLayout from '../pagelayout/PageLayout';
import { useMicSearch } from '@/lib/hooks/useMicSearch';
import { MicListResponse } from '@/lib/types/mic';

const MicMapLoad = dynamic(() => import('../map/MicMapLoad'), {
  ssr: false,
  loading: () => <div className="w-full h-[65vh] lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:self-start bg-slate-100 animate-pulse" />,
});

export function MicListingPage2({ serverData }: { serverData?: MicListResponse }) {
  const { mics, isLoading } = useMicSearch(serverData);

  return (
    <PageLayout className="pb-16 bg-slate-50 bg-cover" hasFilter>
      <div className="lg:grid lg:grid-cols-[1fr_minmax(380px,40vw)] lg:gap-4 lg:px-4">
        <MicCard serverData={serverData} />
        <MicMapLoad mics={mics} isLoading={isLoading} />
      </div>
    </PageLayout>
  );
}

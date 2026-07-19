'use client';

import dynamic from 'next/dynamic';
import MicCard from '../mic/MicCard';
import MicsQuickChrome from '../mic/MicsQuickChrome';
import PageLayout from '../pagelayout/PageLayout';
import { useMicSearch } from '@/lib/hooks/useMicSearch';
import { MicListResponse } from '@/lib/types/mic';

const MicMapLoad = dynamic(() => import('../map/MicMapLoad'), {
  ssr: false,
  loading: () => <div className="w-full h-[65vh] lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:self-start bg-slate-100 animate-pulse" />,
});

export function MicListingPage2({
  serverData,
  boroughCounts = {},
  today,
}: {
  serverData?: MicListResponse;
  boroughCounts?: Record<string, number>;
  today?: string;
}) {
  const { mics, isLoading } = useMicSearch(serverData);

  // No `hasFilter`: the header Filter used to render here too, and its Search
  // button rebuilt the URL from scratch via buildMicSearchUrl — which has no
  // `q` field, so it silently dropped the active text search while the search
  // box kept displaying the discarded term. MicsQuickChrome patches params
  // instead of rebuilding them, so it is now the only filter surface here.
  return (
    <PageLayout className="pb-16 bg-[#f6efe4] bg-cover">
      <div className="lg:grid lg:grid-cols-[1fr_minmax(380px,40vw)] lg:gap-4 lg:px-4">
        <div>
          <div className="px-3 pt-4 sm:px-6 lg:px-0">
            <MicsQuickChrome
              boroughCounts={boroughCounts}
              today={today}
              totalMics={mics?.totalMics}
            />
          </div>
          <MicCard serverData={serverData} />
        </div>
        <MicMapLoad mics={mics} isLoading={isLoading} />
      </div>
    </PageLayout>
  );
}

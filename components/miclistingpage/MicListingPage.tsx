'use client';

import dynamic from 'next/dynamic';
import MicCard from '../mic/MicCard';
import MicsQuickChrome from '../mic/MicsQuickChrome';
import PageLayout from '../pagelayout/PageLayout';
import { useMicSearch } from '@/lib/hooks/useMicSearch';
import { useMicPins } from '@/lib/hooks/useMicPins';
import { MicListResponse } from '@/lib/types/mic';
import { MicHoverProvider } from '../mic/MicHoverContext';

const MicMapLoad = dynamic(() => import('../map/MicMapLoad'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[65vh] lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:self-start bg-slate-100 animate-pulse" />
  ),
});

export function MicListingPage2({
  serverData,
  serverPins,
  boroughCounts = {},
  today,
}: {
  serverData?: MicListResponse;
  serverPins?: MicListResponse;
  boroughCounts?: Record<string, number>;
  today?: string;
}) {
  const { mics } = useMicSearch(serverData);
  // The map plots the full filtered set (capped), not the current page slice, so
  // it's driven by its own filter-keyed query — it does not refetch on paging.
  const { pins } = useMicPins(serverPins);

  // MicsQuickChrome is the only filter surface here. The header Filter that
  // used to render alongside it rebuilt the URL from scratch via
  // buildMicSearchUrl — which has no `q` field, so it silently dropped the
  // active text search while the search box kept displaying the discarded
  // term. That component has since been deleted outright.
  return (
    <PageLayout className="pb-16 bg-[#f6efe4] bg-cover">
      <MicHoverProvider>
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
          <MicMapLoad mics={pins} isLoading={!pins} />
        </div>
      </MicHoverProvider>
    </PageLayout>
  );
}

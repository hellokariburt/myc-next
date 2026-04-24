'use client';

import MicCard from '../mic/MicCard';
import PageLayout from '../pagelayout/PageLayout';
import { useMicSearch } from '@/lib/hooks/useMicSearch';
import MicMapLoad from '../map/MicMapLoad';

export function MicListingPage2() {
  const { mics, isLoading } = useMicSearch();

  return (
    <PageLayout className="pb-16 bg-[#F5F5F5] bg-cover h-full" hasFilter hasMobileFilter>
      <MicCard />
      <MicMapLoad mics={mics} isLoading={isLoading} />
    </PageLayout>
  );
}

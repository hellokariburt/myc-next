'use client';

import { useContext } from 'react';
import MicCard from '../mic/MicCard';
import PageLayout from '../pagelayout/PageLayout';
import { MicListingContext } from '@/lib/context/MicListingContext';
import MicMapLoad from '../map/MicMapLoad';
// import ChatPagination2 from '../pagination/ChatPagination2';

export function MicListingPage2() {
  const { mics, isLoading } = useContext(MicListingContext);

  return (
    <PageLayout className="pb-16 bg-[#F5F5F5] bg-cover h-full" hasFilter hasMobileFilter>
      <MicCard />
      {/* <ChatPagination2 /> */}
      <MicMapLoad mics={mics} isLoading={isLoading} />
    </PageLayout>
  );
}

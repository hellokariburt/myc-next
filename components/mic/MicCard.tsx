'use client';

import { useMicSearch } from '@/lib/hooks/useMicSearch';
import { MicListItem, MicListResponse } from '@/lib/types/mic';
import ChatPagination2 from '../pagination/ChatPagination2';
import { SearchResults } from './SearchResults';
import NoMicFound from '../not-found/NoMicFound';
import AdBanner from '../ads/AdBanner';
import MicListCard from './MicListCard';

const MicCard = ({ serverData }: { serverData?: MicListResponse }) => {
  const { mics, isLoading, isError } = useMicSearch(serverData);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center pt-12 min-h-[60vh] relative z-10 lg:w-[50vw] text-slate-600">
        <p className="text-xl font-bold">Something went wrong loading mics.</p>
        <p className="text-sm text-slate-500 pt-2">Try refreshing the page.</p>
      </div>
    );
  }

  if (!mics || isLoading) {
    return (
      <div className="flex pt-12 justify-center min-h-[100vh] relative z-10 lg:w-[50vw]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (mics?.mics?.length === 0) {
    return (
      <div className="flex justify-center pt-12 lg:w-[50vw]">
        <NoMicFound />
      </div>
    );
  }

  const mapMicsToCards = (x: MicListResponse) => {
    const items: React.ReactNode[] = [];
    x.mics.forEach((mic: MicListItem, index: number) => {
      items.push(
        <MicListCard
          key={mic.id}
          mic={mic}
          className="w-full lg:max-w-[calc(50vw-50px)]"
        />
      );
      if ((index + 1) % 5 === 0) {
        items.push(<AdBanner key={`ad-${index}`} />);
      }
    });
    return items;
  };

  const openMic = mapMicsToCards(mics);

  return (
    <div className="flex flex-col justify-between px-3 py-6 sm:p-6 min-h-[100vh] lg:w-[50vw]">
      {mics && <SearchResults />}
      <div className="flex flex-col gap-3">{openMic}</div>
      <div className="flex justify-center pt-8">
        {mics && <ChatPagination2 />}
      </div>
    </div>
  );
};

export default MicCard;

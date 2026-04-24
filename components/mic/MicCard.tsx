'use client';

import { useRouter } from 'next/navigation';
import { useMicSearch } from '@/lib/hooks/useMicSearch';
import changeTime from '@/lib/utils/changeTime';
import ChatPagination2 from '../pagination/ChatPagination2';
import capitalizeDay from '@/lib/utils/capitalizeDay';
import { SearchResults } from './SearchResults';
import NoMicFound from '../not-found/NoMicFound';
import AdBanner from '../ads/AdBanner';

const MicCard = () => {
  const { mics, isLoading, isError } = useMicSearch();
  const router = useRouter();

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center pt-12 min-h-[60vh] relative z-10 lg:w-[50vw] text-slate-600">
        <p className="text-xl font-bold">Something went wrong loading mics.</p>
        <p className="text-sm text-slate-400 pt-2">Try refreshing the page.</p>
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

  const mapMicsToCards = (x: any) => {
    const items: React.ReactNode[] = [];
    x?.mics.forEach((mic: any, index: number) => {
      items.push(
        <button
          type="button"
          onClick={() => router.push(`/mics/${mic?.id}`)}
          aria-label={`${mic?.name} — ${capitalizeDay(mic?.day.toString())} at ${changeTime(mic?.start_time)}, ${mic?.mic_cost?.cost_amount || 'Free'}`}
          className="flex group w-full lg:max-w-[calc(50vw-50px)] bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-500 cursor-pointer shadow-md text-left transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          key={mic?.id}
        >
          <div className="flex flex-row gap-3 lg:gap-6 min-w-0">
            <div className="pr-2 lg:pr-4 pt-1 border-r-2 border-slate-300 text-sm lg:text-base shrink-0 w-[80px] lg:w-auto">
              <p className="font-bold">{capitalizeDay(mic?.day.toString())}</p>
              <p>{changeTime(mic?.start_time)}</p>
              {mic?.mic_occurrence?.schedule && (
                <p className="text-slate-500 text-xs lg:text-sm pt-4">{mic.mic_occurrence.schedule}</p>
              )}
            </div>
            <div className="min-w-0">
              <p className="lg:text-2xl text-lg font-bold text-blue-700 group-hover:decoration-dashed group-hover:underline truncate">
                {mic?.name}
              </p>
              <p className="text-slate-700 font-bold text-sm lg:text-base truncate">{mic.mic_address.venue}</p>
              <div className="flex flex-row flex-wrap text-slate-600 text-sm lg:text-base">
                {mic.mic_address.unit_number > 0 && (
                  <span className="pr-1">{mic.mic_address.unit_number} </span>
                )}
                <span className="pr-1">{mic.mic_address.street_name},</span>
                <span className="font-bold">{capitalizeDay(mic.borough.toString())}</span>
              </div>
              <div className="pt-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs lg:text-sm font-medium ${
                  mic?.mic_cost?.cost_amount?.toLowerCase().includes('free')
                    ? 'bg-green-50 text-green-700'
                    : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {mic?.mic_cost?.cost_amount || 'Free'}
                </span>
              </div>
            </div>
          </div>
        </button>
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

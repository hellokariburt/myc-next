'use client';

import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { MicListingContext } from '@/lib/context/MicListingContext';
import changeTime from '@/lib/utils/changeTime';
import ChatPagination2 from '../pagination/ChatPagination2';
import capitalizeDay from '@/lib/utils/capitalizeDay';
import { SearchResults } from './SearchResults';
import NoMicFound from '../not-found/NoMicFound';
import AdBanner from '../ads/AdBanner';

const MicCard = () => {
  const { mics, isLoading } = useContext(MicListingContext);
  const router = useRouter();

  if (!mics || isLoading) {
    return (
      <div className="flex pt-12 justify-center min-h-[100vh] relative z-10">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (mics?.mics?.length === 0) {
    return (
      <div className="flex justify-center pt-12">
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
          className="flex group lg:max-w-[calc(50vw-50px)] min-w-[320px] bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-500 cursor-pointer shadow-md text-left transition-all"
          key={mic?.id}
        >
          <div className="flex flex-row gap-3 lg:gap-10">
            <div className="pr-2 lg:pr-4 pt-2 border-r-2 border-slate-300 text-base">
              <p className="pr-1 font-bold">{capitalizeDay(mic?.day.toString())}</p>
              <p>{changeTime(mic?.start_time)}</p>
              <p className="text-slate-500 text-sm pt-10">{mic?.mic_occurrence?.schedule}</p>
            </div>
            <div>
              <h2 className="lg:text-3xl text-2xl font-bold text-blue-700 group-hover:decoration-dashed group-hover:underline">
                {mic?.name}
              </h2>
              <div className="pr-1 text-slate-700 font-bold">{mic.mic_address.venue}</div>
              <div className="flex flex-row flex-wrap text-slate-600 text-base">
                {mic.mic_address.unit_number ? (
                  <p className="pr-1">{mic.mic_address.unit_number} </p>
                ) : null}
                <p className="pr-1">{mic.mic_address.street_name},</p>
                <p className="font-bold">{capitalizeDay(mic.borough.toString())}</p>
              </div>
              <div className="flex flex-row pt-3 text-base">
                <p className="pr-1">Cost: </p>
                <p className="font-bold">
                  {mic?.mic_cost?.cost_amount || 'Free'}
                </p>
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
    <div className="flex flex-col justify-between p-6 min-h-[100vh]">
      {mics && <SearchResults />}
      <div className="flex flex-col gap-2">{openMic}</div>
      <div className="flex justify-center pt-8">
        {mics && <ChatPagination2 />}
      </div>
    </div>
  );
};

export default MicCard;

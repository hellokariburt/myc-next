'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BoroughSelect from '../select/BoroughSelect';
import DaySelect from '../select/DaySelect';
import FreeSwitch from '../select/FreeSwitch';
import SearchButton from '../select/SearchButton';
import TimeSelect from '../select/TimeSelect';
import { buildMicSearchUrl } from '@/lib/utils/buildMicSearchUrl';

const SearchCard = () => {
  const [day, setDay] = useState('');
  const [borough, setBorough] = useState<string[]>([]);
  const [free, setFree] = useState(false);
  const [startTime, setStartTime] = useState('');

  const router = useRouter();

  const handleSearch = () => {
    router.push(buildMicSearchUrl({ borough, day, startTime, free }));
  };

  return (
    <div className="w-full md:max-w-4xl pb-12">
      <div className="flex flex-col mx-4 shadow-md border border-slate-200 rounded-xl p-6 gap-4 mt-4 bg-white">
        <div className="flex flex-col md:flex-row gap-4 md:mb-2 md:items-center justify-center">
          <BoroughSelect value={borough} setValue={setBorough} />

          <DaySelect value={day} setValue={setDay} />

          <TimeSelect value={startTime} setValue={setStartTime} timePeriod="Start after" />

          <FreeSwitch checked={free} setChecked={setFree} />
        </div>

        <SearchButton onClick={handleSearch} />
      </div>
    </div>
  );
};

export default SearchCard;

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconSearch } from '@tabler/icons-react';
import BoroughSelect from '../select/BoroughSelect';
import DaySelect from '../select/DaySelect';
import FreeSwitch from '../select/FreeSwitch';
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
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <BoroughSelect value={borough} setValue={setBorough} />
          <DaySelect value={day} setValue={setDay} />
          <TimeSelect value={startTime} setValue={setStartTime} />
          <FreeSwitch checked={free} setChecked={setFree} />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          aria-label="Search for mics"
          className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full text-base transition-colors"
        >
          <IconSearch size={20} />
          Search for mics
        </button>
      </div>
    </div>
  );
};

export default SearchCard;

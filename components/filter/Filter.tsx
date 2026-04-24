'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { IconSearch } from '@tabler/icons-react';
import BoroughSelect from '../select/BoroughSelect';
import DaySelect from '../select/DaySelect';
import FreeSwitch from '../select/FreeSwitch';
import TimeSelect from '../select/TimeSelect';
import { buildMicSearchUrl } from '@/lib/utils/buildMicSearchUrl';

const Filter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const allBoroughsArray = searchParams.get('borough')?.split(',') || [];
  const boroughsArray = allBoroughsArray.includes('all') ? [] : allBoroughsArray;

  const daysArray = !searchParams.get('day') || searchParams.get('day')?.includes('all') ? '' : searchParams.get('day');

  const rawTime = searchParams.get('start-time');
  const startTimeString2 = !rawTime || rawTime.includes('00:00:00') ? '' : rawTime;
  const val = searchParams.get('free') === 'true';
  const [borough, setBorough] = useState(boroughsArray);
  const [free, setFree] = useState(val);
  const [day, setDay] = useState(daysArray);
  const [startTime, setStartTime] = useState(startTimeString2);

  const handleSearch = () => {
    router.push(buildMicSearchUrl({ borough, day: day || '', startTime, free }));
  };

  return (
    <div className="hidden md:block border-t border-slate-100 bg-white">
      <div className="flex max-w-5xl mx-auto py-2 gap-4 items-center px-4">
        <BoroughSelect value={borough} setValue={setBorough} />
        <DaySelect value={day} setValue={setDay} />
        <TimeSelect value={startTime} setValue={setStartTime} timePeriod="Start After" />
        <FreeSwitch checked={free} setChecked={setFree} />
        <button
          type="button"
          onClick={handleSearch}
          aria-label="Search"
          className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shrink-0"
        >
          <IconSearch size={20} />
        </button>
      </div>
    </div>
  );
};

export default Filter;

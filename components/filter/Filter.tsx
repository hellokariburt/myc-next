'use client';

import { useContext, useState } from 'react';
import { IconSearch } from '@tabler/icons-react';
import BoroughSelect from '../select/BoroughSelect';
import DaySelect from '../select/DaySelect';
import FreeSwitch from '../select/FreeSwitch';
import { MicListingContext } from '@/lib/context/MicListingContext';
import TimeSelect from '../select/TimeSelect';

const Filter = () => {
  const { params, setQuery } = useContext(MicListingContext);

  const allBoroughsArray = params?.get('borough')?.split(',') || [];
  const boroughsArray = allBoroughsArray.includes('all') ? [] : allBoroughsArray;

  const daysArray = !params?.get('day') || params.get('day')?.includes('all') ? '' : params.get('day');

  const rawTime = params?.get('start-time');
  const startTimeString2 = !rawTime || rawTime.includes('00:00:00') ? '' : rawTime;
  const val = params?.get('free') === 'true';
  const [borough, setBorough] = useState(boroughsArray);
  const [free, setFree] = useState(val);
  const [day, setDay] = useState(daysArray);
  const [startTime, setStartTime] = useState(startTimeString2);

  const handleSearch = () => {
    const inputTerms = {
      boroughQuery: borough.length > 0 ? borough : 'all',
      dayQuery: day || 'all',
      timeQuery: startTime || '00:00:00',
      free,
    };
    setQuery!(inputTerms);
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

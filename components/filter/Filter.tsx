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

  const allBoroughsArray = params?.get('borough')?.split(',');
  const boroughsArray = allBoroughsArray?.includes('all') ? [] : allBoroughsArray;

  const daysArray = params?.get('day')?.includes('all') ? '' : params.get('day');

  const startTimeString2 = params.get('start-time')?.includes('00:00:00')
    ? ''
    : params.getAll('start-time')[0];
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
    <header className="hidden md:flex h-[50px] mb-[120px] fixed w-full z-10 border-b border-slate-200 -mt-0.5 bg-white">
      <div className="flex h-[56px] max-w-5xl mx-auto py-3 gap-6 items-center px-4">
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
    </header>
  );
};

export default Filter;

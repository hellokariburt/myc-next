import { useContext, useState } from 'react';
import BoroughSelect from '../select/BoroughSelect';
import DaySelect from '../select/DaySelect';
import FreeSwitch from '../select/FreeSwitch';
import SearchButton from '../select/SearchButton';
import TimeSelect from '../select/TimeSelect';
import { MicListingContext } from '@/lib/context/MicListingContext';

const MobileFilter = ({ onSubmit }: MobileFilterProps) => {
  const { params, setQuery } = useContext(MicListingContext);

  const allBoroughsArray = params?.get('borough')?.split(',') || [];
  const boroughsArray = allBoroughsArray.includes('all') ? [] : allBoroughsArray;

  const rawTime = params?.get('start-time');
  const startTimeString2 = !rawTime || rawTime.includes('00:00:00') ? '' : rawTime;

  const daysArray = !params?.get('day') || params.get('day')?.includes('all') ? '' : params.get('day');

  const [day, setDay] = useState(daysArray);
  const val = params?.get('free') === 'true';

  const [startTime, setStartTime] = useState(startTimeString2);
  const [borough, setBorough] = useState(boroughsArray);
  const [free, setFree] = useState(val);

  const inputTerms = {
    boroughQuery: borough.length > 0 ? borough : 'all',
    dayQuery: day || 'all',
    timeQuery: startTime || '00:00:00',
    free,
  };
  const handleSearch = () => {
    onSubmit();
    setQuery!(inputTerms);
  };

  return (
    <div className="w-full h-full">
      <div className="flex flex-col shadow-[0_8px_24px_rgba(0,0,0,0.16)] p-3 gap-4 bg-white">
        <div className="flex flex-col gap-4">
          <BoroughSelect value={borough} setValue={setBorough} />
          <DaySelect value={day} setValue={setDay} />
          <TimeSelect value={startTime} setValue={setStartTime} timePeriod="Start after" />
          <FreeSwitch checked={free} setChecked={() => setFree(!free)} />
        </div>
        <SearchButton onClick={handleSearch} />
      </div>
    </div>
  );
};

export default MobileFilter;

export type MobileFilterProps = {
  onSubmit: any;
};

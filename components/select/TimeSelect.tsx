'use client';

import { IconClock } from '@tabler/icons-react';

const generateTimeOptions = () => {
  const times = [];
  for (let i = 0; i < 24; i += 1) {
    const hour = i < 10 ? `0${i}` : `${i}`;
    const label =
      i === 0 ? '12:00 am' : i < 12 ? `${i}:00 am` : i === 12 ? '12:00 pm' : `${i - 12}:00 pm`;
    times.push({ value: `${hour}:00:00`, label });
  }
  return times;
};

const TimeSelect = ({ timePeriod, value, setValue }: TimeSelectProps) => {
  const times = generateTimeOptions();
  return (
    <div className="w-[150px]">
      <label className="block text-sm font-semibold text-slate-800 mb-1">{timePeriod}</label>
      <div className="relative">
        <IconClock size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <select
          value={value || ''}
          onChange={(e) => setValue(e.target.value || '')}
          className="w-full pl-8 pr-8 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
        >
          <option value="">Time</option>
          {times.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default TimeSelect;

export type TimeSelectProps = {
  timePeriod?: string;
  value: string;
  setValue: (val: string) => void;
};

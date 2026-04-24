'use client';

import { IconCalendar } from '@tabler/icons-react';

const days = [
  { value: 'sunday', label: 'Sunday' },
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
];

const DaySelect = ({ value, setValue }: DaySelectProps) => (
  <div className="w-auto md:w-[150px]">
    <label className="block text-sm font-semibold text-slate-800 mb-1">Day</label>
    <div className="relative">
      <IconCalendar size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      <select
        value={value || ''}
        onChange={(e) => setValue(e.target.value)}
        className="w-full pl-8 pr-8 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
      >
        <option value="">Pick day</option>
        {days.map((d) => (
          <option key={d.value} value={d.value}>{d.label}</option>
        ))}
      </select>
      <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
);

type DaySelectProps = {
  value: string | null;
  setValue: (val: string) => void;
};

export default DaySelect;

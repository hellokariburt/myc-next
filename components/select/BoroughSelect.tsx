'use client';

import { useState, useRef, useEffect } from 'react';
import { IconMapPin } from '@tabler/icons-react';

const boroughs = [
  { value: 'manhattan', label: 'Manhattan' },
  { value: 'brooklyn', label: 'Brooklyn' },
  { value: 'queens', label: 'Queens' },
  { value: 'bronx', label: 'Bronx' },
  { value: 'staten-island', label: 'Staten Island' },
];

const BoroughSelect = ({ value, setValue }: BoroughSelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (borough: string) => {
    if (value.includes(borough)) {
      setValue(value.filter((v) => v !== borough));
    } else {
      setValue([...value, borough]);
    }
  };

  const display = value.length > 0
    ? value.map((v) => boroughs.find((b) => b.value === v)?.label).join(', ')
    : 'Pick borough';

  return (
    <div className="w-auto md:w-[220px] relative" ref={ref}>
      <label className="block text-sm font-semibold text-slate-800 mb-1">Borough</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-2 w-full pl-3 pr-8 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-left"
      >
        <IconMapPin size={16} className="text-slate-400 shrink-0" />
        <span className={value.length > 0 ? 'text-slate-800 truncate' : 'text-slate-500 truncate'}>
          {display}
        </span>
      </button>
      <svg className="absolute right-2.5 top-[38px] w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
      {open && (
        <div className="absolute mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1" role="listbox">
          {boroughs.map((b) => (
            <label
              key={b.value}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 cursor-pointer text-sm"
            >
              <input
                type="checkbox"
                checked={value.includes(b.value)}
                onChange={() => toggle(b.value)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              {b.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

type BoroughSelectProps = {
  value: string[];
  setValue: (val: string[]) => void;
};

export default BoroughSelect;

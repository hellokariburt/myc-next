'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { t } from '@/lib/i18n';
import capitalizeDay from '@/lib/utils/capitalizeDay';
import { getBoroughSolid } from '@/lib/utils/boroughColor';

const BOROUGHS = [
  { value: 'manhattan', label: 'Manhattan' },
  { value: 'brooklyn', label: 'Brooklyn' },
  { value: 'queens', label: 'Queens' },
  { value: 'bronx', label: 'Bronx' },
];

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const pillBase =
  'rounded-full border px-4 py-2.5 sm:py-1.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500';
const pillOff = `${pillBase} bg-white border-slate-200 text-slate-700 hover:bg-slate-50`;
const pillOn = `${pillBase} bg-slate-900 border-slate-900 text-white`;

/**
 * Clubs-style chrome for the mics listing: search + one-tap pills that write
 * to the same URL params the API reads — pagination, ads, and shareable
 * links all keep working underneath.
 */
export default function MicsQuickChrome() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentBorough = params.get('borough') || '';
  const currentDay = params.get('day') || '';

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (v === null || v === '') next.delete(k);
      else next.set(k, v);
    });
    next.delete('pageNo'); // any filter change restarts at page 1
    router.replace(`/mics?${next.toString()}`, { scroll: false });
  };

  useEffect(() => {
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, []);

  const onSearch = (value: string) => {
    setQ(value);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => update({ q: value.trim() || null }), 350);
  };

  return (
    <div className="flex flex-col gap-3 pb-4">
      <label htmlFor="mic-search" className="sr-only">
        {t('mics.browser.searchAria')}
      </label>
      <input
        id="mic-search"
        type="search"
        value={q}
        onChange={(e) => onSearch(e.target.value)}
        placeholder={t('mics.browser.searchPlaceholder')}
        className="w-full max-w-md px-4 py-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-slate-400 transition-colors"
      />
      <div className="flex flex-wrap gap-2" role="group" aria-label={t('mics.browser.boroughGroupAria')}>
        {BOROUGHS.map((b) => (
          <button
            key={b.value}
            type="button"
            aria-pressed={currentBorough === b.value}
            onClick={() => update({ borough: currentBorough === b.value ? null : b.value })}
            className={currentBorough === b.value ? `${pillBase} ${getBoroughSolid(b.value)}` : pillOff}
          >
            {b.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label={t('mics.browser.dayGroupAria')}>
        {DAYS.map((d) => (
          <button
            key={d}
            type="button"
            aria-pressed={currentDay === d}
            onClick={() => update({ day: currentDay === d ? null : d })}
            className={currentDay === d ? pillOn : pillOff}
          >
            {capitalizeDay(d)}
          </button>
        ))}
      </div>
    </div>
  );
}

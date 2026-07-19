'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { t } from '@/lib/i18n';
import capitalizeDay from '@/lib/utils/capitalizeDay';
import { getBoroughSolid } from '@/lib/utils/boroughColor';
import ScrollRow from './ScrollRow';

const BOROUGHS = [
  { value: 'manhattan', label: 'Manhattan' },
  { value: 'brooklyn', label: 'Brooklyn' },
  { value: 'queens', label: 'Queens' },
  { value: 'bronx', label: 'Bronx' },
  { value: 'staten-island', label: 'Staten Island' },
];

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// min-h-[44px] below sm keeps these at the touch-target floor the rest of the
// site uses (see QuickFilters); text-sm + py-2.5 alone lands at 42px.
const pillBase =
  'shrink-0 inline-flex items-center justify-center rounded-full border px-4 py-2.5 sm:py-1.5 min-h-[44px] sm:min-h-0 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500';
const pillOff = `${pillBase} bg-white border-slate-200 text-slate-700 hover:bg-slate-50`;
const pillOn = `${pillBase} bg-slate-900 border-slate-900 text-white`;

/**
 * The single filter surface for the mics listing: search + one-tap pills that
 * write to the same URL params the API reads — pagination, ads, and shareable
 * links all keep working underneath.
 *
 * Every control commits through `update()`, which copies the existing params
 * and patches deltas. Never rebuild the query string from scratch here: that
 * is how the old header Filter silently dropped `q`.
 */
export default function MicsQuickChrome({
  boroughCounts = {},
  today,
  totalMics,
}: {
  boroughCounts?: Record<string, number>;
  /** Current weekday in NYC, from the server, so Tonight agrees with the sort. */
  today?: string;
  totalMics?: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentBorough = params.get('borough') || '';
  const currentDay = params.get('day') || '';
  const isFree = params.get('free') === 'true';
  const isTonight = Boolean(today) && currentDay === today;
  // start-time has no control on this page — only the homepage SearchCard can
  // set it — so it must still count as an active filter and still be cleared.
  // Otherwise a user arriving from that card sees a filtered list, taps Clear,
  // and the time filter survives while the Clear link itself disappears.
  const hasStartTime = Boolean(params.get('start-time')) && params.get('start-time') !== '00:00:00';
  const hasFilters = Boolean(q || currentBorough || currentDay || isFree || hasStartTime);

  // Hide boroughs with no mics at all rather than shipping a filter to an
  // empty room. Boroughs we have no count for stay visible — an absent count
  // means the lookup failed, not that the borough is empty.
  const boroughs = BOROUGHS.filter((b) => boroughCounts[b.value] !== 0);

  // The debounced search fires up to 350ms after the render that scheduled it.
  // Reading `params` through a ref means it commits against the URL as it is
  // when the timer fires, not as it was when the user typed — otherwise typing
  // then tapping a pill within the debounce window reverts the pill.
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(paramsRef.current.toString());
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

  const clearAll = () => {
    setQ('');
    if (debounce.current) clearTimeout(debounce.current);
    update({ q: null, borough: null, day: null, free: null, 'start-time': null });
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

      {/* Intent row: the two highest-frequency queries, one tap each. */}
      <div className="flex flex-wrap gap-2" role="group" aria-label={t('mics.browser.intentGroupAria')}>
        {today && (
          <button
            type="button"
            aria-pressed={isTonight}
            onClick={() => update({ day: isTonight ? null : today })}
            className={
              isTonight ? `${pillBase} bg-orange-500 border-orange-500 text-white` : pillOff
            }
          >
            {t('mics.browser.tonight')}
          </button>
        )}
        <button
          type="button"
          aria-pressed={isFree}
          onClick={() => update({ free: isFree ? null : 'true' })}
          className={isFree ? `${pillBase} bg-green-600 border-green-600 text-white` : pillOff}
        >
          {t('mics.browser.free')}
        </button>
      </div>

      <ScrollRow
        className="-mx-3 px-3 sm:mx-0 sm:px-0"
        role="group"
        aria-label={t('mics.browser.boroughGroupAria')}
      >
        {boroughs.map((b) => {
          const on = currentBorough === b.value;
          const count = boroughCounts[b.value];
          return (
            <button
              key={b.value}
              type="button"
              aria-pressed={on}
              onClick={() => update({ borough: on ? null : b.value })}
              className={on ? `${pillBase} ${getBoroughSolid(b.value)}` : pillOff}
            >
              {b.label}
              {/* slate-500 not slate-400: 400 on white is 2.56:1, under AA. */}
              {count !== undefined && (
                <span className={`ml-1.5 tabular-nums ${on ? 'opacity-75' : 'text-slate-500'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </ScrollRow>

      <ScrollRow
        className="-mx-3 px-3 sm:mx-0 sm:px-0"
        role="group"
        aria-label={t('mics.browser.dayGroupAria')}
      >
        {DAYS.map((d) => (
          <button
            key={d}
            type="button"
            aria-pressed={currentDay === d}
            onClick={() => update({ day: currentDay === d ? null : d })}
            className={currentDay === d ? pillOn : pillOff}
          >
            {capitalizeDay(d)}
            {d === today && (
              <span className="ml-1.5 text-xs font-medium opacity-60">
                {t('mics.browser.today')}
              </span>
            )}
          </button>
        ))}
      </ScrollRow>

      {/* slate-600 not slate-500: this sits on the #f6efe4 cream page background,
          where slate-500 is 4.17:1 — under AA for 14px text. */}
      <p className="text-sm text-slate-600" role="status" aria-live="polite">
        {totalMics !== undefined &&
          (totalMics === 1
            ? t('mics.browser.countOne', { count: totalMics })
            : t('mics.browser.countMany', { count: totalMics }))}
        {hasFilters && (
          <>
            {totalMics !== undefined && ' · '}
            <button
              type="button"
              onClick={clearAll}
              className="underline hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              {t('mics.browser.clearFilters')}
            </button>
          </>
        )}
      </p>
    </div>
  );
}

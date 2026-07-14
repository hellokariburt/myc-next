'use client';

import { useMemo, useRef, useState } from 'react';
import ShowCard from './ShowCard';
import ShowsMapSection from './ShowsMapSection';
import { ShowListItem } from '@/lib/services/shows.service';
import capitalizeDay from '@/lib/utils/capitalizeDay';
import { useInfiniteChunks } from '@/lib/hooks/useInfiniteChunks';
import { useInViewIds } from '@/lib/hooks/useInViewIds';
import { getBoroughSolid, getBoroughBorderColor } from '@/lib/utils/boroughColor';

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const BOROUGHS = [
  { value: 'manhattan', label: 'Manhattan' },
  { value: 'brooklyn', label: 'Brooklyn' },
  { value: 'queens', label: 'Queens' },
  { value: 'bronx', label: 'Bronx' },
];

const pillBase =
  'rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500';
const pillOff = `${pillBase} bg-white border-slate-200 text-slate-700 hover:bg-slate-50`;
const pillOn = `${pillBase} bg-slate-900 border-slate-900 text-white`;

function groupShows(shows: ShowListItem[]): [string, ShowListItem[]][] {
  const groups = new Map<string, ShowListItem[]>();
  DAY_ORDER.forEach((d) => groups.set(d, []));
  groups.set('pop-ups', []);
  shows.forEach((s) => {
    const key = s.day && groups.has(s.day) ? s.day : 'pop-ups';
    groups.get(key)!.push(s);
  });
  return [...groups.entries()].filter(([, list]) => list.length > 0);
}

export default function ShowsBrowser({ shows }: { shows: ShowListItem[] }) {
  const [query, setQuery] = useState('');
  const [day, setDay] = useState<string | null>(null);
  const [borough, setBorough] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return shows.filter((s) => {
      if (borough && s.borough !== borough) return false;
      if (day === 'pop-ups' && s.day) return false;
      if (day && day !== 'pop-ups' && s.day !== day) return false;
      if (q) {
        const hay = `${s.name} ${s.venue || ''} ${s.neighborhood || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [shows, query, day, borough]);

  // cards render progressively; the map mirrors the cards near the viewport
  const { visible, done, sentinelRef } = useInfiniteChunks(filtered, 24);
  const grouped = groupShows(visible);
  const fullCounts = new Map(groupShows(filtered).map(([d, list]) => [d, list.length]));

  const listRef = useRef<HTMLDivElement>(null);
  const inViewIds = useInViewIds(listRef, visible);
  const pinned = useMemo(
    () => visible.filter((s) => inViewIds.has(s.id)),
    [visible, inViewIds]
  );

  return (
    <>
      <div className="mt-8 flex flex-col gap-3">
        <label htmlFor="show-search" className="sr-only">
          Search shows by name, venue, or neighborhood
        </label>
        <input
          id="show-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search shows, venues, neighborhoods…"
          className="w-full max-w-md px-4 py-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-slate-400 transition-colors"
        />

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by borough">
          {BOROUGHS.map((b) => (
            <button
              key={b.value}
              type="button"
              aria-pressed={borough === b.value}
              onClick={() => setBorough(borough === b.value ? null : b.value)}
              className={borough === b.value ? `${pillBase} ${getBoroughSolid(b.value)}` : pillOff}
            >
              {b.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by night">
          {[...DAY_ORDER, 'pop-ups'].map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={day === d}
              onClick={() => setDay(day === d ? null : d)}
              className={day === d ? pillOn : pillOff}
            >
              {d === 'pop-ups' ? 'Pop-ups' : capitalizeDay(d)}
            </button>
          ))}
        </div>

        <p className="text-sm text-slate-500" role="status">
          {filtered.length} show{filtered.length === 1 ? '' : 's'}
          {(query || day || borough) && (
            <>
              {' · '}
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setDay(null);
                  setBorough(null);
                }}
                className="underline decoration-dashed hover:decoration-solid"
              >
                clear filters
              </button>
            </>
          )}
        </p>
      </div>

      <div className="mt-6 lg:grid lg:grid-cols-[1fr_minmax(380px,40vw)] lg:gap-4 lg:items-start">
        <div ref={listRef}>
          {grouped.length === 0 && (
            <div
              className={`bg-white rounded-xl border border-slate-200 border-l-[6px] ${getBoroughBorderColor(
                borough || ''
              )} p-8 text-center text-slate-600`}
            >
              No shows match — try clearing a filter.
            </div>
          )}
          {grouped.map(([groupDay, list]) => (
            <section key={groupDay} id={groupDay} className="mb-10 scroll-mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                {groupDay === 'pop-ups' ? 'Pop-up shows' : `${capitalizeDay(groupDay)} shows`}
                <span className="ml-2 text-base font-medium text-slate-500">
                  {fullCounts.get(groupDay) ?? list.length}
                </span>
              </h2>
              <div className="mt-4 grid gap-3 grid-cols-[minmax(0,1fr)]">
                {list.map((show) => (
                  <div key={show.id} data-pin={show.id} className="min-w-0">
                    <ShowCard show={show} />
                  </div>
                ))}
              </div>
            </section>
          ))}
          {!done && (
            <div ref={sentinelRef} className="flex justify-center py-6" aria-hidden="true">
              <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <ShowsMapSection shows={pinned} />
      </div>
    </>
  );
}

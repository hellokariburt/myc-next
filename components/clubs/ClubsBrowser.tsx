'use client';

import { useMemo, useRef, useState } from 'react';
import ClubCard from './ClubCard';
import ClubsMapSection from './ClubsMapSection';
import { ClubListItem } from '@/lib/services/clubs.service';
import { useInfiniteChunks } from '@/lib/hooks/useInfiniteChunks';
import { useInViewIds } from '@/lib/hooks/useInViewIds';
import {
  getBoroughAccentBar,
  getBoroughEyebrow,
  getBoroughSolid,
  getBoroughBorderColor,
} from '@/lib/utils/boroughColor';

const FILTER_BOROUGHS = [
  { value: 'manhattan', label: 'Manhattan' },
  { value: 'brooklyn', label: 'Brooklyn' },
  { value: 'queens', label: 'Queens' },
];

const pillBase =
  'rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500';
const pillOff = `${pillBase} bg-white border-slate-200 text-slate-700 hover:bg-slate-50`;

const BOROUGH_ORDER = ['manhattan', 'brooklyn', 'queens', 'bronx', 'staten-island'];
const BOROUGH_LABEL: Record<string, string> = {
  manhattan: 'Manhattan',
  brooklyn: 'Brooklyn',
  queens: 'Queens',
  bronx: 'Bronx',
  'staten-island': 'Staten Island',
};

function groupClubs(clubs: ClubListItem[]): [string, ClubListItem[]][] {
  const groups = new Map<string, ClubListItem[]>();
  BOROUGH_ORDER.forEach((b) => groups.set(b, []));
  clubs.forEach((c) => {
    const key = c.borough && groups.has(c.borough) ? c.borough : 'manhattan';
    groups.get(key)!.push(c);
  });
  return [...groups.entries()].filter(([, list]) => list.length > 0);
}

// order clubs by borough first so progressive chunks fill sections top-down
function boroughOrdered(clubs: ClubListItem[]): ClubListItem[] {
  return groupClubs(clubs).flatMap(([, list]) => list);
}

export default function ClubsBrowser({ clubs }: { clubs: ClubListItem[] }) {
  const [query, setQuery] = useState('');
  const [borough, setBorough] = useState<string | null>(null);

  // stable identity — the chunking hook resets whenever its input array changes
  const ordered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = clubs.filter((c) => {
      if (borough && c.borough !== borough) return false;
      if (q) {
        const hay = `${c.name} ${c.address || ''} ${c.neighborhood || ''} ${c.description || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    return boroughOrdered(filtered);
  }, [clubs, query, borough]);

  const { visible, done, sentinelRef } = useInfiniteChunks(ordered, 12);
  const grouped = groupClubs(visible);
  const fullCounts = new Map(groupClubs(ordered).map(([b, list]) => [b, list.length]));

  const listRef = useRef<HTMLDivElement>(null);
  const inViewIds = useInViewIds(listRef, visible);
  const pinned = useMemo(
    () => visible.filter((c) => inViewIds.has(c.id)),
    [visible, inViewIds]
  );

  return (
    <>
      <div className="mt-8 flex flex-col gap-3">
        <label htmlFor="club-search" className="sr-only">
          Search clubs by name, address, or neighborhood
        </label>
        <input
          id="club-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search clubs, neighborhoods…"
          className="w-full max-w-md px-4 py-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-slate-400 transition-colors"
        />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by borough">
          {FILTER_BOROUGHS.map((b) => (
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
        <p className="text-sm text-slate-500" role="status">
          {ordered.length} club{ordered.length === 1 ? '' : 's'}
          {(query || borough) && (
            <>
              {' · '}
              <button
                type="button"
                onClick={() => {
                  setQuery('');
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

      <div className="mt-2 lg:grid lg:grid-cols-[1fr_minmax(380px,40vw)] lg:gap-4 lg:items-start">
      <div ref={listRef}>
        {ordered.length === 0 && (
          <div
            className={`mt-10 bg-white rounded-xl border border-slate-200 border-l-[6px] ${getBoroughBorderColor(
              borough || ''
            )} p-8 text-center text-slate-600`}
          >
            No clubs match — try clearing a filter.
          </div>
        )}
        {grouped.map(([groupBorough, list]) => (
          <section key={groupBorough} className="mt-10">
            <h2 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-slate-900">
              <span
                className={`inline-block h-7 w-1.5 rounded-full ${getBoroughAccentBar(groupBorough)}`}
                aria-hidden="true"
              />
              {BOROUGH_LABEL[groupBorough]}
              <span className={`text-base font-semibold ${getBoroughEyebrow(groupBorough)}`}>
                {fullCounts.get(groupBorough) ?? list.length}
              </span>
            </h2>
            <div className="mt-4 grid gap-4 xl:grid-cols-2">
              {list.map((club) => (
                <div key={club.id} data-pin={club.id} className="min-w-0">
                  <ClubCard club={club} />
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
      <div className="mt-10 lg:mt-0 lg:self-stretch">
        <ClubsMapSection clubs={pinned} />
      </div>
      </div>
    </>
  );
}

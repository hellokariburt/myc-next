'use client';

import { useMemo } from 'react';
import ClubCard from './ClubCard';
import ClubsMapSection from './ClubsMapSection';
import { ClubListItem } from '@/lib/services/clubs.service';
import { useInfiniteChunks } from '@/lib/hooks/useInfiniteChunks';

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
  // stable identity — the chunking hook resets whenever its input array changes
  const ordered = useMemo(() => boroughOrdered(clubs), [clubs]);
  const { visible, done, sentinelRef } = useInfiniteChunks(ordered, 12);
  const grouped = groupClubs(visible);
  const fullCounts = new Map(groupClubs(clubs).map(([b, list]) => [b, list.length]));

  return (
    <div className="mt-2 lg:grid lg:grid-cols-[1fr_minmax(380px,40vw)] lg:gap-4 lg:items-start">
      <div>
        {grouped.map(([borough, list]) => (
          <section key={borough} className="mt-10">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {BOROUGH_LABEL[borough]}
              <span className="ml-2 text-base font-medium text-slate-500">
                {fullCounts.get(borough) ?? list.length}
              </span>
            </h2>
            <div className="mt-4 grid gap-4 xl:grid-cols-2">
              {list.map((club) => (
                <ClubCard key={club.id} club={club} />
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
      <div className="mt-10">
        <ClubsMapSection clubs={clubs} />
      </div>
    </div>
  );
}

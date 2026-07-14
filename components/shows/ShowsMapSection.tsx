'use client';

import dynamic from 'next/dynamic';
import { ShowListItem } from '@/lib/services/shows.service';

const ShowsMapLoad = dynamic(() => import('../map/ShowsMapLoad'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[65vh] lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:self-start bg-slate-100 animate-pulse" />
  ),
});

export default function ShowsMapSection({ shows }: { shows: ShowListItem[] }) {
  return <ShowsMapLoad shows={shows} />;
}

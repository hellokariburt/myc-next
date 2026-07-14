'use client';

import dynamic from 'next/dynamic';
import { ClubListItem } from '@/lib/services/clubs.service';

const ClubsMapLoad = dynamic(() => import('../map/ClubsMapLoad'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[65vh] lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:self-start bg-slate-100 animate-pulse" />
  ),
});

export default function ClubsMapSection({ clubs }: { clubs: ClubListItem[] }) {
  return <ClubsMapLoad clubs={clubs} />;
}

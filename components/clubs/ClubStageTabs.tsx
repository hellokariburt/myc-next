'use client';

import { useState } from 'react';
import MicListCard from '../mic/MicListCard';
import ShowCard from '../shows/ShowCard';
import { ShowListItem } from '@/lib/services/shows.service';
import { MicListItem } from '@/lib/types/mic';
import { t } from '@/lib/i18n';

export default function ClubStageTabs({
  mics,
  shows,
}: {
  mics: MicListItem[];
  shows: ShowListItem[];
}) {
  const defaultTab = mics.length > 0 ? 'mics' : 'shows';
  const [tab, setTab] = useState<'mics' | 'shows'>(defaultTab);

  if (mics.length === 0 && shows.length === 0) {
    return (
      <p className="mt-10 text-slate-600">
        {t('clubs.detail.emptyStage')}
      </p>
    );
  }

  const tabClass = (active: boolean) =>
    `px-4 py-2 rounded-full text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      active
        ? 'bg-slate-900 text-white'
        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
    }`;

  return (
    <section className="mt-10">
      <div role="tablist" aria-label={t('clubs.detail.tabsAria')} className="flex flex-wrap gap-2">
        {mics.length > 0 && (
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'mics'}
            onClick={() => setTab('mics')}
            className={tabClass(tab === 'mics')}
          >
            {t('clubs.detail.tabMics', { count: mics.length })}
          </button>
        )}
        {shows.length > 0 && (
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'shows'}
            onClick={() => setTab('shows')}
            className={tabClass(tab === 'shows')}
          >
            {t('clubs.detail.tabShows', { count: shows.length })}
          </button>
        )}
      </div>

      <div className="mt-4 grid gap-3 grid-cols-[minmax(0,1fr)]" role="tabpanel">
        {tab === 'mics' &&
          mics.map((mic) => <MicListCard key={String(mic.id)} mic={mic} hideBoroughBadge />)}
        {tab === 'shows' && shows.map((show) => <ShowCard key={show.id} show={show} />)}
      </div>
    </section>
  );
}

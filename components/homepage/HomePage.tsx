import Link from 'next/link';
import { MicListItem } from '@/lib/types/mic';
import SearchCard from '../searchcard/SearchCard';
import { Title } from '../title/Title';
import PageLayout from '../pagelayout/PageLayout';
import { QuickFilters } from '../seo/QuickFilters';
import UpcomingMics from './UpcomingMics';
import { t } from '@/lib/i18n';

interface Props {
  micCount: number;
  upcoming?: MicListItem[];
}

export function HomePage({ micCount, upcoming = [] }: Props) {
  return (
    <PageLayout className="bg-[#f6efe4]">
      <div className="flex flex-col items-center justify-start pt-16 md:pt-24 pb-20 px-4">
        <Title />

        <p className="text-slate-500 text-sm md:text-base mt-6">
          <span className="font-semibold text-slate-800 tabular-nums">{micCount}</span>{' '}
          {t('home.countLineAfterCount')}
        </p>

        <div className="w-full mt-8 relative">
          <div className="md:max-w-4xl mx-auto relative">
            <span className="absolute -top-3 left-8 z-10 rounded-full bg-slate-900 px-3 py-1 font-display uppercase tracking-wide text-xs text-white">
              {t('home.searchTab')}
            </span>
            <SearchCard />
          </div>
        </div>

        <div className="w-full max-w-2xl mt-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 text-center mb-3">
            {t('home.jumpTo')}
          </p>
          <QuickFilters variant="subtle" className="justify-center" />
        </div>

        <UpcomingMics mics={upcoming} />
      </div>
    </PageLayout>
  );
}

import { MicListItem } from '@/lib/types/mic';
import SearchCard from '../searchcard/SearchCard';
import { Title } from '../title/Title';
import PageLayout from '../pagelayout/PageLayout';
import { QuickFilters } from '../seo/QuickFilters';
import UpcomingMics from './UpcomingMics';

interface Props {
  micCount: number;
  upcoming?: MicListItem[];
}

export function HomePage({ micCount, upcoming = [] }: Props) {
  return (
    <PageLayout className="bg-slate-50">
      <div className="flex flex-col items-center justify-start pt-16 md:pt-24 pb-20 px-4">
        <Title />

        <p className="text-slate-500 text-sm md:text-base mt-6">
          Currently tracking{' '}
          <span className="font-semibold text-slate-800 tabular-nums">{micCount}</span>{' '}
          open mics across NYC
        </p>

        <div className="w-full mt-8">
          <SearchCard />
        </div>

        <div className="w-full max-w-2xl mt-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 text-center mb-3">
            Or jump straight to
          </p>
          <QuickFilters variant="subtle" className="justify-center" />
        </div>

        <UpcomingMics mics={upcoming} />
      </div>
    </PageLayout>
  );
}

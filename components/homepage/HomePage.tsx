import Link from 'next/link';
import SearchCard from '../searchcard/SearchCard';
import { Title } from '../title/Title';
import PageLayout from '../pagelayout/PageLayout';
import { QuickFilters } from '../seo/QuickFilters';

export function HomePage({ micCount }: { micCount: number }) {
  return (
    <PageLayout className="bg-[#F5F5F5] bg-cover">
      <div className="flex flex-col items-center justify-center min-h-[80vh] md:gap-6 gap-2 pb-12">
        <Title />
        <p className="text-slate-500 text-lg">
          Currently tracking <span className="font-bold text-slate-700">{micCount}</span> open mics across NYC
        </p>
        <SearchCard />
        <Link
          href="/mics/tonight"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full text-base transition-colors shadow-md"
        >
          What&apos;s happening tonight?
        </Link>
        <QuickFilters className="justify-center max-w-xl px-4" />
      </div>
    </PageLayout>
  );
}

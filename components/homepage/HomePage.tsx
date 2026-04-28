import Link from 'next/link';
import SearchCard from '../searchcard/SearchCard';
import { Title } from '../title/Title';
import PageLayout from '../pagelayout/PageLayout';

export function HomePage({ micCount, today }: { micCount: number; today: string }) {
  return (
    <PageLayout className="bg-[#F5F5F5] bg-cover">
      <div className="flex flex-col items-center justify-center min-h-[80vh] md:gap-6 gap-2 pb-12">
        <Title />
        <p className="text-slate-500 text-lg">
          Currently tracking <span className="font-bold text-slate-700">{micCount}</span> open mics across NYC
        </p>
        <SearchCard />
        <Link
          href={`/mics?day=${today}`}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full text-base transition-colors shadow-md"
        >
          What&apos;s happening tonight?
        </Link>
      </div>
    </PageLayout>
  );
}

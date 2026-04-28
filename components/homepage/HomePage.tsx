import Link from 'next/link';
import SearchCard from '../searchcard/SearchCard';
import { Title } from '../title/Title';
import PageLayout from '../pagelayout/PageLayout';

const boroughs = [
  { name: 'Manhattan', slug: 'manhattan', color: 'text-blue-600 hover:bg-blue-50' },
  { name: 'Brooklyn', slug: 'brooklyn', color: 'text-purple-600 hover:bg-purple-50' },
  { name: 'Queens', slug: 'queens', color: 'text-orange-600 hover:bg-orange-50' },
  { name: 'Bronx', slug: 'bronx', color: 'text-rose-600 hover:bg-rose-50' },
  { name: 'Staten Island', slug: 'staten-island', color: 'text-teal-600 hover:bg-teal-50' },
];

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

      {/* Below-fold SEO content */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">
          Browse open mics by borough
        </h2>
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {boroughs.map((b) => (
            <Link
              key={b.slug}
              href={`/mics?borough=${b.slug}`}
              className={`font-semibold px-5 py-2.5 rounded-full border border-slate-200 bg-white transition-colors ${b.color}`}
            >
              {b.name}
            </Link>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

import Link from 'next/link';

const boroughs = [
  { slug: 'manhattan', label: 'Manhattan' },
  { slug: 'brooklyn', label: 'Brooklyn' },
  { slug: 'queens', label: 'Queens' },
  { slug: 'bronx', label: 'Bronx' },
  { slug: 'staten-island', label: 'Staten Island' },
];

export function QuickFilters({ className = '' }: { className?: string }) {
  return (
    <nav aria-label="Quick filters" className={`flex flex-wrap gap-2 ${className}`}>
      <Link
        href="/mics/tonight"
        className="inline-flex items-center px-3 py-1.5 rounded-full bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors"
      >
        Tonight
      </Link>
      <Link
        href="/mics/free"
        className="inline-flex items-center px-3 py-1.5 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors"
      >
        Free
      </Link>
      {boroughs.map((b) => (
        <Link
          key={b.slug}
          href={`/mics/${b.slug}`}
          className="inline-flex items-center px-3 py-1.5 rounded-full bg-white border border-slate-300 text-slate-700 text-sm font-medium hover:border-blue-500 hover:text-blue-600 transition-colors"
        >
          {b.label}
        </Link>
      ))}
    </nav>
  );
}

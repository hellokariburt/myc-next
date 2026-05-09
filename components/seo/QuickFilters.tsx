import Link from 'next/link';

const boroughs = [
  { slug: 'manhattan', label: 'Manhattan' },
  { slug: 'brooklyn', label: 'Brooklyn' },
  { slug: 'queens', label: 'Queens' },
  { slug: 'bronx', label: 'Bronx' },
  { slug: 'staten-island', label: 'Staten Island' },
];

export function QuickFilters({
  className = '',
  hideBorough,
  variant = 'default',
}: {
  className?: string;
  hideBorough?: string;
  variant?: 'default' | 'subtle';
}) {
  const subtle = variant === 'subtle';

  const tonightCls = subtle
    ? 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:border-orange-500 hover:text-orange-600 transition-colors'
    : 'inline-flex items-center px-3 py-1.5 rounded-full bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors';

  const freeCls = subtle
    ? 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:border-green-600 hover:text-green-700 transition-colors'
    : 'inline-flex items-center px-3 py-1.5 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors';

  const boroughCls =
    'inline-flex items-center px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:border-blue-500 hover:text-blue-600 transition-colors';

  return (
    <nav aria-label="Quick filters" className={`flex flex-wrap gap-2 ${className}`}>
      <Link href="/mics/tonight" className={tonightCls}>
        {subtle && <span className="h-1.5 w-1.5 rounded-full bg-orange-500" aria-hidden />}
        Tonight
      </Link>
      <Link href="/mics/free" className={freeCls}>
        {subtle && <span className="h-1.5 w-1.5 rounded-full bg-green-600" aria-hidden />}
        Free
      </Link>
      {boroughs
        .filter((b) => b.slug !== hideBorough)
        .map((b) => (
          <Link key={b.slug} href={`/mics/${b.slug}`} className={boroughCls}>
            {b.label}
          </Link>
        ))}
    </nav>
  );
}

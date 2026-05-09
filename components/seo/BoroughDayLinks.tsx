import Link from 'next/link';
import { ALL_DAYS } from '@/lib/types/api';
import { getBoroughDisplayName, capitalize } from '@/lib/seo/boroughDayPage';

export function BoroughDayLinks({ borough, className = '' }: { borough: string; className?: string }) {
  const display = getBoroughDisplayName(borough);
  return (
    <div className={className}>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Filter by day</p>
      <nav aria-label={`${display} mics by day`} className="flex flex-wrap gap-2">
        {ALL_DAYS.map((day) => (
          <Link
            key={day}
            href={`/mics/${borough}/${day}`}
            className="inline-flex items-center px-3 py-1.5 rounded-full bg-white border border-slate-300 text-slate-700 text-sm font-medium hover:border-blue-500 hover:text-blue-600 transition-colors"
          >
            {capitalize(day)}
          </Link>
        ))}
      </nav>
    </div>
  );
}

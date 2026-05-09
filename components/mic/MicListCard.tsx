import Link from 'next/link';
import { MicListItem } from '@/lib/types/mic';
import changeTime from '@/lib/utils/changeTime';
import capitalizeDay from '@/lib/utils/capitalizeDay';
import {
  getBoroughBorderColor,
  getBoroughBadgeClasses,
  getBoroughDisplayShort,
} from '@/lib/utils/boroughColor';
import { isFreeCost } from '@/lib/utils/isFree';

interface Props {
  mic: MicListItem;
  className?: string;
  hideBoroughBadge?: boolean;
}

export default function MicListCard({ mic, className = '', hideBoroughBadge }: Props) {
  const isFree = isFreeCost(mic.mic_cost?.cost_amount);

  return (
    <Link
      href={`/mics/${mic.id}`}
      aria-label={`${mic.name || 'Mic'} — ${capitalizeDay(mic.day || '')} at ${changeTime(
        mic.start_time || ''
      )}, ${mic.mic_cost?.cost_amount || 'Free'}`}
      className={`flex group bg-white border border-slate-200 border-l-[6px] ${getBoroughBorderColor(
        mic.borough || ''
      )} rounded-xl px-5 py-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
    >
      <div className="flex flex-row gap-4 lg:gap-6 min-w-0 w-full">
        <div className="pr-3 lg:pr-4 pt-0.5 border-r border-slate-200 shrink-0 w-[88px] lg:w-[110px]">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {capitalizeDay(mic.day || '')}
          </p>
          <p className="text-xl lg:text-2xl font-bold text-slate-900 tabular-nums leading-tight">
            {changeTime(mic.start_time || '')}
          </p>
          {mic.mic_occurrence?.schedule && (
            <p className="text-xs text-slate-500 pt-2">{mic.mic_occurrence.schedule}</p>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base lg:text-lg font-semibold text-slate-900 group-hover:underline decoration-slate-400 underline-offset-2 truncate">
            {mic.name}
          </p>
          <p className="text-slate-600 text-sm lg:text-base truncate">
            {mic.mic_address?.venue}
            {mic.mic_address?.neighborhood && (
              <span className="text-slate-500"> · {mic.mic_address.neighborhood}</span>
            )}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {!hideBoroughBadge && mic.borough && (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getBoroughBadgeClasses(
                  mic.borough
                )}`}
              >
                {getBoroughDisplayShort(mic.borough)}
              </span>
            )}
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ${
                isFree
                  ? 'bg-green-50 text-green-700 ring-green-200'
                  : 'bg-amber-50 text-amber-700 ring-amber-200'
              }`}
            >
              {mic.mic_cost?.cost_amount || 'Free'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

import Link from 'next/link';
import { MicListItem } from '@/lib/types/mic';
import changeTime from '@/lib/utils/changeTime';
import capitalizeDay from '@/lib/utils/capitalizeDay';
import {
  getBoroughBorderColor,
  getBoroughBadgeClasses,
  getBoroughDisplayShort,
} from '@/lib/utils/boroughColor';

interface Props {
  mic: MicListItem;
  className?: string;
  hideBoroughBadge?: boolean;
}

export default function MicListCard({ mic, className = '', hideBoroughBadge }: Props) {
  const isFree =
    !mic.mic_cost?.cost_amount || mic.mic_cost.cost_amount.toLowerCase().includes('free');

  return (
    <Link
      href={`/mics/${mic.id}`}
      aria-label={`${mic.name || 'Mic'} — ${capitalizeDay(mic.day || '')} at ${changeTime(
        mic.start_time || ''
      )}, ${mic.mic_cost?.cost_amount || 'Free'}`}
      className={`flex group bg-white border border-slate-200 border-l-4 ${getBoroughBorderColor(
        mic.borough || ''
      )} rounded-xl p-4 shadow-sm hover:shadow-lg hover:ring-2 hover:ring-blue-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
    >
      <div className="flex flex-row gap-3 lg:gap-6 min-w-0 w-full">
        <div className="pr-3 lg:pr-4 pt-1 border-r border-slate-200 text-sm lg:text-base shrink-0 w-[80px] lg:w-auto">
          <p className="font-bold">{capitalizeDay(mic.day || '')}</p>
          <p>{changeTime(mic.start_time || '')}</p>
          {mic.mic_occurrence?.schedule && (
            <p className="text-slate-500 text-xs lg:text-sm pt-4">
              {mic.mic_occurrence.schedule}
            </p>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="lg:text-2xl text-lg font-bold text-blue-700 group-hover:underline group-hover:decoration-dashed truncate">
            {mic.name}
          </p>
          <p className="text-slate-700 font-bold text-sm lg:text-base truncate">
            {mic.mic_address?.venue}
          </p>
          <div className="flex flex-row flex-wrap text-slate-600 text-sm lg:text-base">
            {mic.mic_address && mic.mic_address.unit_number > 0 && (
              <span className="pr-1">{mic.mic_address.unit_number}</span>
            )}
            <span>{mic.mic_address?.street_name}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {!hideBoroughBadge && mic.borough && (
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs lg:text-sm font-semibold ${getBoroughBadgeClasses(
                  mic.borough
                )}`}
              >
                {getBoroughDisplayShort(mic.borough)}
              </span>
            )}
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs lg:text-sm font-medium ring-1 ${
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

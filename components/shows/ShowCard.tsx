import { ShowListItem } from '@/lib/services/shows.service';
import capitalizeDay from '@/lib/utils/capitalizeDay';
import {
  getBoroughBorderColor,
  getBoroughBadgeClasses,
  getBoroughDisplayShort,
} from '@/lib/utils/boroughColor';
import ShowThumbnail from './ShowThumbnail';

export default function ShowCard({ show }: { show: ShowListItem }) {
  return (
    <div
      className={`flex bg-white border border-slate-200 border-l-[6px] ${getBoroughBorderColor(
        show.borough || ''
      )} rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex flex-row gap-4 lg:gap-5 min-w-0 w-full items-start">
        <ShowThumbnail name={show.name} image={show.image} />
        <div className="min-w-0 flex-1">
          <p className="text-base lg:text-lg font-semibold text-slate-900 truncate">{show.name}</p>
          <p className="text-slate-600 text-sm lg:text-base truncate">
            {show.location_note || show.venue}
            {show.neighborhood && <span className="text-slate-500"> · {show.neighborhood}</span>}
          </p>
          <p className="text-sm text-slate-500 pt-0.5">
            {show.day && (
              <span className="font-semibold text-slate-700">{capitalizeDay(show.day)}</span>
            )}
            {show.day && show.time_text && ' · '}
            {show.time_text}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {show.borough && (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getBoroughBadgeClasses(
                  show.borough
                )}`}
              >
                {getBoroughDisplayShort(show.borough)}
              </span>
            )}
            {show.schedule && show.schedule !== 'weekly' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200">
                {show.schedule}
              </span>
            )}
            {show.instagram && (
              <a
                href={`https://instagram.com/${show.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-200 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`${show.name} on Instagram`}
              >
                @{show.instagram}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

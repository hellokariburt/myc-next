import { ShowListItem } from '@/lib/services/shows.service';
import capitalizeDay from '@/lib/utils/capitalizeDay';
import { formatTimeText } from '@/lib/utils/formatTimeText';
import {
  getBoroughBorderColor,
  getBoroughBadgeClasses,
  getBoroughDisplayShort,
} from '@/lib/utils/boroughColor';
import ShowThumbnail from './ShowThumbnail';

const DAY_INDEX: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

// Every card gets a date. Weekly shows compute their next occurrence from
// their weekday (self-maintaining); monthlies/pop-ups use next_date, and a
// passed next_date silently disappears instead of going stale on the page.
function nextDateLabel(show: ShowListItem): string | null {
  const now = new Date();
  const todayIso = now.toISOString().slice(0, 10);

  let iso: string | null = null;
  if (show.next_date && show.next_date >= todayIso) {
    iso = show.next_date;
  } else if (show.schedule === 'weekly' && show.day && show.day in DAY_INDEX) {
    const d = new Date(now);
    const delta = (DAY_INDEX[show.day] - d.getDay() + 7) % 7;
    d.setDate(d.getDate() + delta);
    iso = d.toISOString().slice(0, 10);
  }
  if (!iso) return null;
  if (iso === todayIso) return 'Tonight';
  const [y, m, day] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, day)).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export default function ShowCard({ show }: { show: ShowListItem }) {
  const nextDate = nextDateLabel(show);
  return (
    <div
      className={`flex bg-white border border-slate-200 border-l-[6px] ${getBoroughBorderColor(
        show.borough || ''
      )} rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex flex-row gap-4 lg:gap-5 min-w-0 w-full items-start">
        <ShowThumbnail name={show.name} image={show.image} />
        <div className="min-w-0 flex-1">
          <p className="text-base lg:text-lg font-semibold text-slate-900 line-clamp-2 break-words">
            {show.name}
          </p>
          <p className="text-slate-600 text-sm lg:text-base line-clamp-2 break-words">
            {show.location_note || show.venue}
            {show.neighborhood && <span className="text-slate-500"> · {show.neighborhood}</span>}
          </p>
          <p className="text-sm text-slate-500 pt-0.5">
            {show.day && (
              <span className="font-semibold text-slate-700">{capitalizeDay(show.day)}</span>
            )}
            {show.day && show.time_text && ' · '}
            {formatTimeText(show.time_text)}
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
            {nextDate && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 ring-1 ring-green-200">
                Next: {nextDate}
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

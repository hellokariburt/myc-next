import { useMicSearch } from '@/lib/hooks/useMicSearch';
import capitalizeDay from '@/lib/utils/capitalizeDay';

function convertTo12HourFormat(x: any) {
  const [hours, minutes] = x.split(':').map(Number);

  let period = 'am';
  let hours12 = hours;

  if (hours >= 12) {
    period = 'pm';
    hours12 = hours === 12 ? 12 : hours - 12;
  }

  if (hours === 0) {
    hours12 = 12; // Midnight (00:00) should be 12:00 AM
  }

  return `${hours12}:${minutes.toString().padStart(2, '0')}${period}`;
}

export const SearchResults = () => {
  const { mics, params } = useMicSearch();

  const getAllBoroughs = params.get('borough');
  const boroughsArray = getAllBoroughs?.includes('all') ? 'NYC' : getAllBoroughs || 'NYC';

  const getAllDays = params.get('day');
  const daysArray = getAllDays?.includes('all')
    ? ''
    : getAllDays
      ? ` on ${capitalizeDay(getAllDays.toString())}`
      : '';

  const getStartTime = params.get('start-time');
  const timeArray = getStartTime?.includes('00:00:00')
    ? ''
    : getStartTime
      ? ` after ${convertTo12HourFormat(getStartTime.toString())}`
      : '';

  const paramsFree = params.get('free') === 'true' ? 'Free' : '';

  const paramsPage = parseInt(params.get('pageNo') || '1', 10);
  const startPage = 1 + (paramsPage - 1) * 10;
  const endPage = Math.min(paramsPage * 10, mics?.totalMics || 0);

  const pagingString = `${startPage}-${endPage} of `;

  const totalPages = Math.ceil((mics?.totalMics || 0) / 10);

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 pb-3">
      <p className="text-sm text-slate-600">
        {pagingString}
        {mics?.totalMics} {paramsFree} mics in {boroughsArray}
        {daysArray}
        {timeArray}
      </p>
      {totalPages > 1 && (
        <p className="text-sm text-slate-400">
          Page {paramsPage} of {totalPages}
        </p>
      )}
    </div>
  );
};

import { MicQueryParams, ALL_BOROUGHS, ALL_DAYS, TIME_FORMAT } from '../types/api';

export function parseParams(searchParams: URLSearchParams): MicQueryParams | string {
  const borough = searchParams.get('borough') ?? undefined;
  let boroughArray = borough ? borough.split(',') : [];
  if (borough === 'all') {
    boroughArray = [...ALL_BOROUGHS];
  }

  const day = searchParams.get('day') ?? undefined;
  let dayArray = day ? day.split(',') : [];
  if (day === 'all') {
    dayArray = [...ALL_DAYS];
  }

  const rawLimit = searchParams.get('limit');
  const limit = rawLimit !== null ? Number(rawLimit) : 10;
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    return 'limit must be an integer between 1 and 100';
  }

  const rawOffset = searchParams.get('offset');
  const offset = rawOffset !== null ? Number(rawOffset) : 0;
  if (!Number.isInteger(offset) || offset < 0) {
    return 'offset must be a non-negative integer';
  }

  const startTime = searchParams.get('start-time') ?? '00:00:00';
  if (!TIME_FORMAT.test(startTime)) {
    return 'start-time must be in HH:MM:SS format (e.g. 19:00:00)';
  }

  return {
    day: dayArray,
    borough: boroughArray,
    limit,
    offset,
    start_time: startTime,
    cost: searchParams.get('free') ?? 'false',
  };
}

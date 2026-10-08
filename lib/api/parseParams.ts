import { MicQueryParams, ALL_BOROUGHS, ALL_DAYS, TIME_FORMAT } from '../types/api';

export function parseParams(searchParams: URLSearchParams): MicQueryParams | string {
  // Empty (param absent) means "no filter" — getMics treats [] as all boroughs.
  // An explicit value must be "all" or a comma-list of known slugs; anything
  // else is a 400 rather than a silent empty result.
  const borough = searchParams.get('borough') ?? undefined;
  let boroughArray: string[] = [];
  if (borough === 'all') {
    boroughArray = [...ALL_BOROUGHS];
  } else if (borough) {
    boroughArray = borough.split(',');
    const unknown = boroughArray.filter(
      (b) => !ALL_BOROUGHS.includes(b as (typeof ALL_BOROUGHS)[number])
    );
    if (unknown.length) return `Unrecognized borough: ${unknown.join(', ')}`;
  }

  const day = searchParams.get('day') ?? undefined;
  let dayArray: string[] = [];
  if (day === 'all') {
    dayArray = [...ALL_DAYS];
  } else if (day) {
    dayArray = day.split(',');
    const unknown = dayArray.filter((d) => !ALL_DAYS.includes(d as (typeof ALL_DAYS)[number]));
    if (unknown.length) return `Unrecognized day: ${unknown.join(', ')}`;
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

  const q = (searchParams.get('q') ?? '').trim().slice(0, 80);

  return {
    q,
    day: dayArray,
    borough: boroughArray,
    limit,
    offset,
    start_time: startTime,
    cost: searchParams.get('free') ?? 'false',
  };
}

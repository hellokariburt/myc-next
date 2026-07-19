const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

/** How long a mic is assumed to run. Matches the endDate the detail page emits. */
export const ASSUMED_DURATION_MS = 2 * 60 * 60 * 1000;

const DEFAULT_HOUR = 19;

export type TimeOfDay = { hours: number; minutes: number };

/** Pulls hours/minutes out of either an ISO timestamp or a bare "HH:MM" string. */
export function parseTimeOfDay(value: string): TimeOfDay | null {
  const iso = value.match(/T(\d{2}):(\d{2})/);
  if (iso) return { hours: parseInt(iso[1], 10), minutes: parseInt(iso[2], 10) };
  const plain = value.match(/^(\d{1,2}):(\d{2})/);
  if (plain) return { hours: parseInt(plain[1], 10), minutes: parseInt(plain[2], 10) };
  return null;
}

/**
 * Builds an ISO instant for a given wall-clock time in New York, accounting for
 * whichever UTC offset is in effect on that date (EST vs EDT).
 */
export function isoAtEtWallTime(
  year: number,
  monthIndex: number,
  day: number,
  hours: number,
  minutes: number
): string {
  const utcMs = Date.UTC(year, monthIndex, day, hours, minutes, 0);
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(new Date(utcMs));
  const get = (t: string) => parseInt(parts.find((p) => p.type === t)?.value || '0', 10);
  const etMs = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), 0);
  return new Date(utcMs - (etMs - utcMs)).toISOString();
}

/**
 * The next time a weekly mic runs, as an ISO instant, for schema.org startDate.
 *
 * Today counts. The previous implementation did `(target - etDow + 7) % 7 || 7`,
 * where a same-day match produced 0 — falsy — and got rewritten to a full week.
 * A mic happening tonight advertised a startDate seven days out, on the one day
 * that being wrong matters most.
 *
 * A mic that already finished rolls to next week; one still in progress keeps
 * pointing at today's session, so a rich result seen mid-mic isn't stale.
 *
 * `now` is injectable so this is testable without freezing the clock.
 */
export function getNextOccurrence(
  day: string,
  time: TimeOfDay | null,
  now: Date = new Date()
): string {
  const target = DAYS.indexOf(day.toLowerCase());
  if (target === -1) return now.toISOString();

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'long',
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value || '';

  const etYear = parseInt(get('year'), 10);
  const etMonth = parseInt(get('month'), 10) - 1;
  const etDay = parseInt(get('day'), 10);
  const etDow = DAYS.indexOf(get('weekday').toLowerCase());

  const startHour = time?.hours ?? DEFAULT_HOUR;
  const startMinute = time?.minutes ?? 0;

  let diff = (target - etDow + 7) % 7;
  if (diff === 0) {
    const nowMinutes = parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10);
    const endMinutes = startHour * 60 + startMinute + ASSUMED_DURATION_MS / 60000;
    if (nowMinutes >= endMinutes) diff = 7;
  }

  return isoAtEtWallTime(etYear, etMonth, etDay + diff, startHour, startMinute);
}

import { getNextOccurrence, parseTimeOfDay, isoAtEtWallTime } from '../nextOccurrence';

/** The ET wall-clock date/time an ISO instant lands on, for readable assertions. */
function etParts(iso: string) {
  const p = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'long',
  }).formatToParts(new Date(iso));
  const g = (t: string) => p.find((x) => x.type === t)?.value ?? '';
  return { date: `${g('year')}-${g('month')}-${g('day')}`, time: `${g('hour')}:${g('minute')}`, weekday: g('weekday') };
}

// 2026-07-21 is a Tuesday. 18:00Z = 14:00 ET (EDT, UTC-4).
const TUE_2PM_ET = new Date('2026-07-21T18:00:00Z');

describe('getNextOccurrence', () => {
  it('returns TODAY for a mic later today — the bug that shipped', () => {
    // Pre-fix, `(0) % 7 || 7` made this next Tuesday, so a mic happening in
    // five hours advertised a startDate a week out.
    const iso = getNextOccurrence('tuesday', { hours: 19, minutes: 0 }, TUE_2PM_ET);
    expect(etParts(iso)).toMatchObject({ date: '2026-07-21', time: '19:00', weekday: 'Tuesday' });
  });

  it('still returns today while the mic is in progress', () => {
    // 19:30 ET, for a 19:00 mic — under way, so the rich result should not
    // jump to next week mid-event.
    const during = new Date('2026-07-21T23:30:00Z');
    expect(etParts(getNextOccurrence('tuesday', { hours: 19, minutes: 0 }, during)).date).toBe('2026-07-21');
  });

  it('rolls to next week once the mic has finished', () => {
    // 22:00 ET, past the assumed 2h run of a 19:00 mic.
    const after = new Date('2026-07-22T02:00:00Z');
    expect(etParts(getNextOccurrence('tuesday', { hours: 19, minutes: 0 }, after)).date).toBe('2026-07-28');
  });

  it('finds the next matching weekday later this week', () => {
    expect(etParts(getNextOccurrence('friday', { hours: 20, minutes: 0 }, TUE_2PM_ET))).toMatchObject({
      date: '2026-07-24',
      weekday: 'Friday',
    });
  });

  it('wraps to the following week for a weekday already past', () => {
    expect(etParts(getNextOccurrence('monday', { hours: 20, minutes: 0 }, TUE_2PM_ET)).date).toBe('2026-07-27');
  });

  it('defaults to 7pm ET when no start time is known', () => {
    expect(etParts(getNextOccurrence('wednesday', null, TUE_2PM_ET)).time).toBe('19:00');
  });

  it('handles an unknown day without throwing', () => {
    expect(() => getNextOccurrence('someday', null, TUE_2PM_ET)).not.toThrow();
  });

  it('crosses a month boundary correctly', () => {
    // Tue 2026-07-28 -> next Saturday is 2026-08-01.
    const lateJuly = new Date('2026-07-28T18:00:00Z');
    expect(etParts(getNextOccurrence('saturday', { hours: 21, minutes: 0 }, lateJuly)).date).toBe('2026-08-01');
  });
});

describe('isoAtEtWallTime', () => {
  it('uses EDT in summer (UTC-4)', () => {
    expect(isoAtEtWallTime(2026, 6, 21, 19, 0)).toBe('2026-07-21T23:00:00.000Z');
  });

  it('uses EST in winter (UTC-5)', () => {
    expect(isoAtEtWallTime(2026, 0, 21, 19, 0)).toBe('2026-01-22T00:00:00.000Z');
  });
});

describe('parseTimeOfDay', () => {
  it('reads an ISO timestamp', () => {
    expect(parseTimeOfDay('1970-01-01T20:30:00.000Z')).toEqual({ hours: 20, minutes: 30 });
  });

  it('reads a bare clock string', () => {
    expect(parseTimeOfDay('9:15')).toEqual({ hours: 9, minutes: 15 });
  });

  it('returns null for unparseable input', () => {
    expect(parseTimeOfDay('whenever')).toBeNull();
  });
});

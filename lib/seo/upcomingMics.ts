import { allMics } from '../data/micsSnapshot';
import { venueImageFor } from '../services/mics.service';
import { MicListItem } from '../types/mic';

const DAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

function getEtNow(): { dow: number; hhmm: string } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'long',
    hourCycle: 'h23',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const dow = DAYS.indexOf(get('weekday').toLowerCase());
  return { dow, hhmm: `${get('hour')}:${get('minute')}` };
}

// "1970-01-01T14:00:00.000Z" -> "14:00:00"; null sorts first as "".
function timeOfDay(startTime: string | null): string {
  return startTime ? startTime.slice(11, 19) : '';
}

function micsForDay(day: string): MicListItem[] {
  return allMics()
    .filter((m) => m.day === day)
    .sort((a, b) => {
      const ta = timeOfDay(a.start_time);
      const tb = timeOfDay(b.start_time);
      return ta < tb ? -1 : ta > tb ? 1 : 0;
    });
}

async function withVenueImages(mics: MicListItem[]): Promise<MicListItem[]> {
  return Promise.all(
    mics.map(async (m) => ({
      ...m,
      venue_image: await venueImageFor(m.mic_address?.venue),
    }))
  );
}

export async function getUpcomingMics(limit = 4): Promise<MicListItem[]> {
  const { dow, hhmm } = getEtNow();
  const cutoff = `${hhmm}:00`;
  const result: MicListItem[] = [];

  // Today's remaining mics (strictly after now), earliest first.
  result.push(
    ...micsForDay(DAYS[dow])
      .filter((m) => timeOfDay(m.start_time) > cutoff)
      .slice(0, limit)
  );

  // Then fill from the following days until we have `limit`.
  for (let offset = 1; offset < 7 && result.length < limit; offset++) {
    const need = limit - result.length;
    const dayKey = DAYS[(dow + offset) % 7];
    result.push(...micsForDay(dayKey).slice(0, need));
  }

  return withVenueImages(result.filter((mic) => mic.name && mic.mic_address?.venue));
}

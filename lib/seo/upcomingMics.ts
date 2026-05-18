import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

const UPCOMING_INCLUDE = {
  mic_address: true,
  mic_cost: true,
  mic_occurrence: true,
} satisfies Prisma.micsInclude;

type UpcomingMic = Prisma.micsGetPayload<{ include: typeof UPCOMING_INCLUDE }>;

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

export async function getUpcomingMics(limit = 4): Promise<UpcomingMic[]> {
  const { dow, hhmm } = getEtNow();
  const todayCutoff = `1970-01-01T${hhmm}:00.000Z`;
  const result: UpcomingMic[] = [];

  result.push(
    ...(await prisma.mics.findMany({
      where: {
        day: DAYS[dow],
        start_time: { gt: todayCutoff },
      },
      include: UPCOMING_INCLUDE,
      orderBy: { start_time: 'asc' },
      take: limit,
    }))
  );

  for (let offset = 1; offset < 7 && result.length < limit; offset++) {
    const need = limit - result.length;
    const dayKey = DAYS[(dow + offset) % 7];
    const more = await prisma.mics.findMany({
      where: { day: dayKey },
      include: UPCOMING_INCLUDE,
      orderBy: { start_time: 'asc' },
      take: need,
    });
    result.push(...more);
  }

  return result.filter((mic) => mic.name && mic.mic_address?.venue);
}

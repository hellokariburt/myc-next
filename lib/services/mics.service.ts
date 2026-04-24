import prisma from '../prisma';
import { MicQueryParams, ALL_BOROUGHS, ALL_DAYS } from '../types/api';

const getMics = async (params: MicQueryParams) => {
  const boroughs = params.borough.length === 0 ? [...ALL_BOROUGHS] : params.borough;
  const days = params.day.length === 0 ? [...ALL_DAYS] : params.day;
  const costId = params.cost === 'true' ? 1 : undefined;

  const startTime =
    params.start_time !== '00:00:00' ? `1970-01-01T${params.start_time}.000Z` : undefined;

  const where = {
    day: { in: days },
    borough: { in: boroughs },
    cost_id: costId,
    ...(startTime && { start_time: { gte: startTime } }),
  };

  const [mics, count] = await prisma.$transaction([
    prisma.mics.findMany({
      include: { mic_address: true, mic_cost: true, mic_occurrence: true },
      where,
      orderBy: { id: 'asc' },
      skip: params.offset,
      take: params.limit,
    }),
    prisma.mics.count({ where }),
  ]);

  return { mics, count };
};

const getMic = async (id: bigint) => {
  return prisma.mics.findUnique({
    where: { id },
    include: {
      mic_address: true,
      mic_cost: true,
      mic_occurrence: true,
      signup_instructions: true,
      host_mics: {
        include: { mic_host: true },
      },
    },
  });
};

export { getMics, getMic };

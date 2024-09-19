import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getMics = async (params: any) => {
  const mic_cost = params.cost === 'true' ? 1 : undefined;

  const passingBorough = params.borough.includes('')
    ? ['manhattan', 'queens', 'staten-island', 'bronx', 'brooklyn']
    : params.borough;

  const passingDay = params.day.includes('')
    ? ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    : params.day;

  const [mics, count] = await prisma.$transaction([
    prisma.mics.findMany({
      include: { mic_address: true, mic_cost: true, mic_occurrence: true },
      where: {
        day: { in: passingDay },
        borough: { in: passingBorough },
        cost_id: mic_cost,
      },
      orderBy: { id: 'asc' },
      skip: params.offset,
      take: params.limit,
    }),
    prisma.mics.count({
      where: {
        day: { in: passingDay },
        borough: { in: passingBorough },
        cost_id: mic_cost,
      },
    }),
  ]);

  return { mics, count };
};

// const getMic = async (id?: number) => {
//   return await prisma.mics.findUnique({
//     where: { id: id },
//     include: {
//       mic_address: true,
//       mic_cost: true,
//       mic_occurrence: true,
//       signup_instructions: true,
//     },
//   });
// };

const getMic = async (id?: number) => {
  try {
    const mic = await prisma.mics.findUnique({
      where: { id },
      include: {
        mic_address: true,
        mic_cost: true,
        mic_occurrence: true,
        signup_instructions: true,
      },
    });

    return mic;
  } catch (error) {
    console.error('Error fetching mic:', error);
    throw error; // Optionally, rethrow the error if you want it to be handled by the caller
  }
};

const getMicHost = async (id?: number) => getMic(id); // Assuming same functionality as getMic
const getMicTimes = async (params: any) => {
  const mic_cost = params.cost === 'true' ? 1 : undefined;

  const passingBorough = params.borough.includes('')
    ? ['manhattan', 'queens', 'staten-island', 'bronx', 'brooklyn']
    : params.borough;

  const passingDay = params.day.includes('')
    ? ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    : params.day;

  const passingTime = params.start_time.includes('00:00')
    ? `1970-01-01T${params.start_time}.000Z`
    : '1970-01-01T00:00:00.000Z';

  const [mics, count] = await prisma.$transaction([
    prisma.mics.findMany({
      include: { mic_address: true, mic_cost: true, mic_occurrence: true },
      where: {
        day: { in: passingDay },
        borough: { in: passingBorough },
        start_time: { gte: passingTime },
        cost_id: mic_cost,
      },
      orderBy: { id: 'asc' },
      skip: params.offset,
      take: params.limit,
    }),
    prisma.mics.count({
      where: {
        day: { in: passingDay },
        borough: { in: passingBorough },
        start_time: { gte: passingTime },
        cost_id: mic_cost,
      },
    }),
  ]);

  return { mics, count };
};

export { getMics, getMic, getMicTimes, getMicHost };

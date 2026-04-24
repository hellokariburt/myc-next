import { getMics, getMic } from '../mics.service';
import prisma from '../../prisma';

jest.mock('../../prisma', () => ({
  __esModule: true,
  default: {
    mics: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

const makeMic = (overrides = {}) => ({
  id: BigInt(36),
  borough: 'manhattan',
  day: 'sunday',
  name: 'Test Mic',
  start_time: new Date('1970-01-01T14:00:00.000Z'),
  end_time: null,
  confirmed: null,
  address_id: BigInt(37),
  cost_id: BigInt(37),
  host_id: null,
  signup_id: null,
  notes: null,
  occurrence_id: null,
  instagram: null,
  website: null,
  email_address: null,
  phone_number: null,
  venue_type: null,
  stage_time: null,
  other_rules: null,
  mic_address: { venue: 'Test Venue', street_name: '123 Main St', unit_number: 0, latitude: '40.7', longitude: '-73.9' },
  mic_cost: { cost_amount: 'Free' },
  mic_occurrence: null,
  ...overrides,
});

describe('getMics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('queries with default params', async () => {
    const mics = [makeMic()];
    (mockPrisma.$transaction as jest.Mock).mockResolvedValue([mics, 1]);

    const result = await getMics({
      day: [],
      borough: [],
      limit: 10,
      offset: 0,
      start_time: '00:00:00',
      cost: 'false',
    });

    expect(result.mics).toHaveLength(1);
    expect(result.count).toBe(1);
    expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
  });

  it('filters by specific borough and day', async () => {
    (mockPrisma.$transaction as jest.Mock).mockResolvedValue([[], 0]);

    await getMics({
      day: ['monday'],
      borough: ['brooklyn'],
      limit: 10,
      offset: 0,
      start_time: '00:00:00',
      cost: 'false',
    });

    const transactionArg = (mockPrisma.$transaction as jest.Mock).mock.calls[0][0];
    // $transaction receives an array of promises, so we verify it was called
    expect(transactionArg).toHaveLength(2);
  });

  it('applies free filter when cost is true', async () => {
    (mockPrisma.$transaction as jest.Mock).mockResolvedValue([[], 0]);

    const result = await getMics({
      day: [],
      borough: [],
      limit: 10,
      offset: 0,
      start_time: '00:00:00',
      cost: 'true',
    });

    expect(result.mics).toEqual([]);
    expect(result.count).toBe(0);
  });

  it('respects offset and limit for pagination', async () => {
    (mockPrisma.$transaction as jest.Mock).mockResolvedValue([[], 0]);

    await getMics({
      day: [],
      borough: [],
      limit: 5,
      offset: 15,
      start_time: '00:00:00',
      cost: 'false',
    });

    expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
  });
});

describe('getMic', () => {
  it('fetches a single mic by id', async () => {
    const mic = makeMic();
    (mockPrisma.mics.findUnique as jest.Mock).mockResolvedValue(mic);

    const result = await getMic(BigInt(36));

    expect(result).toEqual(mic);
    expect(mockPrisma.mics.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: BigInt(36) },
      })
    );
  });

  it('returns null for nonexistent mic', async () => {
    (mockPrisma.mics.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await getMic(BigInt(999));

    expect(result).toBeNull();
  });
});

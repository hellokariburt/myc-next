import { getMics, getMic } from '../mics.service';
import prisma from '../../prisma';
import { allMics } from '../../data/micsSnapshot';
import { MicListItem } from '../../types/mic';

// getMics reads the committed snapshot (no DB); getMic still hits Prisma.
jest.mock('../../prisma', () => ({
  __esModule: true,
  default: {
    mics: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('../../data/micsSnapshot', () => ({
  __esModule: true,
  allMics: jest.fn(),
  micCount: 0,
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockAllMics = allMics as jest.MockedFunction<typeof allMics>;

const makeItem = (o: Partial<MicListItem> = {}): MicListItem => ({
  id: 36,
  borough: 'manhattan',
  confirmed: null,
  day: 'sunday',
  name: 'Test Mic',
  start_time: '1970-01-01T14:00:00.000Z',
  end_time: null,
  instagram: null,
  website: null,
  email_address: null,
  venue_type: null,
  stage_time: null,
  other_rules: null,
  mic_address: {
    venue: 'Test Venue',
    street_name: '123 Main St',
    unit_number: 0,
    latitude: null,
    longitude: null,
    neighborhood: 'SoHo',
  },
  mic_cost: { cost_amount: 'Free' },
  mic_occurrence: null,
  ...o,
});

const DEFAULT_PARAMS = {
  q: '',
  day: [] as string[],
  borough: [] as string[],
  limit: 10,
  offset: 0,
  start_time: '00:00:00',
  cost: 'false',
};

describe('getMics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns all mics with default params', async () => {
    mockAllMics.mockReturnValue([makeItem({ id: 1 }), makeItem({ id: 2 })]);

    const result = await getMics({ ...DEFAULT_PARAMS });

    expect(result.count).toBe(2);
    expect(result.mics).toHaveLength(2);
    expect(result.mics[0]).toHaveProperty('venue_image');
  });

  it('filters by specific borough and day', async () => {
    mockAllMics.mockReturnValue([
      makeItem({ id: 1, borough: 'manhattan', day: 'sunday' }),
      makeItem({ id: 2, borough: 'brooklyn', day: 'monday' }),
      makeItem({ id: 3, borough: 'brooklyn', day: 'tuesday' }),
    ]);

    const result = await getMics({ ...DEFAULT_PARAMS, day: ['monday'], borough: ['brooklyn'] });

    expect(result.count).toBe(1);
    expect(result.mics.map((m) => m.id)).toEqual([2]);
  });

  it('applies the free filter when cost is true', async () => {
    mockAllMics.mockReturnValue([
      makeItem({ id: 1, mic_cost: { cost_amount: 'Free' } }),
      makeItem({ id: 2, mic_cost: { cost_amount: '$5 cash' } }),
      makeItem({ id: 3, mic_cost: null }),
    ]);

    const result = await getMics({ ...DEFAULT_PARAMS, cost: 'true' });

    expect(result.count).toBe(2);
    expect(result.mics.map((m) => m.id).sort()).toEqual([1, 3]);
  });

  it('matches q against name, venue and neighborhood', async () => {
    mockAllMics.mockReturnValue([
      makeItem({ id: 1, name: 'Grisly Pear Mic' }),
      makeItem({ id: 2, name: 'Other', mic_address: { ...makeItem().mic_address!, venue: 'The Grisly Pear' } }),
      makeItem({ id: 3, name: 'Nope', mic_address: { ...makeItem().mic_address!, venue: 'Elsewhere', neighborhood: 'Harlem' } }),
    ]);

    const result = await getMics({ ...DEFAULT_PARAMS, q: 'grisly' });

    expect(result.mics.map((m) => m.id).sort()).toEqual([1, 2]);
  });

  it('respects offset and limit for pagination', async () => {
    mockAllMics.mockReturnValue(
      Array.from({ length: 25 }, (_, i) => makeItem({ id: i + 1, day: 'sunday' }))
    );

    const result = await getMics({ ...DEFAULT_PARAMS, limit: 5, offset: 15 });

    expect(result.count).toBe(25);
    expect(result.mics).toHaveLength(5);
  });
});

describe('getMic', () => {
  const makeDbMic = () => ({
    id: BigInt(36),
    name: 'Test Mic',
    mic_address: { venue: 'Test Venue' },
  });

  it('fetches a single mic by id', async () => {
    const mic = makeDbMic();
    (mockPrisma.mics.findUnique as jest.Mock).mockResolvedValue(mic);

    const result = await getMic(BigInt(36));

    expect(result).toEqual({ ...mic, venue_image: null });
    expect(mockPrisma.mics.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: BigInt(36) } })
    );
  });

  it('returns null for a nonexistent mic', async () => {
    (mockPrisma.mics.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await getMic(BigInt(999));

    expect(result).toBeNull();
  });
});

import { parseParams } from '../parseParams';
import { MicQueryParams } from '../../types/api';

function params(obj: Record<string, string>): URLSearchParams {
  return new URLSearchParams(obj);
}

describe('parseParams', () => {
  it('returns defaults when no params provided', () => {
    const result = parseParams(params({})) as MicQueryParams;
    expect(result).toEqual({
      day: [],
      borough: [],
      limit: 10,
      offset: 0,
      start_time: '00:00:00',
      cost: 'false',
    });
  });

  it('expands borough=all to all boroughs', () => {
    const result = parseParams(params({ borough: 'all' })) as MicQueryParams;
    expect(result.borough).toEqual([
      'manhattan', 'queens', 'staten-island', 'bronx', 'brooklyn',
    ]);
  });

  it('expands day=all to all days', () => {
    const result = parseParams(params({ day: 'all' })) as MicQueryParams;
    expect(result.day).toEqual([
      'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
    ]);
  });

  it('splits comma-separated boroughs', () => {
    const result = parseParams(params({ borough: 'brooklyn,queens' })) as MicQueryParams;
    expect(result.borough).toEqual(['brooklyn', 'queens']);
  });

  it('splits comma-separated days', () => {
    const result = parseParams(params({ day: 'monday,friday' })) as MicQueryParams;
    expect(result.day).toEqual(['monday', 'friday']);
  });

  it('parses offset and limit', () => {
    const result = parseParams(params({ offset: '20', limit: '5' })) as MicQueryParams;
    expect(result.offset).toBe(20);
    expect(result.limit).toBe(5);
  });

  it('rejects limit below 1', () => {
    const result = parseParams(params({ limit: '0' }));
    expect(typeof result).toBe('string');
    expect(result).toContain('limit');
  });

  it('rejects limit above 100', () => {
    const result = parseParams(params({ limit: '101' }));
    expect(typeof result).toBe('string');
  });

  it('rejects negative offset', () => {
    const result = parseParams(params({ offset: '-1' }));
    expect(typeof result).toBe('string');
    expect(result).toContain('offset');
  });

  it('rejects non-integer limit', () => {
    const result = parseParams(params({ limit: '3.5' }));
    expect(typeof result).toBe('string');
  });

  it('parses valid start-time', () => {
    const result = parseParams(params({ 'start-time': '19:00:00' })) as MicQueryParams;
    expect(result.start_time).toBe('19:00:00');
  });

  it('rejects invalid start-time format', () => {
    const result = parseParams(params({ 'start-time': '7pm' }));
    expect(typeof result).toBe('string');
    expect(result).toContain('start-time');
  });

  it('rejects start-time with invalid hours', () => {
    const result = parseParams(params({ 'start-time': '25:00:00' }));
    expect(typeof result).toBe('string');
  });

  it('maps free param to cost', () => {
    const result = parseParams(params({ free: 'true' })) as MicQueryParams;
    expect(result.cost).toBe('true');
  });

  it('defaults cost to false when free not provided', () => {
    const result = parseParams(params({})) as MicQueryParams;
    expect(result.cost).toBe('false');
  });
});

import { buildMicSearchUrl } from '../buildMicSearchUrl';

describe('buildMicSearchUrl', () => {
  it('builds URL with default values', () => {
    const url = buildMicSearchUrl({
      borough: [],
      day: '',
      startTime: '',
      free: false,
    });
    expect(url).toBe('/mics?borough=all&day=all&start-time=00%3A00%3A00&free=false&pageNo=1&pageSize=10');
  });

  it('joins borough array into comma-separated string', () => {
    const url = buildMicSearchUrl({
      borough: ['brooklyn', 'queens'],
      day: '',
      startTime: '',
      free: false,
    });
    const params = new URLSearchParams(url.split('?')[1]);
    expect(params.get('borough')).toBe('brooklyn,queens');
  });

  it('passes single borough as string', () => {
    const url = buildMicSearchUrl({
      borough: ['manhattan'],
      day: '',
      startTime: '',
      free: false,
    });
    const params = new URLSearchParams(url.split('?')[1]);
    expect(params.get('borough')).toBe('manhattan');
  });

  it('sets day when provided', () => {
    const url = buildMicSearchUrl({
      borough: [],
      day: 'monday',
      startTime: '',
      free: false,
    });
    const params = new URLSearchParams(url.split('?')[1]);
    expect(params.get('day')).toBe('monday');
  });

  it('sets start-time when provided', () => {
    const url = buildMicSearchUrl({
      borough: [],
      day: '',
      startTime: '19:00:00',
      free: false,
    });
    const params = new URLSearchParams(url.split('?')[1]);
    expect(params.get('start-time')).toBe('19:00:00');
  });

  it('sets free=true', () => {
    const url = buildMicSearchUrl({
      borough: [],
      day: '',
      startTime: '',
      free: true,
    });
    const params = new URLSearchParams(url.split('?')[1]);
    expect(params.get('free')).toBe('true');
  });

  it('accepts custom pageNo and pageSize', () => {
    const url = buildMicSearchUrl({
      borough: [],
      day: '',
      startTime: '',
      free: false,
      pageNo: 3,
      pageSize: 20,
    });
    const params = new URLSearchParams(url.split('?')[1]);
    expect(params.get('pageNo')).toBe('3');
    expect(params.get('pageSize')).toBe('20');
  });

  it('defaults empty borough array to all', () => {
    const url = buildMicSearchUrl({
      borough: [],
      day: '',
      startTime: '',
      free: false,
    });
    const params = new URLSearchParams(url.split('?')[1]);
    expect(params.get('borough')).toBe('all');
  });

  it('handles single borough in array', () => {
    const url = buildMicSearchUrl({
      borough: ['bronx'],
      day: '',
      startTime: '',
      free: false,
    });
    const params = new URLSearchParams(url.split('?')[1]);
    expect(params.get('borough')).toBe('bronx');
  });
});

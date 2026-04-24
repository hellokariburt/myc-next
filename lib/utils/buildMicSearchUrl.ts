export function buildMicSearchUrl(filters: {
  borough: string[] | string;
  day: string;
  startTime: string;
  free: boolean;
  pageNo?: number;
  pageSize?: number;
}): string {
  const params = new URLSearchParams();
  params.set('borough', filters.borough.length > 0 ? String(filters.borough) : 'all');
  params.set('day', filters.day || 'all');
  params.set('start-time', filters.startTime || '00:00:00');
  params.set('free', String(filters.free));
  params.set('pageNo', String(filters.pageNo ?? 1));
  params.set('pageSize', String(filters.pageSize ?? 10));
  return `/mics?${params.toString()}`;
}

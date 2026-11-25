'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { request } from '../utils/request';
import { MicListResponse } from '../types/mic';

/**
 * Pins for the `/mics` map. Unlike useMicSearch, this strips all pagination
 * params (pageNo/pageSize/offset/limit) so the query key depends only on the
 * active filters — the map keeps its full pin set and does NOT refetch when the
 * user changes pages. The pins endpoint caps the result at MAP_PIN_CAP.
 */
export function useMicPins(serverPins?: MicListResponse) {
  const searchParams = useSearchParams();

  const apiParams = new URLSearchParams(searchParams);
  apiParams.delete('pageNo');
  apiParams.delete('pageSize');
  apiParams.delete('offset');
  apiParams.delete('limit');
  const apiQueryString = apiParams.toString();

  const { data } = useQuery<MicListResponse>({
    queryKey: ['mic-pins', apiQueryString],
    queryFn: () => request<MicListResponse>(`/api/mics/pins?${apiQueryString}`),
    retry: false,
    initialData: serverPins,
    // Same freshness window as the list: pins change at approval/deploy time, so
    // hydration shouldn't immediately re-hit /api/mics/pins (and Neon).
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return { pins: data };
}

'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { request } from '../utils/request';
import { MicListResponse } from '../types/mic';

export function useMicSearch() {
  const searchParams = useSearchParams();

  // Convert page-based URL params to offset/limit for the API
  const apiParams = new URLSearchParams(searchParams);
  const pageNo = parseInt(apiParams.get('pageNo') || '1', 10);
  const pageSize = parseInt(apiParams.get('pageSize') || '10', 10);
  apiParams.set('offset', String((pageNo - 1) * pageSize));
  apiParams.set('limit', String(pageSize));
  apiParams.delete('pageNo');
  apiParams.delete('pageSize');
  const apiQueryString = apiParams.toString();

  const { data, isLoading, isError } = useQuery<MicListResponse>({
    queryKey: ['mics', apiQueryString],
    queryFn: () => request<MicListResponse>(`/api/mics?${apiQueryString}`),
    retry: false,
  });

  return {
    mics: data,
    isLoading,
    isError,
    params: searchParams,
  };
}

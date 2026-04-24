'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const useQuery = (): [URLSearchParams, SetQuery, ClearQuery, GetQuery, SetPagination] => {
  const pathname = usePathname();
  const router = useRouter();
  const query = useSearchParams();
  let params = new URLSearchParams(query);

  const getQuery: GetQuery = (q = {}) => {
    let update: Record<string, any> = {
      free: 'false',
      offset: 0,
      limit: 10,
      day: 'all',
      borough: 'all',
      'start-time': '00:00:00',
    };

    if (params?.has('day')) {
      update = { ...update, day: params.get('day') };
    }

    if (params?.has('borough')) {
      update = { ...update, borough: params.get('borough') };
    }

    if (params?.has('start-time')) {
      update = { ...update, 'start-time': params.get('start-time') };
    }

    const pageSize = params?.get('pageSize') ? Number(params.get('pageSize')) : 10;
    update = { ...update, limit: pageSize };

    if (params?.get('pageNo')) {
      const page = parseInt(params.get('pageNo')!, 10) || 1;
      update = { ...update, offset: (page - 1) * pageSize };
    }

    if (params?.get('free') === 'true') {
      update = { ...update, free: 'true' };
    }

    return { ...update, ...q };
  };

  const setQuery: SetQuery = (q) => {
    if (!q) {
      return null;
    }

    return (
      router.push(
        `/mics?borough=${q.boroughQuery}&day=${q.dayQuery}&start-time=${q.timeQuery}&free=${
          q.free
        }&pageNo=${q.pageNo || 1}&pageSize=${q.pageSize || 10}`
      ),
      {
        shallow: true,
        scroll: true,
      }
    );
  };

  const setPagination: SetPagination = (q) => {
    if (!q) {
      return null;
    }
    return (
      router.push(`${pathname}?${q}`),
      {
        shallow: false,
        scroll: true,
      }
    );
  };

  const clearQuery: ClearQuery = (q) => {
    if (!q) {
      return null;
    }
    const updated = new URLSearchParams(params.toString());
    Object.keys(q).forEach((key) => updated.delete(key));
    params = updated;
    return (
      router.push(`${pathname}${params.toString()}`),
      {
        scroll: true,
      }
    );
  };
  return [params, setQuery, clearQuery, getQuery, setPagination];
};

export type Params = {
  [index: string]: any;
  // Search query param - borough
  borough?: string;
  // Search query param - day
  day?: string;
  // Search query param - starttime
  'start-time'?: string;
  // Search query param - cost
  free?: string;
  // Current results page
  page?: number;
  // Sort Filter
  sort?: string;
};

export type SetQuery = (query?: Record<string, any>, clear?: boolean, append?: boolean) => void;

export type SetPagination = (
  query?: Record<string, any>,
  clear?: boolean,
  append?: boolean
) => void;

export type ClearQuery = (query?: Record<string, any>, clearAll?: boolean) => void;

export type GetQuery = (query?: Record<string, any>) => any;

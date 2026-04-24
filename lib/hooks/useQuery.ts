'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const useQuery = (): [URLSearchParams, SetQuery, ClearQuery, GetQuery, SetPagination] => {
  const pathname = usePathname();
  const router = useRouter();
  const query = useSearchParams();
  let params = new URLSearchParams(query);

  const getQuery: GetQuery = (q = {}) => {
    let update = {};

    if (pathname === '/mics') {
      update = { ...update, free: false, offset: 1, limit: 10, day: 'all', borough: 'all' };
    }

    // Getting day param
    if (params?.has('day')) {
      update = { ...update, day: params?.get('day') };
    }

    // if (params?.has('day')) {
    //   update = { ...update, day: params?.get('day') };
    // } else {
    //   update = { ...update, day: '' };
    // }

    // Getting borough param
    if (params?.get('borough') === 'All') {
      update = {
        ...update,
        // borough: ['Manhattan', 'Queens', 'Staten-Island', 'Bronx', 'Brooklyn'],
        borough: ['All'],
      };
    } else if (params?.has('borough')) {
      update = { ...update, borough: params?.get('borough') };
    }

    // Getting time param
    if (params?.get('start-time') === '00:00:00') {
      update = {
        ...update,
        // borough: ['Manhattan', 'Queens', 'Staten-Island', 'Bronx', 'Brooklyn'],
        'start-time': '00:00:00',
      };
    } else if (params?.has('start-time')) {
      update = { ...update, 'start-time': params?.get('start-time') };
    }

    // Getting page size param
    let pageSize;
    // Condition to get page number if present
    if (params?.get('pageSize')) {
      pageSize = Number(params?.get('pageSize'));
      update = { ...update, limit: pageSize };
    } else {
      pageSize = 10;
      update = { ...update, limit: pageSize };
    }

    // Getting page number param
    let pageNumber;
    // Condition to get page number if present
    if (params?.get('pageNo')) {
      const page = parseInt(params?.get('pageNo')!, 10) || 1;
      const offset = (page - 1) * pageSize;

      pageNumber = Number(params?.get('pageNo'));
      update = { ...update, offset };
    } else {
      pageNumber = 0;
      update = { ...update, offset: pageNumber };
    }

    // Getting if free param
    let checkFree;
    if (params?.get('free') === 'true') {
      checkFree = 'true';
      update = { ...update, free: checkFree };
    }

    // console.log('this is the update kari', update);
    // console.log('This is the Q', q);

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
    // console.log('This is what I am passing a q', q.toString());
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

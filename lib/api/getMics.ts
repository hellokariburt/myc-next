import { request } from '../utils/request';

export const getMics: any = async (params: any) => {
  if (!params) {
    throw new Error('Missing required search params');
  }

  try {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val != null && val !== '') {
        searchParams.set(key, String(val));
      }
    });

    return await request(`/api/mics?${searchParams.toString()}`);
  } catch (err) {
    throw Error('No mic found');
  }
};

export type MicSearch = (params?: {
  borough?: string[];
  day?: string;
  offset?: number;
  limit?: number;
  sortBy?: string;
  cost?: string;
}) => Promise<any>;

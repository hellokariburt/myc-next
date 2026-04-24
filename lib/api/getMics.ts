import qs from 'query-string';
import { request } from '../utils/request';

export const getMics: any = async (params: any) => {
  if (!params) {
    throw new Error('Missing required search params');
  }

  try {
    const search = qs.stringify(params, {
      encode: true,
      skipNull: true,
    });

    return await request(`/api/mics?${search}`);
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

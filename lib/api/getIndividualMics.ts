import { request } from '../utils/request';

export const getIndividualMics: any = async (params: any) => {
  if (!params) {
    throw new Error('Missing required search params');
  }

  try {
    return await request(`/api/mic?id=${params.id}`);
  } catch (err) {
    throw Error('No individual mic found');
  }
};

export type IndividualMicSearch = (params?: {
  id?: string;
}) => Promise<any>;

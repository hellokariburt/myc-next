import { useQuery } from '@tanstack/react-query';
import { getIndividualMics } from '../api/getIndividualMics';

export const useIndividualMics = (params?: { id?: string }) =>
  useQuery({
    queryKey: ['mic', params?.id],
    enabled: !!params?.id,
    retry: false,
    queryFn: () => getIndividualMics(params),
  });

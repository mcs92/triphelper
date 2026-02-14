import { useQuery } from '@tanstack/react-query';
import { fetchBusPredictions } from '../api/endpoints';
import { REFETCH_INTERVAL } from '../lib/constants';

export function useBusPredictions(stopId: string) {
  return useQuery({
    queryKey: ['busPredictions', stopId],
    queryFn: () => fetchBusPredictions(stopId),
    refetchInterval: REFETCH_INTERVAL,
    enabled: !!stopId,
    retry: 2,
  });
}

import { useQuery } from '@tanstack/react-query';
import { fetchRailPredictions } from '../api/endpoints';
import { REFETCH_INTERVAL } from '../lib/constants';

export function useRailPredictions(stationCodes: string) {
  return useQuery({
    queryKey: ['railPredictions', stationCodes],
    queryFn: () => fetchRailPredictions(stationCodes),
    refetchInterval: REFETCH_INTERVAL,
    enabled: !!stationCodes,
    retry: 2,
    select: (data) =>
      data.Trains.filter(
        (train) => train.Line !== '--' && train.Line !== 'No' && train.Line !== ''
      ),
  });
}

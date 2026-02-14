import { useQuery } from '@tanstack/react-query';
import { fetchStations } from '../api/endpoints';
import { STALE_TIME_24H } from '../lib/constants';

export function useStations() {
  return useQuery({
    queryKey: ['stations'],
    queryFn: fetchStations,
    staleTime: STALE_TIME_24H,
    retry: 2,
    select: (data) => data.Stations,
  });
}

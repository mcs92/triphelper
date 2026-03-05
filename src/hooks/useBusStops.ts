import { useQuery } from '@tanstack/react-query';
import { fetchBusStops } from '@/api/endpoints';
import { STALE_TIME_24H } from '@/lib/constants';

export function useBusStops() {
  return useQuery({
    queryKey: ['busStops'],
    queryFn: fetchBusStops,
    staleTime: STALE_TIME_24H,
    retry: 2,
    select: (data) => data.Stops,
  });
}

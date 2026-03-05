import { useQuery } from '@tanstack/react-query';
import { fetchBikeStationInfo, fetchBikeStationStatus } from '@/api/endpoints';
import { STALE_TIME_24H } from '@/lib/constants';
import type { BikeDock } from '@/api/types';

const BIKE_REFETCH_INTERVAL = 60_000; // GBFS TTL is 60s

export function useBikeStations() {
  return useQuery({
    queryKey: ['bikeStationInfo'],
    queryFn: fetchBikeStationInfo,
    staleTime: STALE_TIME_24H,
    retry: 2,
    select: (data) => data.data.stations,
  });
}

export function useBikeDocks() {
  const { data: stations } = useBikeStations();

  return useQuery({
    queryKey: ['bikeStationStatus'],
    queryFn: fetchBikeStationStatus,
    refetchInterval: BIKE_REFETCH_INTERVAL,
    retry: 2,
    enabled: !!stations,
    select: (statusData): BikeDock[] => {
      if (!stations) return [];
      const statusMap = new Map(
        statusData.data.stations.map((s) => [s.station_id, s])
      );
      return stations.map((station) => ({
        ...station,
        status: statusMap.get(station.station_id) ?? null,
      }));
    },
  });
}

export function useBikeDock(stationId: string) {
  const { data: docks, isLoading, error, refetch, dataUpdatedAt } = useBikeDocks();
  const dock = docks?.find((d) => d.station_id === stationId) ?? null;
  return { dock, isLoading, error, refetch, dataUpdatedAt };
}

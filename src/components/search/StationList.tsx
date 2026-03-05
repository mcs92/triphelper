import { useMemo } from 'react';
import { useStations } from '@/hooks/useStations';
import StopCard from '@/components/search/StopCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import EmptyState from '@/components/common/EmptyState';

interface StationListProps {
  searchQuery: string;
}

export default function StationList({ searchQuery }: StationListProps) {
  const { data: stations, isLoading, error, refetch } = useStations();

  const filtered = useMemo(() => {
    if (!stations) return [];
    if (!searchQuery) return stations;
    const q = searchQuery.toLowerCase();
    return stations.filter((s) => s.Name.toLowerCase().includes(q));
  }, [stations, searchQuery]);

  if (isLoading) return <LoadingSpinner message="Loading stations..." />;
  if (error) return <ErrorMessage message={error.message} onRetry={() => refetch()} />;
  if (!searchQuery) return <EmptyState title="Search for a Metro station" description="Type a station name above" />;
  if (filtered.length === 0) return <EmptyState title="No stations found" description={`No results for "${searchQuery}"`} />;

  return (
    <div className="flex flex-col gap-2">
      {filtered.map((station) => {
        const lines = [station.LineCode1, station.LineCode2, station.LineCode3, station.LineCode4].filter(
          (l): l is string => !!l
        );
        return (
          <StopCard
            key={station.Code}
            id={station.Code}
            name={station.Name}
            type="rail"
            lines={lines}
            linkTo={`/rail/${station.Code}`}
            stationTogether1={station.StationTogether1 || undefined}
          />
        );
      })}
    </div>
  );
}

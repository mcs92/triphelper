import { useMemo } from 'react';
import { useBusStops } from '@/hooks/useBusStops';
import { MAX_BUS_RESULTS } from '@/lib/constants';
import StopCard from '@/components/search/StopCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import EmptyState from '@/components/common/EmptyState';

interface BusStopListProps {
  searchQuery: string;
}

export default function BusStopList({ searchQuery }: BusStopListProps) {
  const { data: stops, isLoading, error, refetch } = useBusStops();

  const filtered = useMemo(() => {
    if (!stops || !searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return stops
      .filter((s) => s.Name.toLowerCase().includes(q) || s.StopID.includes(searchQuery))
      .slice(0, MAX_BUS_RESULTS);
  }, [stops, searchQuery]);

  if (isLoading) return <LoadingSpinner message="Loading bus stops..." />;
  if (error) return <ErrorMessage message={error.message} onRetry={() => refetch()} />;
  if (!searchQuery) return <EmptyState title="Search for a bus stop" description="Type a stop name or ID above" />;
  if (filtered.length === 0) return <EmptyState title="No bus stops found" description={`No results for "${searchQuery}"`} />;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-muted-foreground">
        {filtered.length >= MAX_BUS_RESULTS
          ? `Showing first ${MAX_BUS_RESULTS} results — try a more specific search`
          : `${filtered.length} result${filtered.length === 1 ? '' : 's'}`}
      </p>
      {filtered.map((stop) => (
        <StopCard
          key={stop.StopID}
          id={stop.StopID}
          name={stop.Name}
          type="bus"
          routes={stop.Routes}
          linkTo={`/bus/${stop.StopID}`}
        />
      ))}
    </div>
  );
}

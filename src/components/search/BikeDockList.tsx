import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useBikeDocks } from '@/hooks/useBikeDocks';
import { useFavoritesContext } from '@/context/FavoritesContext';
import { MAX_BUS_RESULTS } from '@/lib/constants';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import EmptyState from '@/components/common/EmptyState';
import type { FavoriteStop } from '@/api/types';

interface BikeDockListProps {
  searchQuery: string;
}

export default function BikeDockList({ searchQuery }: BikeDockListProps) {
  const { data: docks, isLoading, error, refetch } = useBikeDocks();
  const { isFavorite, toggleFavorite } = useFavoritesContext();

  const filtered = useMemo(() => {
    if (!docks || !searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return docks
      .filter((d) =>
        d.name.toLowerCase().includes(q) ||
        d.short_name.includes(searchQuery)
      )
      .filter((d) => d.status?.is_installed === 1)
      .slice(0, MAX_BUS_RESULTS);
  }, [docks, searchQuery]);

  if (isLoading) return <LoadingSpinner message="Loading bike docks..." />;
  if (error) return <ErrorMessage message={error.message} onRetry={() => refetch()} />;
  if (!searchQuery) return <EmptyState title="Search for a bike dock" description="Type a dock name or number above" />;
  if (filtered.length === 0) return <EmptyState title="No bike docks found" description={`No results for "${searchQuery}"`} />;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-muted-foreground">
        {filtered.length >= MAX_BUS_RESULTS
          ? `Showing first ${MAX_BUS_RESULTS} results — try a more specific search`
          : `${filtered.length} result${filtered.length === 1 ? '' : 's'}`}
      </p>
      {filtered.map((dock) => {
        const favorited = isFavorite(dock.station_id);
        const favStop: FavoriteStop = {
          id: dock.station_id,
          type: 'bike',
          name: dock.name,
          meta: {},
        };
        const bikes = dock.status?.num_bikes_available ?? 0;
        const ebikes = dock.status?.num_ebikes_available ?? 0;
        const emptyDocks = dock.status?.num_docks_available ?? 0;

        return (
          <Card
            key={dock.station_id}
            className="flex-row items-center gap-3 p-3 py-3"
          >
            <Link to={`/bike/${dock.station_id}`} className="flex-1 min-w-0 no-underline text-inherit">
              <p className="font-medium text-sm text-foreground truncate">{dock.name}</p>
              <div className="flex gap-3 mt-1 text-[11px]">
                <span className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{bikes - ebikes}</span> bikes
                </span>
                <span className="text-muted-foreground">
                  <span className="font-semibold text-emerald-600">{ebikes}</span> e-bikes
                </span>
                <span className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{emptyDocks}</span> docks
                </span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(favStop);
              }}
              className="shrink-0 size-8"
              aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star
                className={`size-5 ${favorited ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/40'}`}
              />
            </Button>
          </Card>
        );
      })}
    </div>
  );
}

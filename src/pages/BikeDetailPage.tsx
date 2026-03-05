import { useParams, Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useFavoritesContext } from '@/context/FavoritesContext';
import { useBikeDock } from '@/hooks/useBikeDocks';
import { Button } from '@/components/ui/button';
import BikeAvailability from '@/components/predictions/BikeAvailability';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';

export default function BikeDetailPage() {
  const { stationId } = useParams<{ stationId: string }>();
  const { dock, isLoading, error, refetch, dataUpdatedAt } = useBikeDock(stationId ?? '');
  const { isFavorite, toggleFavorite } = useFavoritesContext();

  const favorited = stationId ? isFavorite(stationId) : false;

  if (isLoading) return <LoadingSpinner message="Loading dock info..." />;
  if (error) return <ErrorMessage message={error.message} onRetry={() => refetch()} />;

  const dockName = dock?.name ?? 'Bike Dock';

  return (
    <div className="flex flex-col gap-4">
      <Link to="/" className="text-sm text-muted-foreground no-underline hover:text-foreground">
        &larr; Back to search
      </Link>

      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-foreground">{dockName}</h1>
          {dock && (
            <p className="text-xs text-muted-foreground mt-0.5">Dock #{dock.short_name}</p>
          )}
        </div>
        {stationId && dock && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              toggleFavorite({
                id: stationId,
                type: 'bike',
                name: dockName,
                meta: {},
              })
            }
          >
            <Star
              className={`size-5 ${favorited ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/40'}`}
            />
          </Button>
        )}
      </div>

      {dock && <BikeAvailability dock={dock} dataUpdatedAt={dataUpdatedAt} />}
    </div>
  );
}

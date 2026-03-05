import { useParams, Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useBusPredictions } from '@/hooks/useBusPredictions';
import { useFavoritesContext } from '@/context/FavoritesContext';
import { Button } from '@/components/ui/button';
import BusPredictions from '@/components/predictions/BusPredictions';

export default function BusDetailPage() {
  const { stopId } = useParams<{ stopId: string }>();
  const { data } = useBusPredictions(stopId ?? '');
  const { isFavorite, toggleFavorite } = useFavoritesContext();

  const stopName = data?.StopName ?? stopId ?? 'Bus Stop';
  const favorited = stopId ? isFavorite(stopId) : false;

  return (
    <div className="flex flex-col gap-4">
      <Link to="/" className="text-sm text-muted-foreground no-underline hover:text-foreground">
        &larr; Back to search
      </Link>

      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-foreground">{stopName}</h1>
          {stopId && (
            <p className="text-xs text-muted-foreground mt-0.5">Stop #{stopId}</p>
          )}
        </div>
        {stopId && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              toggleFavorite({
                id: stopId,
                type: 'bus',
                name: stopName,
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

      <BusPredictions stopId={stopId ?? ''} />
    </div>
  );
}

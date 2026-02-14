import { useParams, Link } from 'react-router-dom';
import { useBusPredictions } from '../hooks/useBusPredictions';
import { useFavoritesContext } from '../context/FavoritesContext';
import BusPredictions from '../components/predictions/BusPredictions';

export default function BusDetailPage() {
  const { stopId } = useParams<{ stopId: string }>();
  const { data } = useBusPredictions(stopId ?? '');
  const { isFavorite, toggleFavorite } = useFavoritesContext();

  const stopName = data?.StopName ?? stopId ?? 'Bus Stop';
  const favorited = stopId ? isFavorite(stopId) : false;

  return (
    <div className="flex flex-col gap-4">
      <Link to="/" className="text-sm text-gray-500 no-underline hover:text-gray-700">
        &larr; Back to search
      </Link>

      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{stopName}</h1>
          {stopId && (
            <p className="text-xs text-gray-400 mt-0.5">Stop #{stopId}</p>
          )}
        </div>
        {stopId && (
          <button
            onClick={() =>
              toggleFavorite({
                id: stopId,
                type: 'bus',
                name: stopName,
                meta: {},
              })
            }
            className="shrink-0 p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <svg
              className={`w-5 h-5 ${favorited ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
              fill={favorited ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
        )}
      </div>

      <BusPredictions stopId={stopId ?? ''} />
    </div>
  );
}

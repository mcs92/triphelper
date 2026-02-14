import { Link } from 'react-router-dom';
import { useFavoritesContext } from '../../context/FavoritesContext';
import { LINE_COLORS } from '../../lib/constants';
import type { FavoriteStop } from '../../api/types';

interface StopCardProps {
  id: string;
  name: string;
  type: 'rail' | 'bus';
  lines?: string[];
  routes?: string[];
  linkTo: string;
  stationTogether1?: string;
}

export default function StopCard({ id, name, type, lines, routes, linkTo, stationTogether1 }: StopCardProps) {
  const { isFavorite, toggleFavorite } = useFavoritesContext();
  const favorited = isFavorite(id);

  const favoriteStop: FavoriteStop = {
    id,
    type,
    name,
    meta: { lines, routes, stationTogether1 },
  };

  return (
    <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 p-3 hover:border-gray-300 transition-colors">
      <Link to={linkTo} className="flex-1 min-w-0 no-underline text-inherit">
        <p className="font-medium text-sm text-gray-900 truncate">{name}</p>
        <div className="flex flex-wrap gap-1 mt-1">
          {lines?.map((line) => (
            <span
              key={line}
              className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold text-white"
              style={{ backgroundColor: LINE_COLORS[line] || '#666' }}
            >
              {line}
            </span>
          ))}
          {routes?.slice(0, 5).map((route) => (
            <span
              key={route}
              className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-100 text-[10px] font-medium text-blue-700"
            >
              {route}
            </span>
          ))}
          {routes && routes.length > 5 && (
            <span className="text-[10px] text-gray-400">+{routes.length - 5}</span>
          )}
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(favoriteStop);
        }}
        className="shrink-0 p-1.5 rounded-md hover:bg-gray-100 transition-colors"
        aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
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
    </div>
  );
}

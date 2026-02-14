import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavoritesContext } from '../../context/FavoritesContext';
import { useRailPredictions } from '../../hooks/useRailPredictions';
import { useBusPredictions } from '../../hooks/useBusPredictions';
import { LINE_COLORS } from '../../lib/constants';
import CountdownBadge from '../predictions/CountdownBadge';
import EmptyState from '../common/EmptyState';
import type { FavoriteStop } from '../../api/types';

function RailFavoriteCard({ fav }: { fav: FavoriteStop }) {
  const { removeFavorite } = useFavoritesContext();
  const codes = fav.meta.stationTogether1
    ? `${fav.id},${fav.meta.stationTogether1}`
    : fav.id;
  const { data: trains } = useRailPredictions(codes);
  const upcoming = trains?.slice(0, 3) ?? [];

  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <Link to={`/rail/${fav.id}`} className="no-underline text-inherit flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm text-gray-900 truncate">{fav.name}</p>
            <div className="flex gap-1 shrink-0">
              {fav.meta.lines?.map((line) => (
                <span
                  key={line}
                  className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[8px] font-bold text-white"
                  style={{ backgroundColor: LINE_COLORS[line] || '#666' }}
                >
                  {line}
                </span>
              ))}
            </div>
          </div>
        </Link>
        <button
          onClick={() => removeFavorite(fav.id)}
          className="shrink-0 p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          aria-label="Remove favorite"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {upcoming.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {upcoming.map((train, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: LINE_COLORS[train.Line] || '#666' }}
              />
              <span className="truncate max-w-[6rem]">{train.DestinationName}</span>
              <CountdownBadge value={train.Min} />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-xs text-gray-400">No upcoming trains</p>
      )}
    </>
  );
}

function BusFavoriteCard({ fav }: { fav: FavoriteStop }) {
  const { removeFavorite } = useFavoritesContext();
  const { data } = useBusPredictions(fav.id);
  const upcoming = data?.Predictions?.slice(0, 3) ?? [];

  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <Link to={`/bus/${fav.id}`} className="no-underline text-inherit flex-1 min-w-0">
          <p className="font-medium text-sm text-gray-900 truncate">{fav.name}</p>
          <p className="text-[10px] text-gray-400">Stop #{fav.id}</p>
        </Link>
        <button
          onClick={() => removeFavorite(fav.id)}
          className="shrink-0 p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          aria-label="Remove favorite"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {upcoming.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {upcoming.map((pred, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-medium">
                {pred.RouteID}
              </span>
              <span className="truncate max-w-[6rem]">{pred.DirectionText}</span>
              <CountdownBadge value={String(pred.Minutes)} />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-xs text-gray-400">No upcoming buses</p>
      )}
    </>
  );
}

export default function FavoritesList() {
  const { favorites, reorderFavorites } = useFavoritesContext();
  const dragIndex = useRef<number | null>(null);
  const [dropTarget, setDropTarget] = useState<number | null>(null);

  if (favorites.length === 0) {
    return (
      <EmptyState
        title="No favorites yet"
        description="Star stops and stations from the search page to see them here"
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {favorites.map((fav, index) => (
        <div
          key={fav.id}
          draggable
          onDragStart={(e) => {
            dragIndex.current = index;
            e.dataTransfer.effectAllowed = 'move';
            // Make the drag image slightly transparent
            if (e.currentTarget instanceof HTMLElement) {
              e.currentTarget.style.opacity = '0.5';
            }
          }}
          onDragEnd={(e) => {
            dragIndex.current = null;
            setDropTarget(null);
            if (e.currentTarget instanceof HTMLElement) {
              e.currentTarget.style.opacity = '1';
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            setDropTarget(index);
          }}
          onDragLeave={() => {
            setDropTarget(null);
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (dragIndex.current !== null && dragIndex.current !== index) {
              reorderFavorites(dragIndex.current, index);
            }
            dragIndex.current = null;
            setDropTarget(null);
          }}
          className={`bg-white rounded-lg border p-3 cursor-grab active:cursor-grabbing transition-all ${
            dropTarget === index
              ? 'border-gray-900 ring-1 ring-gray-900'
              : 'border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="shrink-0 text-gray-300 touch-none" aria-hidden>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <circle cx="5" cy="3" r="1.5" />
                <circle cx="11" cy="3" r="1.5" />
                <circle cx="5" cy="8" r="1.5" />
                <circle cx="11" cy="8" r="1.5" />
                <circle cx="5" cy="13" r="1.5" />
                <circle cx="11" cy="13" r="1.5" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              {fav.type === 'rail' ? (
                <RailFavoriteCard fav={fav} />
              ) : (
                <BusFavoriteCard fav={fav} />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

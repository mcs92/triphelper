import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, GripVertical } from 'lucide-react';
import { useFavoritesContext } from '@/context/FavoritesContext';
import { useRailPredictions } from '@/hooks/useRailPredictions';
import { useBusPredictions } from '@/hooks/useBusPredictions';
import { useBikeDock } from '@/hooks/useBikeDocks';
import { LINE_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CountdownBadge from '@/components/predictions/CountdownBadge';
import EmptyState from '@/components/common/EmptyState';
import type { FavoriteStop } from '@/api/types';

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
            <p className="font-medium text-sm text-foreground truncate">{fav.name}</p>
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeFavorite(fav.id)}
          className="shrink-0 size-7 text-muted-foreground hover:text-foreground"
          aria-label="Remove favorite"
        >
          <X className="size-4" />
        </Button>
      </div>
      {upcoming.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {upcoming.map((train, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
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
        <p className="mt-2 text-xs text-muted-foreground">No upcoming trains</p>
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
          <p className="font-medium text-sm text-foreground truncate">{fav.name}</p>
          <p className="text-[10px] text-muted-foreground">Stop #{fav.id}</p>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeFavorite(fav.id)}
          className="shrink-0 size-7 text-muted-foreground hover:text-foreground"
          aria-label="Remove favorite"
        >
          <X className="size-4" />
        </Button>
      </div>
      {upcoming.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {upcoming.map((pred, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="px-1 py-0.5 bg-secondary text-secondary-foreground rounded text-[10px] font-medium">
                {pred.RouteID}
              </span>
              <span className="truncate max-w-[6rem]">{pred.DirectionText}</span>
              <CountdownBadge value={String(pred.Minutes)} />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-xs text-muted-foreground">No upcoming buses</p>
      )}
    </>
  );
}

function BikeFavoriteCard({ fav }: { fav: FavoriteStop }) {
  const { removeFavorite } = useFavoritesContext();
  const { dock } = useBikeDock(fav.id);
  const status = dock?.status;

  const classicBikes = status ? status.num_bikes_available - status.num_ebikes_available : 0;
  const ebikes = status?.num_ebikes_available ?? 0;
  const emptyDocks = status?.num_docks_available ?? 0;

  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <Link to={`/bike/${fav.id}`} className="no-underline text-inherit flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground truncate">{fav.name}</p>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeFavorite(fav.id)}
          className="shrink-0 size-7 text-muted-foreground hover:text-foreground"
          aria-label="Remove favorite"
        >
          <X className="size-4" />
        </Button>
      </div>
      {status ? (
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span><span className="font-semibold text-foreground">{classicBikes}</span> bikes</span>
          <span><span className="font-semibold text-emerald-600">{ebikes}</span> e-bikes</span>
          <span><span className="font-semibold text-foreground">{emptyDocks}</span> docks</span>
        </div>
      ) : (
        <p className="mt-2 text-xs text-muted-foreground">Loading availability...</p>
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
        <Card
          key={fav.id}
          draggable
          onDragStart={(e) => {
            dragIndex.current = index;
            e.dataTransfer.effectAllowed = 'move';
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
          className={cn(
            "p-3 py-3 cursor-grab active:cursor-grabbing transition-all",
            dropTarget === index
              ? 'border-foreground ring-1 ring-foreground'
              : ''
          )}
        >
          <div className="flex items-center gap-2">
            <div className="shrink-0 text-muted-foreground/40 touch-none" aria-hidden>
              <GripVertical className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              {fav.type === 'rail' ? (
                <RailFavoriteCard fav={fav} />
              ) : fav.type === 'bus' ? (
                <BusFavoriteCard fav={fav} />
              ) : (
                <BikeFavoriteCard fav={fav} />
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

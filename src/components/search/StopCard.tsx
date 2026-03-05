import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useFavoritesContext } from '@/context/FavoritesContext';
import { LINE_COLORS } from '@/lib/constants';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { FavoriteStop } from '@/api/types';

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
    <Card className="flex-row items-center gap-3 p-3 py-3">
      <Link to={linkTo} className="flex-1 min-w-0 no-underline text-inherit">
        <p className="font-medium text-sm text-foreground truncate">{name}</p>
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
            <Badge key={route} variant="secondary" className="text-[10px] px-1.5 py-0.5">
              {route}
            </Badge>
          ))}
          {routes && routes.length > 5 && (
            <span className="text-[10px] text-muted-foreground">+{routes.length - 5}</span>
          )}
        </div>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(favoriteStop);
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
}

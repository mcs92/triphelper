import { useParams, Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useStations } from '@/hooks/useStations';
import { useFavoritesContext } from '@/context/FavoritesContext';
import { Button } from '@/components/ui/button';
import RailPredictions from '@/components/predictions/RailPredictions';
import { LINE_COLORS } from '@/lib/constants';

export default function RailDetailPage() {
  const { stationCode } = useParams<{ stationCode: string }>();
  const { data: stations } = useStations();
  const { isFavorite, toggleFavorite } = useFavoritesContext();

  const station = stations?.find((s) => s.Code === stationCode);
  const stationName = station?.Name ?? stationCode ?? 'Station';

  // Handle transfer stations: include both codes
  const codes = station?.StationTogether1
    ? `${station.Code},${station.StationTogether1}`
    : stationCode ?? '';

  const lines = station
    ? [station.LineCode1, station.LineCode2, station.LineCode3, station.LineCode4].filter(
        (l): l is string => !!l
      )
    : [];

  const favorited = stationCode ? isFavorite(stationCode) : false;

  return (
    <div className="flex flex-col gap-4">
      <Link to="/" className="text-sm text-muted-foreground no-underline hover:text-foreground">
        &larr; Back to search
      </Link>

      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-foreground">{stationName}</h1>
          <div className="flex gap-1.5 mt-1">
            {lines.map((line) => (
              <span
                key={line}
                className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: LINE_COLORS[line] || '#666' }}
              >
                {line}
              </span>
            ))}
          </div>
        </div>
        {stationCode && station && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              toggleFavorite({
                id: stationCode,
                type: 'rail',
                name: stationName,
                meta: { lines, stationTogether1: station.StationTogether1 || undefined },
              })
            }
          >
            <Star
              className={`size-5 ${favorited ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground/40'}`}
            />
          </Button>
        )}
      </div>

      <RailPredictions stationCodes={codes} />
    </div>
  );
}

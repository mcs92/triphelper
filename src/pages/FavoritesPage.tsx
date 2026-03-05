import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Share2 } from 'lucide-react';
import { useFavoritesContext } from '@/context/FavoritesContext';
import { useStations } from '@/hooks/useStations';
import { useBusStops } from '@/hooks/useBusStops';
import { useBikeStations } from '@/hooks/useBikeDocks';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import FavoritesList from '@/components/favorites/FavoritesList';
import type { FavoriteStop } from '@/api/types';

function parseStopsParam(param: string): { type: 'rail' | 'bus' | 'bike'; id: string }[] {
  return param
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      if (s.startsWith('r:')) return { type: 'rail' as const, id: s.slice(2) };
      if (s.startsWith('b:')) return { type: 'bus' as const, id: s.slice(2) };
      if (s.startsWith('k:')) return { type: 'bike' as const, id: s.slice(2) };
      return null;
    })
    .filter((x): x is { type: 'rail' | 'bus' | 'bike'; id: string } => x !== null);
}

function ImportBanner({
  incoming,
  onImport,
  onDismiss,
}: {
  incoming: FavoriteStop[];
  onImport: () => void;
  onDismiss: () => void;
}) {
  return (
    <Alert className="border-blue-200 bg-blue-50 text-blue-800 [&>svg]:text-blue-600">
      <AlertDescription>
        <p className="text-sm font-medium text-blue-800">
          Shared favorites ({incoming.length} stop{incoming.length === 1 ? '' : 's'})
        </p>
        <ul className="mt-1.5 space-y-0.5">
          {incoming.map((f) => (
            <li key={f.id} className="text-xs text-blue-700">
              {f.type === 'rail' ? 'Metro' : f.type === 'bus' ? 'Bus' : 'Bike'}: {f.name}
            </li>
          ))}
        </ul>
        <div className="mt-3 flex gap-2">
          <Button
            size="sm"
            onClick={onImport}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add to my favorites
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDismiss}
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            Dismiss
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}

export default function FavoritesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { favorites, importFavorites, toShareURL } = useFavoritesContext();
  const { data: stations } = useStations();
  const { data: busStops } = useBusStops();
  const { data: bikeStations } = useBikeStations();
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);

  const stopsParam = searchParams.get('stops');
  const parsed = useMemo(() => (stopsParam ? parseStopsParam(stopsParam) : []), [stopsParam]);

  // Resolve parsed IDs to full FavoriteStop objects once API data is available
  const resolved = useMemo(() => {
    if (parsed.length === 0) return [];
    const results: FavoriteStop[] = [];
    for (const { type, id } of parsed) {
      if (type === 'rail' && stations) {
        const station = stations.find((s) => s.Code === id);
        if (station) {
          results.push({
            id,
            type: 'rail',
            name: station.Name,
            meta: {
              lines: [station.LineCode1, station.LineCode2, station.LineCode3, station.LineCode4].filter(
                (l): l is string => !!l
              ),
              stationTogether1: station.StationTogether1 || undefined,
            },
          });
        }
      } else if (type === 'bus' && busStops) {
        const stop = busStops.find((s) => s.StopID === id);
        if (stop) {
          results.push({
            id,
            type: 'bus',
            name: stop.Name,
            meta: { routes: stop.Routes },
          });
        }
      } else if (type === 'bike' && bikeStations) {
        const dock = bikeStations.find((s) => s.station_id === id);
        if (dock) {
          results.push({
            id,
            type: 'bike',
            name: dock.name,
            meta: {},
          });
        }
      }
    }
    return results;
  }, [parsed, stations, busStops, bikeStations]);

  // Filter out stops already in favorites
  const newOnly = useMemo(
    () => resolved.filter((r) => !favorites.some((f) => f.id === r.id)),
    [resolved, favorites]
  );

  const showBanner = stopsParam && !dismissed && newOnly.length > 0;

  // Clear copied state after 2s
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  function handleImport() {
    importFavorites(newOnly);
    setSearchParams({}, { replace: true });
    setDismissed(true);
  }

  function handleDismiss() {
    setSearchParams({}, { replace: true });
    setDismissed(true);
  }

  function handleShare() {
    const url = toShareURL();
    navigator.clipboard.writeText(url).then(() => setCopied(true));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Favorites</h1>
        {favorites.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="size-4" />
            {copied ? 'Copied!' : 'Share'}
          </Button>
        )}
      </div>

      {showBanner && (
        <ImportBanner
          incoming={newOnly}
          onImport={handleImport}
          onDismiss={handleDismiss}
        />
      )}

      <FavoritesList />
    </div>
  );
}

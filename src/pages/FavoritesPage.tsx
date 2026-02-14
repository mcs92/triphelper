import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFavoritesContext } from '../context/FavoritesContext';
import { useStations } from '../hooks/useStations';
import { useBusStops } from '../hooks/useBusStops';
import FavoritesList from '../components/favorites/FavoritesList';
import type { FavoriteStop } from '../api/types';

function parseStopsParam(param: string): { type: 'rail' | 'bus'; id: string }[] {
  return param
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      if (s.startsWith('r:')) return { type: 'rail' as const, id: s.slice(2) };
      if (s.startsWith('b:')) return { type: 'bus' as const, id: s.slice(2) };
      return null;
    })
    .filter((x): x is { type: 'rail' | 'bus'; id: string } => x !== null);
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
    <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
      <p className="text-sm font-medium text-blue-800">
        Shared favorites ({incoming.length} stop{incoming.length === 1 ? '' : 's'})
      </p>
      <ul className="mt-1.5 space-y-0.5">
        {incoming.map((f) => (
          <li key={f.id} className="text-xs text-blue-700">
            {f.type === 'rail' ? 'Metro' : 'Bus'}: {f.name}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex gap-2">
        <button
          onClick={onImport}
          className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add to my favorites
        </button>
        <button
          onClick={onDismiss}
          className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

export default function FavoritesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { favorites, importFavorites, toShareURL } = useFavoritesContext();
  const { data: stations } = useStations();
  const { data: busStops } = useBusStops();
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
      }
    }
    return results;
  }, [parsed, stations, busStops]);

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
        <h1 className="text-xl font-bold text-gray-900">Favorites</h1>
        {favorites.length > 0 && (
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {copied ? 'Copied!' : 'Share'}
          </button>
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

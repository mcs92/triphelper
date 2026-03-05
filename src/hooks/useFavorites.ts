import { useState, useCallback, useEffect } from 'react';
import type { FavoriteStop } from '@/api/types';

const STORAGE_KEY = 'dc-transit-favorites';

function loadFavorites(): FavoriteStop[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteStop[]>(loadFavorites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = useCallback((stop: FavoriteStop) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.id === stop.id)) return prev;
      return [...prev, stop];
    });
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.some((f) => f.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (stop: FavoriteStop) => {
      if (isFavorite(stop.id)) {
        removeFavorite(stop.id);
      } else {
        addFavorite(stop);
      }
    },
    [isFavorite, addFavorite, removeFavorite]
  );

  const reorderFavorites = useCallback((fromIndex: number, toIndex: number) => {
    setFavorites((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const importFavorites = useCallback((incoming: FavoriteStop[]) => {
    setFavorites((prev) => {
      const existingIds = new Set(prev.map((f) => f.id));
      const newOnes = incoming.filter((f) => !existingIds.has(f.id));
      return newOnes.length > 0 ? [...prev, ...newOnes] : prev;
    });
  }, []);

  const toShareURL = useCallback(() => {
    const prefixMap = { rail: 'r', bus: 'b', bike: 'k' } as const;
    const encoded = favorites
      .map((f) => `${prefixMap[f.type]}:${f.id}`)
      .join(',');
    return `${window.location.origin}/favorites?stops=${encoded}`;
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite, reorderFavorites, importFavorites, toShareURL };
}

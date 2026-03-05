import { createContext, useContext } from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import type { FavoriteStop } from '@/api/types';

interface FavoritesContextValue {
  favorites: FavoriteStop[];
  addFavorite: (stop: FavoriteStop) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (stop: FavoriteStop) => void;
  reorderFavorites: (fromIndex: number, toIndex: number) => void;
  importFavorites: (incoming: FavoriteStop[]) => void;
  toShareURL: () => string;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const value = useFavorites();
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavoritesContext must be used within FavoritesProvider');
  }
  return ctx;
}

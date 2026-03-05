import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FavoritesProvider } from '@/context/FavoritesContext';
import AppShell from '@/components/layout/AppShell';
import SearchPage from '@/pages/SearchPage';
import RailDetailPage from '@/pages/RailDetailPage';
import BusDetailPage from '@/pages/BusDetailPage';
import BikeDetailPage from '@/pages/BikeDetailPage';
import FavoritesPage from '@/pages/FavoritesPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FavoritesProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<SearchPage />} />
              <Route path="/rail/:stationCode" element={<RailDetailPage />} />
              <Route path="/bus/:stopId" element={<BusDetailPage />} />
              <Route path="/bike/:stationId" element={<BikeDetailPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </QueryClientProvider>
  );
}

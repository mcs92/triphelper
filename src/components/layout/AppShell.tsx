import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';

export default function AppShell() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 pb-20 md:pb-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

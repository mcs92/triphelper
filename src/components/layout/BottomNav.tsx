import { Link, useLocation } from 'react-router-dom';
import { Search, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { to: '/', label: 'Search', icon: Search },
  { to: '/favorites', label: 'Favorites', icon: Star },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-10">
      <div className="flex">
        {tabs.map((tab) => {
          const isActive =
            tab.to === '/'
              ? location.pathname === '/' || location.pathname.startsWith('/rail') || location.pathname.startsWith('/bus') || location.pathname.startsWith('/bike')
              : location.pathname === tab.to;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={cn(
                "flex-1 flex flex-col items-center py-2 text-xs no-underline transition-colors",
                isActive ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              <Icon className="size-5" />
              <span className="mt-0.5">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

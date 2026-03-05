import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

const navItems = [
  { to: '/', label: 'Search' },
  { to: '/favorites', label: 'Favorites' },
];

export default function Header() {
  const location = useLocation();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="no-underline">
          <img src="/trip-helper-wordmark-3.svg" alt="triphelper" className="h-8" />
        </Link>
        <nav className="hidden md:flex gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                buttonVariants({
                  variant: location.pathname === item.to ? 'default' : 'ghost',
                  size: 'sm',
                }),
                'no-underline'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

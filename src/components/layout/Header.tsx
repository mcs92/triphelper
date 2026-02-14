import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Search' },
  { to: '/favorites', label: 'Favorites' },
];

export default function Header() {
  const location = useLocation();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-gray-900 no-underline">
          TR@NSIT TRACK3R
        </Link>
        <nav className="hidden md:flex gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`px-3 py-1.5 rounded-md text-sm font-medium no-underline transition-colors ${
                location.pathname === item.to
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

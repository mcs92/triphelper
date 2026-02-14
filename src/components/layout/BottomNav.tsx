import { Link, useLocation } from 'react-router-dom';

const tabs = [
  {
    to: '/',
    label: 'Search',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    to: '/favorites',
    label: 'Favorites',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="flex">
        {tabs.map((tab) => {
          const isActive =
            tab.to === '/'
              ? location.pathname === '/' || location.pathname.startsWith('/rail') || location.pathname.startsWith('/bus')
              : location.pathname === tab.to;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex-1 flex flex-col items-center py-2 text-xs no-underline transition-colors ${
                isActive ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              {tab.icon}
              <span className="mt-0.5">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

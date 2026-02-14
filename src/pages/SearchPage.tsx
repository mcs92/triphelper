import { useState } from 'react';
import SearchInput from '../components/search/SearchInput';
import StationList from '../components/search/StationList';
import BusStopList from '../components/search/BusStopList';
import { useDebounce } from '../hooks/useDebounce';

type Tab = 'rail' | 'bus';

export default function SearchPage() {
  const [tab, setTab] = useState<Tab>('rail');
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {(['rail', 'bus'] as const).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setQuery('');
            }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              tab === t
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'rail' ? 'Metro' : 'Bus'}
          </button>
        ))}
      </div>

      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder={tab === 'rail' ? 'Search Metro stations...' : 'Search bus stops...'}
      />

      {tab === 'rail' ? (
        <StationList searchQuery={debouncedQuery} />
      ) : (
        <BusStopList searchQuery={debouncedQuery} />
      )}
    </div>
  );
}

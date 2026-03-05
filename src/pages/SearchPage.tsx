import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import SearchInput from '@/components/search/SearchInput';
import StationList from '@/components/search/StationList';
import BusStopList from '@/components/search/BusStopList';
import BikeDockList from '@/components/search/BikeDockList';
import { useDebounce } from '@/hooks/useDebounce';

type Tab = 'rail' | 'bus' | 'bike';

const tabLabels: Record<Tab, string> = {
  rail: 'Metro',
  bus: 'Bus',
  bike: 'Bike',
};

const placeholders: Record<Tab, string> = {
  rail: 'Search Metro stations...',
  bus: 'Search bus stops...',
  bike: 'Search bike docks...',
};

export default function SearchPage() {
  const [tab, setTab] = useState<Tab>('rail');
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        value={tab}
        onValueChange={(v) => {
          setTab(v as Tab);
          setQuery('');
        }}
      >
        <TabsList>
          {(['rail', 'bus', 'bike'] as const).map((t) => (
            <TabsTrigger key={t} value={t}>
              {tabLabels[t]}
            </TabsTrigger>
          ))}
        </TabsList>

        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder={placeholders[tab]}
        />

        <TabsContent value="rail">
          <StationList searchQuery={debouncedQuery} />
        </TabsContent>
        <TabsContent value="bus">
          <BusStopList searchQuery={debouncedQuery} />
        </TabsContent>
        <TabsContent value="bike">
          <BikeDockList searchQuery={debouncedQuery} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

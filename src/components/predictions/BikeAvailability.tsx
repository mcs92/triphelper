import { Card, CardContent } from '@/components/ui/card';
import type { BikeDock } from '@/api/types';

interface BikeAvailabilityProps {
  dock: BikeDock;
  dataUpdatedAt: number;
}

function AvailabilityBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-lg font-bold" style={{ color }}>
          {count}
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function BikeAvailability({ dock, dataUpdatedAt }: BikeAvailabilityProps) {
  const status = dock.status;
  if (!status) {
    return (
      <Card className="py-4">
        <CardContent className="text-center text-sm text-muted-foreground">
          Status unavailable
        </CardContent>
      </Card>
    );
  }

  const classicBikes = status.num_bikes_available - status.num_ebikes_available;
  const total = dock.capacity;
  const isRenting = status.is_renting === 1;
  const isReturning = status.is_returning === 1;

  return (
    <div>
      <Card className="py-4">
        <CardContent className="flex flex-col gap-4">
          <AvailabilityBar label="Classic bikes" count={classicBikes} total={total} color="#333333" />
          <AvailabilityBar label="E-bikes" count={status.num_ebikes_available} total={total} color="#059669" />
          <AvailabilityBar label="Empty docks" count={status.num_docks_available} total={total} color="#009CDE" />

          <div className="pt-3 border-t border-border flex gap-4 text-xs text-muted-foreground">
            <span>Capacity: {total}</span>
            {!isRenting && <span className="text-destructive font-medium">Not renting</span>}
            {!isReturning && <span className="text-destructive font-medium">Not accepting returns</span>}
          </div>
        </CardContent>
      </Card>

      {dataUpdatedAt > 0 && (
        <p className="text-[11px] text-muted-foreground mt-2 text-center">
          Updated {new Date(dataUpdatedAt).toLocaleTimeString()} — refreshes every 60s
        </p>
      )}
    </div>
  );
}

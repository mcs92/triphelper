import { useBusPredictions } from '@/hooks/useBusPredictions';
import { Card, CardContent } from '@/components/ui/card';
import PredictionRow from '@/components/predictions/PredictionRow';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import EmptyState from '@/components/common/EmptyState';

interface BusPredictionsProps {
  stopId: string;
}

export default function BusPredictions({ stopId }: BusPredictionsProps) {
  const { data, isLoading, error, refetch, dataUpdatedAt } = useBusPredictions(stopId);

  if (isLoading) return <LoadingSpinner message="Loading predictions..." />;
  if (error) return <ErrorMessage message={error.message} onRetry={() => refetch()} />;

  const predictions = data?.Predictions ?? [];
  if (predictions.length === 0) return <EmptyState title="No upcoming buses" description="Check back in a few minutes" />;

  return (
    <div>
      <Card className="gap-0 py-0">
        <CardContent className="px-3 py-0 divide-y divide-border">
          {predictions.map((pred, i) => (
            <PredictionRow
              key={`${pred.RouteID}-${pred.VehicleID}-${i}`}
              route={pred.RouteID}
              destination={pred.DirectionText}
              minutes={String(pred.Minutes)}
            />
          ))}
        </CardContent>
      </Card>
      {dataUpdatedAt > 0 && (
        <p className="text-[11px] text-muted-foreground mt-2 text-center">
          Updated {new Date(dataUpdatedAt).toLocaleTimeString()} — refreshes every 15s
        </p>
      )}
    </div>
  );
}

import { useRailPredictions } from '@/hooks/useRailPredictions';
import { Card, CardContent } from '@/components/ui/card';
import PredictionRow from '@/components/predictions/PredictionRow';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import EmptyState from '@/components/common/EmptyState';

interface RailPredictionsProps {
  stationCodes: string;
}

export default function RailPredictions({ stationCodes }: RailPredictionsProps) {
  const { data: trains, isLoading, error, refetch, dataUpdatedAt } = useRailPredictions(stationCodes);

  if (isLoading) return <LoadingSpinner message="Loading predictions..." />;
  if (error) return <ErrorMessage message={error.message} onRetry={() => refetch()} />;
  if (!trains || trains.length === 0) return <EmptyState title="No upcoming trains" description="Check back in a few minutes" />;

  return (
    <div>
      <Card className="gap-0 py-0">
        <CardContent className="px-3 py-0 divide-y divide-border">
          {trains.map((train, i) => (
            <PredictionRow
              key={`${train.Line}-${train.DestinationCode}-${train.Min}-${i}`}
              line={train.Line}
              destination={train.DestinationName}
              minutes={train.Min}
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

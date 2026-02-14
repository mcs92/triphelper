import { useBusPredictions } from '../../hooks/useBusPredictions';
import PredictionRow from './PredictionRow';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import EmptyState from '../common/EmptyState';

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
      <div className="bg-white rounded-lg border border-gray-200 px-3 divide-y divide-gray-100">
        {predictions.map((pred, i) => (
          <PredictionRow
            key={`${pred.RouteID}-${pred.VehicleID}-${i}`}
            route={pred.RouteID}
            destination={pred.DirectionText}
            minutes={String(pred.Minutes)}
          />
        ))}
      </div>
      {dataUpdatedAt > 0 && (
        <p className="text-[11px] text-gray-400 mt-2 text-center">
          Updated {new Date(dataUpdatedAt).toLocaleTimeString()} — refreshes every 15s
        </p>
      )}
    </div>
  );
}

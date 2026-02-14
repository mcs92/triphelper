import { useRailPredictions } from '../../hooks/useRailPredictions';
import PredictionRow from './PredictionRow';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import EmptyState from '../common/EmptyState';

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
      <div className="bg-white rounded-lg border border-gray-200 px-3 divide-y divide-gray-100">
        {trains.map((train, i) => (
          <PredictionRow
            key={`${train.Line}-${train.DestinationCode}-${train.Min}-${i}`}
            line={train.Line}
            destination={train.DestinationName}
            minutes={train.Min}
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

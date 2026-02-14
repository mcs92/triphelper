import CountdownBadge from './CountdownBadge';
import ArrivalProgress from './ArrivalProgress';
import { LINE_COLORS } from '../../lib/constants';

interface PredictionRowProps {
  line?: string;
  route?: string;
  destination: string;
  minutes: string;
  compact?: boolean;
}

export default function PredictionRow({ line, route, destination, minutes, compact }: PredictionRowProps) {
  const trackColor = line ? (LINE_COLORS[line] || '#666') : '#009CDE';

  return (
    <div className="py-2.5 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-3">
        {line && (
          <span
            className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold text-white shrink-0"
            style={{ backgroundColor: LINE_COLORS[line] || '#666' }}
          >
            {line}
          </span>
        )}
        {route && (
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-xs font-semibold text-blue-700 shrink-0">
            {route}
          </span>
        )}
        <span className="flex-1 text-sm text-gray-700 truncate">{destination}</span>
        <CountdownBadge value={minutes} />
      </div>
      {!compact && (
        <div className="mt-1.5 px-0.5">
          <ArrivalProgress minutes={minutes} color={trackColor} />
        </div>
      )}
    </div>
  );
}

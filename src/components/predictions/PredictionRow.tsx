import { Badge } from '@/components/ui/badge';
import CountdownBadge from '@/components/predictions/CountdownBadge';
import ArrivalProgress from '@/components/predictions/ArrivalProgress';
import { LINE_COLORS } from '@/lib/constants';

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
    <div className="py-2.5">
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
          <Badge variant="secondary" className="shrink-0">
            {route}
          </Badge>
        )}
        <span className="flex-1 text-sm text-muted-foreground truncate">{destination}</span>
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

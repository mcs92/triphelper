interface ArrivalProgressProps {
  minutes: string;
  color: string;
}

function getProgress(minutes: string): number {
  if (minutes === 'ARR' || minutes === 'BRD') return 100;
  if (minutes === '---' || minutes === '') return -1;
  const n = parseInt(minutes, 10);
  if (isNaN(n)) return -1;
  if (n <= 0) return 100;
  if (n >= 15) return 5;
  return 5 + (95 * (15 - n)) / 15;
}

export default function ArrivalProgress({ minutes, color }: ArrivalProgressProps) {
  const progress = getProgress(minutes);
  const inactive = progress < 0;
  const arriving = progress === 100;

  return (
    <div className="relative h-4 w-full" aria-hidden="true">
      {/* Track background */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 rounded-full bg-gray-200" />

      {/* Filled portion */}
      {!inactive && (
        <div
          className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 rounded-full transition-[width] duration-[800ms] ease-out"
          style={{
            width: `${progress}%`,
            backgroundColor: color,
            opacity: 0.35,
          }}
        />
      )}

      {/* Station marker (right end) */}
      <div
        className="absolute top-1/2 right-0 w-1.5 h-1.5 -translate-y-1/2 -translate-x-1/2 rounded-sm"
        style={{ backgroundColor: inactive ? '#d1d5db' : color }}
      />

      {/* Vehicle dot */}
      {!inactive && (
        <div
          className={`absolute top-1/2 w-2.5 h-2.5 rounded-full transition-[left] duration-[800ms] ease-out ${arriving ? 'animate-arrival-pulse' : ''}`}
          style={{
            left: `${progress}%`,
            transform: 'translateY(-50%) translateX(-50%)',
            backgroundColor: color,
          }}
        />
      )}
    </div>
  );
}

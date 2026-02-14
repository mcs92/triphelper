interface CountdownBadgeProps {
  value: string; // "ARR", "BRD", "---", or numeric string
}

export default function CountdownBadge({ value }: CountdownBadgeProps) {
  const isArriving = value === 'ARR' || value === 'BRD';
  const isUnknown = value === '---' || value === '';

  if (isUnknown) {
    return (
      <span className="inline-flex items-center justify-center min-w-[3rem] px-2 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-400">
        ---
      </span>
    );
  }

  if (isArriving) {
    return (
      <span className="inline-flex items-center justify-center min-w-[3rem] px-2 py-1 rounded-md bg-green-100 text-xs font-bold text-green-700 animate-pulse-badge">
        {value}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center justify-center min-w-[3rem] px-2 py-1 rounded-md bg-gray-900 text-xs font-bold text-white">
      {value} min
    </span>
  );
}

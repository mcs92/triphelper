import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CountdownBadgeProps {
  value: string; // "ARR", "BRD", "---", or numeric string
}

export default function CountdownBadge({ value }: CountdownBadgeProps) {
  const isArriving = value === 'ARR' || value === 'BRD';
  const isUnknown = value === '---' || value === '';

  if (isUnknown) {
    return (
      <Badge variant="secondary" className="min-w-[3rem] justify-center text-muted-foreground">
        ---
      </Badge>
    );
  }

  if (isArriving) {
    return (
      <Badge
        className={cn(
          "min-w-[3rem] justify-center border-transparent bg-green-100 text-green-700 font-bold animate-pulse-badge",
          "hover:bg-green-100"
        )}
      >
        {value}
      </Badge>
    );
  }

  return (
    <Badge className="min-w-[3rem] justify-center font-bold">
      {value} min
    </Badge>
  );
}

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function ErrorMessage({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <Alert variant="destructive">
      <AlertCircle />
      <AlertDescription className="flex flex-col items-center gap-3">
        <p className="text-sm">{message}</p>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

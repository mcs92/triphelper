export default function ErrorMessage({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-center">
      <p className="text-sm text-red-700">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 px-4 py-1.5 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}

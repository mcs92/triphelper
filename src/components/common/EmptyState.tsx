export default function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500 font-medium">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-gray-400">{description}</p>
      )}
    </div>
  );
}

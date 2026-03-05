export default function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground font-medium">{title}</p>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground/70">{description}</p>
      )}
    </div>
  );
}

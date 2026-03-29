export function CardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-lg px-5 py-4 animate-pulse">
      <div className="h-7 w-24 bg-elevated rounded mb-2" />
      <div className="h-3 w-16 bg-elevated rounded" />
    </div>
  );
}

export function ChartSkeleton({ height = 280 }: { height?: number }) {
  return (
    <div
      className="bg-surface border border-border rounded-lg p-5 animate-pulse"
      style={{ height }}
    >
      <div className="h-4 w-32 bg-elevated rounded mb-4" />
      <div className="h-full w-full bg-elevated rounded" />
    </div>
  );
}

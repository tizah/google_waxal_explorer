export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-base">
      <span className="font-mono text-sm text-muted animate-pulse">
        Loading dataset…
      </span>
    </div>
  );
}

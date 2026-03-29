"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-base gap-4">
      <p className="font-mono text-sm text-coral">Error: {error.message}</p>
      <button
        onClick={reset}
        className="font-mono text-xs text-muted border border-border px-4 py-2 rounded hover:text-primary transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

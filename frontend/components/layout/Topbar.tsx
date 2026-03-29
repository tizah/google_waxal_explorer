"use client";

import { useDashboardStats } from "@/hooks/useMetadata";

export function Topbar({ title }: { title: string }) {
  const { data: stats } = useDashboardStats();

  return (
    <header
      style={{ borderBottom: "1px solid var(--border)" }}
      className="h-14 flex items-center justify-between px-6 bg-surface shrink-0"
    >
      <h1 className="font-mono text-sm font-semibold text-primary tracking-wide">
        {title}
      </h1>
      {stats && (
        <div className="flex items-center gap-6">
          <Pill label="samples" value={stats.total_samples.toLocaleString()} />
          <Pill label="hours"   value={stats.total_hours.toFixed(0)} />
          <Pill label="languages" value={String(stats.total_languages)} />
        </div>
      )}
    </header>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-xs text-gold font-semibold">{value}</span>
      <span className="font-sans text-xs text-muted">{label}</span>
    </div>
  );
}

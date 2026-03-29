"use client";

import { useEffect, useRef } from "react";

interface Props {
  label: string;
  value: number;
  suffix?: string;
  color?: string;   // CSS var string or hex
}

export function StatCard({ label, value, suffix = "", color = "var(--accent-gold)" }: Props) {
  const displayRef = useRef<HTMLSpanElement>(null);

  // Count-up animation on mount
  useEffect(() => {
    const el = displayRef.current;
    if (!el || value === 0) return;
    const duration = 1200;
    const step = performance.now();

    const tick = (now: number) => {
      const elapsed = now - step;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * value);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [value, suffix]);

  return (
    <div
      style={{ borderColor: "var(--border)" }}
      className="bg-surface border rounded-lg px-5 py-4 flex flex-col gap-1"
    >
      <span
        ref={displayRef}
        className="font-mono text-2xl font-semibold"
        style={{ color }}
      >
        0{suffix}
      </span>
      <span className="font-sans text-xs text-muted uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

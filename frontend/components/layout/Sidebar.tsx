"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { FAMILY_COLORS } from "@/lib/constants";

const NAV = [
  { href: "/dashboard",          label: "Overview" },
  { href: "/dashboard/explorer", label: "Explorer" },
  { href: "#",                   label: "Quality Audit", disabled: true },
  { href: "#",                   label: "S2ST Pipeline",  disabled: true },
];

export function Sidebar() {
  const path = usePathname();

  // Unique families present in the dataset
  const families = Object.entries(FAMILY_COLORS).filter(([k]) => k !== "Unknown");

  return (
    <aside
      style={{ borderRight: "1px solid var(--border)" }}
      className="w-[220px] min-h-screen bg-surface flex flex-col shrink-0"
    >
      {/* Logo */}
      <div
        style={{ borderBottom: "1px solid var(--border)" }}
        className="px-5 py-5"
      >
        <span className="font-mono text-sm font-semibold text-gold tracking-widest uppercase">
          Waxal
        </span>
        <span className="font-mono text-sm text-muted ml-1">Explorer</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-3 pt-4">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "px-3 py-2 rounded text-sm font-sans transition-colors",
              item.disabled && "pointer-events-none opacity-40",
              path === item.href
                ? "bg-elevated text-primary"
                : "text-muted hover:text-primary hover:bg-elevated"
            )}
          >
            {item.label}
            {item.disabled && (
              <span className="ml-2 text-[10px] text-muted">soon</span>
            )}
          </Link>
        ))}
      </nav>

      {/* Family legend */}
      <div
        style={{ borderTop: "1px solid var(--border)" }}
        className="mt-6 px-5 pt-4"
      >
        <p className="font-mono text-[10px] text-muted uppercase tracking-widest mb-3">
          Language Families
        </p>
        {families.map(([family, color]) => (
          <div key={family} className="flex items-center gap-2 mb-2">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-muted font-sans">{family}</span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto px-5 py-4">
        <a
          href="https://huggingface.co/datasets/google/WaxalNLP"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] text-muted hover:text-teal transition-colors"
        >
          ↗ google/WaxalNLP
        </a>
      </div>
    </aside>
  );
}

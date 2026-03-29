"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { ALL_FAMILIES, LANGUAGE_FAMILY_MAP } from "@/lib/constants";
import type { FilterState } from "@/types/waxal";

interface Props {
  filters: FilterState;
  totalResults: number;
  onFilterChange: (key: keyof FilterState, value: string | undefined) => void;
  onClear: () => void;
}

const GENDERS    = ["male", "female", "unknown"];
const AGE_GROUPS = ["adult", "elder", "child", "unknown"];
const SPLITS     = ["train", "test", "validation", "unlabeled"];

// All languages sorted alphabetically
const LANGUAGES = Object.entries(LANGUAGE_FAMILY_MAP)
  .sort(([, a], [, b]) => a.name.localeCompare(b.name))
  .map(([code, meta]) => ({ code, name: meta.name }));

export function FilterBar({ filters, totalResults, onFilterChange, onClear }: Props) {
  const [searchValue, setSearchValue] = useState(filters.q ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Sync local search input when filters.q changes externally (e.g. URL nav)
  useEffect(() => {
    setSearchValue(filters.q ?? "");
  }, [filters.q]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onFilterChange("q", value || undefined);
    }, 400);
  };

  const hasActiveFilters =
    filters.language || filters.family || filters.gender ||
    filters.age_group || filters.split || filters.q;

  return (
    <div
      className="bg-surface border border-border rounded-lg p-4"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="flex flex-wrap gap-3 items-end">

        {/* Search */}
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="font-mono text-[10px] text-muted uppercase tracking-widest">
            Search Transcripts
          </label>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="e.g. makaranta, shule…"
            className={clsx(
              "bg-elevated border border-border rounded px-3 py-1.5",
              "font-sans text-sm text-primary placeholder:text-muted",
              "focus:outline-none focus:border-gold transition-colors"
            )}
            style={{ borderColor: "var(--border)" }}
          />
        </div>

        {/* Language */}
        <FilterSelect
          label="Language"
          value={filters.language ?? ""}
          onChange={(v) => onFilterChange("language", v || undefined)}
        >
          <option value="">All languages</option>
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>{l.name}</option>
          ))}
        </FilterSelect>

        {/* Family */}
        <FilterSelect
          label="Family"
          value={filters.family ?? ""}
          onChange={(v) => onFilterChange("family", v || undefined)}
        >
          <option value="">All families</option>
          {ALL_FAMILIES.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </FilterSelect>

        {/* Gender */}
        <FilterSelect
          label="Gender"
          value={filters.gender ?? ""}
          onChange={(v) => onFilterChange("gender", v || undefined)}
        >
          <option value="">All genders</option>
          {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
        </FilterSelect>

        {/* Age Group */}
        <FilterSelect
          label="Age Group"
          value={filters.age_group ?? ""}
          onChange={(v) => onFilterChange("age_group", v || undefined)}
        >
          <option value="">All ages</option>
          {AGE_GROUPS.map((a) => <option key={a} value={a}>{a}</option>)}
        </FilterSelect>

        {/* Split */}
        <FilterSelect
          label="Split"
          value={filters.split ?? ""}
          onChange={(v) => onFilterChange("split", v || undefined)}
        >
          <option value="">All splits</option>
          {SPLITS.map((s) => <option key={s} value={s}>{s}</option>)}
        </FilterSelect>

        {/* Clear */}
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="font-mono text-xs text-muted hover:text-coral transition-colors self-end pb-1.5"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Result count */}
      <div className="mt-3 font-sans text-xs text-muted">
        {filters.q ? (
          <span>
            Showing <span className="text-gold font-semibold">{totalResults.toLocaleString()}</span> matches
            {" "}for <span className="text-primary font-mono">&quot;{filters.q}&quot;</span>
          </span>
        ) : (
          <span>
            <span className="text-primary font-semibold">{totalResults.toLocaleString()}</span> samples
          </span>
        )}
      </div>
    </div>
  );
}

function FilterSelect({
  label, value, onChange, children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-mono text-[10px] text-muted uppercase tracking-widest">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={clsx(
          "bg-elevated border border-border rounded px-3 py-1.5",
          "font-sans text-sm text-primary",
          "focus:outline-none focus:border-gold transition-colors cursor-pointer"
        )}
        style={{ borderColor: "var(--border)" }}
      >
        {children}
      </select>
    </div>
  );
}

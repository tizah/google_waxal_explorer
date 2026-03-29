"use client";

import { SampleRow } from "@/components/explorer/SampleRow";
import { useSamples } from "@/hooks/useMetadata";
import type { FilterState } from "@/types/waxal";
import clsx from "clsx";

const COLUMNS = [
  "Language", "Speaker", "Gender", "Age", "Split", "Dur.", "Transcript", "Audio",
];

interface Props {
  filters: FilterState;
  onPageChange: (page: number) => void;
}

export function SampleTable({ filters, onPageChange }: Props) {
  const { data, isLoading, isError, isFetching } = useSamples(filters);

  const totalPages = data ? Math.ceil(data.total / filters.page_size) : 0;

  return (
    <div
      className="bg-surface border border-border rounded-lg overflow-hidden"
      style={{ borderColor: "var(--border)" }}
    >
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 font-mono text-[10px] text-muted uppercase tracking-widest whitespace-nowrap bg-elevated"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={clsx(isFetching && !isLoading && "opacity-60 transition-opacity")}>
            {isLoading && (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-border animate-pulse" style={{ borderColor: "var(--border)" }}>
                  {COLUMNS.map((c) => (
                    <td key={c} className="px-4 py-3">
                      <div className="h-3 bg-elevated rounded w-16" />
                    </td>
                  ))}
                </tr>
              ))
            )}
            {isError && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-6 text-center font-sans text-sm text-coral">
                  Failed to load samples. Check backend connection.
                </td>
              </tr>
            )}
            {!isLoading && !isError && data?.results.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-6 text-center font-sans text-sm text-muted">
                  No samples match the current filters.
                </td>
              </tr>
            )}
            {!isLoading && data?.results.map((sample) => (
              <SampleRow key={sample.id} sample={sample} searchQuery={filters.q} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && totalPages > 1 && (
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <span className="font-sans text-xs text-muted">
            Page <span className="text-primary font-semibold">{filters.page}</span> of {totalPages}
          </span>
          <div className="flex gap-2">
            <PagButton
              label="Prev"
              disabled={filters.page <= 1}
              onClick={() => onPageChange(filters.page - 1)}
            />
            <PagButton
              label="Next"
              disabled={filters.page >= totalPages}
              onClick={() => onPageChange(filters.page + 1)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function PagButton({ label, disabled, onClick }: { label: string; disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "font-mono text-xs px-3 py-1.5 rounded border border-border transition-colors",
        disabled
          ? "text-muted opacity-40 cursor-not-allowed"
          : "text-muted hover:text-primary hover:border-gold"
      )}
      style={{ borderColor: "var(--border)" }}
    >
      {label}
    </button>
  );
}

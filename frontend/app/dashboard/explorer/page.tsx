"use client";

import { Suspense } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { FilterBar } from "@/components/explorer/FilterBar";
import { SampleTable } from "@/components/explorer/SampleTable";
import { useFilters } from "@/hooks/useFilters";
import { useSamples } from "@/hooks/useMetadata";

function ExplorerContent() {
  const { filters, setFilter, clearFilters } = useFilters();
  const { data } = useSamples(filters);

  return (
    <>
      <Topbar title="Sample Explorer" />
      <main className="p-6 flex flex-col gap-4 overflow-y-auto">
        <FilterBar
          filters={filters}
          totalResults={data?.total ?? 0}
          onFilterChange={setFilter}
          onClear={clearFilters}
        />
        <SampleTable
          filters={filters}
          onPageChange={(p) => setFilter("page", p)}
        />
      </main>
    </>
  );
}

export default function ExplorerPage() {
  // Suspense boundary required for useSearchParams() in App Router
  return (
    <Suspense fallback={<div className="p-6 font-mono text-sm text-muted animate-pulse">Loading explorer...</div>}>
      <ExplorerContent />
    </Suspense>
  );
}

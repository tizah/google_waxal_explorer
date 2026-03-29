"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { FilterState } from "@/types/waxal";

const DEFAULT_PAGE_SIZE = 20;

export function useFilters(): {
  filters: FilterState;
  setFilter: (key: keyof FilterState, value: string | number | undefined) => void;
  clearFilters: () => void;
} {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();

  const filters: FilterState = useMemo(() => ({
    language:  searchParams.get("language")  ?? undefined,
    family:    searchParams.get("family")    ?? undefined,
    gender:    searchParams.get("gender")    ?? undefined,
    age_group: searchParams.get("age_group") ?? undefined,
    split:     searchParams.get("split")     ?? undefined,
    q:         searchParams.get("q")         ?? undefined,
    page:      Number(searchParams.get("page") ?? 1),
    page_size: DEFAULT_PAGE_SIZE,
  }), [searchParams]);

  const setFilter = useCallback(
    (key: keyof FilterState, value: string | number | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
      // Reset to page 1 on any filter change (except explicit page navigation)
      if (key !== "page") params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const clearFilters = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  return { filters, setFilter, clearFilters };
}

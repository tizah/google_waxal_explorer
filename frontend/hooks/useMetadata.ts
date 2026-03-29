import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { FilterState } from "@/types/waxal";
import { keepPreviousData } from "@tanstack/react-query";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: api.getStats,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLanguages() {
  return useQuery({
    queryKey: ["languages"],
    queryFn: api.getLanguages,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSamples(filters: FilterState) {
  return useQuery({
    queryKey: ["samples", filters],
    queryFn: () => api.getSamples(filters),
    placeholderData: keepPreviousData,
  });
}

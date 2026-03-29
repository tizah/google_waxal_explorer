import axios from "axios";
import type {
  DashboardStats,
  PaginatedSamples,
  FilterState,
  LanguageStat,
} from "@/types/waxal";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

const client = axios.create({ baseURL: BASE });

export const api = {
  async getStats(): Promise<DashboardStats> {
    const { data } = await client.get<DashboardStats>("/api/stats");
    return data;
  },

  async getLanguages(): Promise<LanguageStat[]> {
    const { data } = await client.get<LanguageStat[]>("/api/languages");
    return data;
  },

  async getSamples(filters: FilterState): Promise<PaginatedSamples> {
    const params: Record<string, string | number> = {
      page:      filters.page,
      page_size: filters.page_size,
    };
    if (filters.language)  params.language  = filters.language;
    if (filters.family)    params.family    = filters.family;
    if (filters.gender)    params.gender    = filters.gender;
    if (filters.age_group) params.age_group = filters.age_group;
    if (filters.split)     params.split     = filters.split;
    if (filters.q)         params.q         = filters.q;

    const { data } = await client.get<PaginatedSamples>("/api/samples", { params });
    return data;
  },

  audioUrl(sampleId: string): string {
    return `${BASE}/api/audio/${sampleId}`;
  },
};

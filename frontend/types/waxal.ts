export interface SampleRecord {
  id: string;
  language: string;
  language_code: string;
  language_family: string;
  speaker_id: string;
  gender: "male" | "female" | "unknown";
  age_group: "child" | "adult" | "elder" | "unknown";
  split: "train" | "test" | "validation" | "unlabeled";
  duration_sec: number;
  transcript: string | null;
  audio_url: string;
}

export interface LanguageStat {
  language: string;
  language_code: string;
  language_family: string;
  family_color: string;
  total_samples: number;
  total_hours: number;
  gender_breakdown: Record<string, number>;
  age_breakdown: Record<string, number>;
  split_breakdown: Record<string, number>;
}

export interface DashboardStats {
  total_languages: number;
  total_samples: number;
  total_hours: number;
  gender_totals: Record<string, number>;
  language_stats: LanguageStat[];
  family_summary: Record<string, number>;
}

export interface PaginatedSamples {
  total: number;
  page: number;
  page_size: number;
  query: string | null;
  results: SampleRecord[];
}

export interface FilterState {
  language?: string;
  family?: string;
  gender?: string;
  age_group?: string;
  split?: string;
  q?: string;
  page: number;
  page_size: number;
}

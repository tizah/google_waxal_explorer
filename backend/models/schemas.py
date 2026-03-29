from pydantic import BaseModel

class SampleRecord(BaseModel):
    id: str
    language: str
    language_code: str
    language_family: str
    speaker_id: str
    gender: str          # "male" | "female" | "unknown"
    age_group: str       # "child" | "adult" | "elder" | "unknown"
    split: str           # "train" | "test" | "validation" | "unlabeled"
    duration_sec: float
    transcript: str | None
    audio_url: str

class LanguageStat(BaseModel):
    language: str
    language_code: str
    language_family: str
    family_color: str
    total_samples: int
    total_hours: float
    gender_breakdown: dict[str, int]
    age_breakdown: dict[str, int]
    split_breakdown: dict[str, int]

class DashboardStats(BaseModel):
    total_languages: int
    total_samples: int
    total_hours: float
    gender_totals: dict[str, int]
    language_stats: list[LanguageStat]
    family_summary: dict[str, int]

class PaginatedSamples(BaseModel):
    total: int
    page: int
    page_size: int
    query: str | None
    results: list[SampleRecord]

class HealthCheck(BaseModel):
    status: str
    db_ready: bool
    sample_count: int

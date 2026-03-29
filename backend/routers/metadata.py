# routers/metadata.py

from fastapi import APIRouter, Query
import aiosqlite
import os
from models.schemas import DashboardStats, PaginatedSamples, SampleRecord
from services.stats_engine import get_dashboard_stats
from constants import get_family_color

router = APIRouter(prefix="/api")
DB_PATH = os.getenv("WAXAL_DB_PATH", "./data/waxal.db")

@router.get("/stats", response_model=DashboardStats)
async def stats():
    return await get_dashboard_stats()

@router.get("/languages")
async def languages():
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("""
            SELECT language, language_code, language_family,
                   COUNT(*) as total_samples,
                   COALESCE(SUM(duration_sec)/3600, 0) as total_hours
            FROM samples
            GROUP BY language_code
            ORDER BY total_samples DESC
        """) as c:
            rows = await c.fetchall()
    return [
        {
            **dict(row),
            "family_color": get_family_color(row["language_code"]),
            "total_hours": round(row["total_hours"], 2),
        }
        for row in rows
    ]

@router.get("/samples", response_model=PaginatedSamples)
async def samples(
    language: str | None = Query(None),
    family:   str | None = Query(None),
    gender:   str | None = Query(None),
    age_group:str | None = Query(None),
    split:    str | None = Query(None),
    q:        str | None = Query(None),
    page:     int        = Query(1, ge=1),
    page_size:int        = Query(20, ge=1, le=100),
):
    offset = (page - 1) * page_size
    params: list = []

    if q:
        # FTS5 path — returns results ordered by relevance rank
        where = "samples_fts MATCH ?"
        params.append(q)
        if language:  where += " AND s.language_code = ?"; params.append(language)
        if family:    where += " AND s.language_family = ?"; params.append(family)
        if gender:    where += " AND s.gender = ?"; params.append(gender)
        if age_group: where += " AND s.age_group = ?"; params.append(age_group)
        if split:     where += " AND s.split = ?"; params.append(split)

        base_sql = f"""
            FROM samples s
            JOIN samples_fts f ON s.id = f.id
            WHERE {where}
        """
        count_sql = f"SELECT COUNT(*) {base_sql}"
        data_sql  = f"""
            SELECT s.* {base_sql}
            ORDER BY rank
            LIMIT ? OFFSET ?
        """
    else:
        # Standard indexed path
        conditions = []
        if language:  conditions.append("language_code = ?"); params.append(language)
        if family:    conditions.append("language_family = ?"); params.append(family)
        if gender:    conditions.append("gender = ?"); params.append(gender)
        if age_group: conditions.append("age_group = ?"); params.append(age_group)
        if split:     conditions.append("split = ?"); params.append(split)

        where = ("WHERE " + " AND ".join(conditions)) if conditions else ""
        base_sql  = f"FROM samples {where}"
        count_sql = f"SELECT COUNT(*) {base_sql}"
        data_sql  = f"SELECT * {base_sql} ORDER BY id LIMIT ? OFFSET ?"

    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute(count_sql, params) as c:
            total = (await c.fetchone())[0]
        async with db.execute(data_sql, params + [page_size, offset]) as c:
            rows = await c.fetchall()

    results = [
        SampleRecord(
            **{k: row[k] for k in row.keys()},
            audio_url=f"/api/audio/{row['id']}",
        )
        for row in rows
    ]

    return PaginatedSamples(
        total=total,
        page=page,
        page_size=page_size,
        query=q,
        results=results,
    )

@router.get("/samples/{sample_id}", response_model=SampleRecord)
async def sample_detail(sample_id: str):
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("SELECT * FROM samples WHERE id = ?", (sample_id,)) as c:
            row = await c.fetchone()
    if not row:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Sample not found")
    return SampleRecord(**dict(row), audio_url=f"/api/audio/{sample_id}")

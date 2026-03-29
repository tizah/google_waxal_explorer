# services/stats_engine.py
# Pure SQL aggregations — never loads all rows into Python memory

import aiosqlite
from constants import FAMILY_COLORS, get_family_color
from models.schemas import DashboardStats, LanguageStat

DB_PATH = __import__("os").getenv("WAXAL_DB_PATH", "./data/waxal.db")

async def get_dashboard_stats() -> DashboardStats:
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row

        # Totals
        async with db.execute(
            "SELECT COUNT(*) as n, COALESCE(SUM(duration_sec)/3600,0) as h FROM samples"
        ) as c:
            totals = await c.fetchone()

        # Gender totals
        gender_totals: dict[str, int] = {}
        async with db.execute(
            "SELECT gender, COUNT(*) as n FROM samples GROUP BY gender"
        ) as c:
            async for row in c:
                gender_totals[row["gender"]] = row["n"]

        # Family summary
        family_summary: dict[str, int] = {}
        async with db.execute(
            "SELECT language_family, COUNT(*) as n FROM samples GROUP BY language_family"
        ) as c:
            async for row in c:
                family_summary[row["language_family"]] = row["n"]

        # Per-language stats
        language_stats: list[LanguageStat] = []
        async with db.execute("""
            SELECT language, language_code, language_family,
                   COUNT(*) as total_samples,
                   COALESCE(SUM(duration_sec)/3600, 0) as total_hours
            FROM samples
            GROUP BY language_code
            ORDER BY total_samples DESC
        """) as c:
            rows = await c.fetchall()

        for row in rows:
            code = row["language_code"]

            # Gender breakdown for this language
            gender_bd: dict[str, int] = {}
            async with db.execute(
                "SELECT gender, COUNT(*) as n FROM samples WHERE language_code=? GROUP BY gender",
                (code,)
            ) as c2:
                async for r in c2:
                    gender_bd[r["gender"]] = r["n"]

            # Age breakdown
            age_bd: dict[str, int] = {}
            async with db.execute(
                "SELECT age_group, COUNT(*) as n FROM samples WHERE language_code=? GROUP BY age_group",
                (code,)
            ) as c2:
                async for r in c2:
                    age_bd[r["age_group"]] = r["n"]

            # Split breakdown
            split_bd: dict[str, int] = {}
            async with db.execute(
                "SELECT split, COUNT(*) as n FROM samples WHERE language_code=? GROUP BY split",
                (code,)
            ) as c2:
                async for r in c2:
                    split_bd[r["split"]] = r["n"]

            language_stats.append(LanguageStat(
                language=row["language"],
                language_code=code,
                language_family=row["language_family"],
                family_color=get_family_color(code),
                total_samples=row["total_samples"],
                total_hours=round(row["total_hours"], 2),
                gender_breakdown=gender_bd,
                age_breakdown=age_bd,
                split_breakdown=split_bd,
            ))

        return DashboardStats(
            total_languages=len(language_stats),
            total_samples=totals["n"],
            total_hours=round(totals["h"], 2),
            gender_totals=gender_totals,
            language_stats=language_stats,
            family_summary=family_summary,
        )

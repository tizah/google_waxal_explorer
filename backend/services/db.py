# services/db.py
# SQLite connection manager + schema creation

import aiosqlite
import os

DB_PATH = os.getenv("WAXAL_DB_PATH", "./data/waxal.db")

CREATE_SQL = """
CREATE TABLE IF NOT EXISTS samples (
    id              TEXT PRIMARY KEY,
    language        TEXT NOT NULL,
    language_code   TEXT NOT NULL,
    language_family TEXT NOT NULL,
    speaker_id      TEXT NOT NULL,
    gender          TEXT NOT NULL DEFAULT 'unknown',
    age_group       TEXT NOT NULL DEFAULT 'unknown',
    split           TEXT NOT NULL DEFAULT 'unlabeled',
    duration_sec    REAL NOT NULL DEFAULT 0.0,
    transcript      TEXT,
    hf_config       TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_language_code ON samples(language_code);
CREATE INDEX IF NOT EXISTS idx_gender        ON samples(gender);
CREATE INDEX IF NOT EXISTS idx_age_group     ON samples(age_group);
CREATE INDEX IF NOT EXISTS idx_split         ON samples(split);
CREATE INDEX IF NOT EXISTS idx_family        ON samples(language_family);

CREATE VIRTUAL TABLE IF NOT EXISTS samples_fts
    USING fts5(id UNINDEXED, transcript, content='samples', content_rowid='rowid');

CREATE TRIGGER IF NOT EXISTS samples_ai AFTER INSERT ON samples BEGIN
    INSERT INTO samples_fts(rowid, id, transcript)
    VALUES (new.rowid, new.id, new.transcript);
END;
"""

async def init_db():
    """Create schema if it doesn't exist."""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    async with aiosqlite.connect(DB_PATH) as db:
        await db.executescript(CREATE_SQL)
        await db.commit()

async def get_db():
    """Async context manager for a DB connection."""
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        yield db

async def is_db_populated() -> bool:
    try:
        async with aiosqlite.connect(DB_PATH) as db:
            async with db.execute("SELECT COUNT(*) FROM samples") as cur:
                row = await cur.fetchone()
                return row[0] > 0
    except Exception:
        return False

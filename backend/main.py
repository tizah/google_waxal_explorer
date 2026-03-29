# main.py

from dotenv import load_dotenv
from pathlib import Path
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio

from services.db import init_db
from services.dataset_loader import ingest_to_sqlite
from routers import metadata, audio
from models.schemas import HealthCheck
from services.db import is_db_populated

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    asyncio.create_task(ingest_to_sqlite())   # non-blocking background ingest
    yield

app = FastAPI(
    title="Waxal-Explorer API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(metadata.router)
app.include_router(audio.router)

@app.get("/health", response_model=HealthCheck)
async def health():
    import aiosqlite, os
    db_path = os.getenv("WAXAL_DB_PATH", "./data/waxal.db")
    count = 0
    try:
        async with aiosqlite.connect(db_path) as db:
            async with db.execute("SELECT COUNT(*) FROM samples") as c:
                count = (await c.fetchone())[0]
    except Exception:
        pass
    return HealthCheck(status="ok", db_ready=count > 0, sample_count=count)

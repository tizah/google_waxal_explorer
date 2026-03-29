# services/audio_cache.py
# Disk-based LRU cache for audio files fetched from HuggingFace

import os
import asyncio
import time
from pathlib import Path

CACHE_DIR    = Path(os.getenv("AUDIO_CACHE_DIR", "./data/audio_cache"))
CACHE_MAX_MB = int(os.getenv("AUDIO_CACHE_MAX_MB", "500"))

_lock = asyncio.Lock()

class AudioCacheManager:
    def __init__(self):
        CACHE_DIR.mkdir(parents=True, exist_ok=True)

    def _path(self, sample_id: str) -> Path:
        # Sanitise sample_id to prevent path traversal
        safe_id = sample_id.replace("/", "_").replace("..", "")
        return CACHE_DIR / f"{safe_id}.wav"

    def get(self, sample_id: str) -> Path | None:
        p = self._path(sample_id)
        if p.exists():
            p.touch()   # update atime for LRU tracking
            return p
        return None

    async def put(self, sample_id: str, audio_bytes: bytes) -> Path:
        async with _lock:
            p = self._path(sample_id)
            p.write_bytes(audio_bytes)
            await self._evict_if_needed()
            return p

    async def _evict_if_needed(self):
        files = sorted(CACHE_DIR.glob("*.wav"), key=lambda f: f.stat().st_atime)
        total_mb = sum(f.stat().st_size for f in files) / (1024 * 1024)
        while total_mb > CACHE_MAX_MB and files:
            oldest = files.pop(0)
            size_mb = oldest.stat().st_size / (1024 * 1024)
            oldest.unlink(missing_ok=True)
            total_mb -= size_mb

audio_cache = AudioCacheManager()

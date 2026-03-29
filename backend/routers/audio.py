# routers/audio.py

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from datasets import load_dataset
import os
from services.audio_cache import audio_cache
import aiosqlite

router = APIRouter(prefix="/api")
DB_PATH  = os.getenv("WAXAL_DB_PATH", "./data/waxal.db")
HF_TOKEN = os.getenv("HF_TOKEN")
DATASET  = os.getenv("WAXAL_DATASET_NAME", "google/WaxalNLP")

@router.get("/audio/{sample_id}")
async def stream_audio(sample_id: str):
    # 1. Cache HIT — serve from disk
    cached = audio_cache.get(sample_id)
    if cached:
        return FileResponse(
            path=cached,
            media_type="audio/wav",
            headers={
                "Cache-Control": "public, max-age=3600",
                "Accept-Ranges": "bytes",
            },
        )

    # 2. Cache MISS — fetch from HuggingFace
    # Look up the sample's split and hf_config from SQLite
    async with aiosqlite.connect(DB_PATH) as db:
        async with db.execute(
            "SELECT split, hf_config FROM samples WHERE id = ?", (sample_id,)
        ) as c:
            row = await c.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Sample not found")

    split = row[0]
    hf_config = row[1]

    if not hf_config:
        raise HTTPException(status_code=500, detail="No HF config stored for this sample")

    try:
        ds = load_dataset(
            DATASET,
            hf_config,
            split=split,
            streaming=True,
            token=HF_TOKEN,
            trust_remote_code=True,
        )

        audio_bytes: bytes | None = None
        for item in ds:
            item_id = str(item.get("id", ""))
            if item_id == sample_id:
                import io, struct, numpy as np
                audio_data = item["audio"]
                arr = np.array(audio_data["array"], dtype=np.float32)
                sr  = audio_data["sampling_rate"]
                pcm = (arr * 32767).astype(np.int16).tobytes()

                buf = io.BytesIO()
                num_samples  = len(arr)
                byte_rate    = sr * 2
                data_size    = num_samples * 2
                buf.write(b"RIFF")
                buf.write(struct.pack("<I", 36 + data_size))
                buf.write(b"WAVE")
                buf.write(b"fmt ")
                buf.write(struct.pack("<IHHIIHH", 16, 1, 1, sr, byte_rate, 2, 16))
                buf.write(b"data")
                buf.write(struct.pack("<I", data_size))
                buf.write(pcm)
                audio_bytes = buf.getvalue()
                break

        if not audio_bytes:
            raise HTTPException(status_code=404, detail="Audio not found in dataset")

        path = await audio_cache.put(sample_id, audio_bytes)
        return FileResponse(
            path=path,
            media_type="audio/wav",
            headers={
                "Cache-Control": "public, max-age=3600",
                "Accept-Ranges": "bytes",
            },
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch audio: {e}")

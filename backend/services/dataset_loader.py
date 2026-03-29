# services/dataset_loader.py
# Streams google/WaxalNLP from HuggingFace → ingests into SQLite
#
# The dataset uses per-language configs (e.g. "hau_tts", "aka_asr").
# ASR configs have: id, speaker_id, transcription, language, gender, audio
# TTS configs have: id, speaker_id, text, locale, gender, audio
#
# We remove the audio column during ingest for speed — only metadata is stored.

import os
import aiosqlite
from datasets import load_dataset
from constants import LANGUAGE_FAMILY_MAP, get_family, get_language_name

DB_PATH      = os.getenv("WAXAL_DB_PATH", "./data/waxal.db")
HF_TOKEN     = os.getenv("HF_TOKEN")
DATASET      = os.getenv("WAXAL_DATASET_NAME", "google/WaxalNLP")
INGEST_LIMIT = int(os.getenv("INGEST_LIMIT", "0"))

# All available configs in google/WaxalNLP
ALL_CONFIGS = [
    "ach_asr", "ach_tts", "aka_asr", "amh_asr", "bau_tts",
    "dag_asr", "dga_asr", "ewe_asr", "ewe_tts", "fat_tts",
    "ful_asr", "ful_tts", "hau_tts", "ibo_tts", "kik_tts",
    "kpo_asr", "lin_asr", "lug_asr", "lug_tts", "luo_tts",
    "mas_asr", "mlg_asr", "nyn_asr", "nyn_tts", "orm_asr",
    "pcm_tts", "sid_asr", "sna_asr", "tir_asr", "sog_asr",
    "swa_tts", "twi_tts", "yor_tts", "wal_asr",
]

def normalise_gender(raw: str | None) -> str:
    if not raw:
        return "unknown"
    v = raw.strip().lower()
    if v in ("male", "m"):   return "male"
    if v in ("female", "f"): return "female"
    return "unknown"

def get_transcript(row: dict, config: str) -> str | None:
    """ASR configs use 'transcription', TTS configs use 'text'."""
    if "_asr" in config:
        return row.get("transcription")
    return row.get("text")

async def ingest_to_sqlite():
    """
    Stream WaxalNLP metadata from HuggingFace and insert into SQLite.
    Iterates through all language configs (asr + tts).
    Audio column is removed for speed — only metadata + transcript stored.
    Safe to re-run: checks if DB already has rows.
    """
    from services.db import is_db_populated, init_db
    await init_db()

    if await is_db_populated():
        print("[loader] DB already populated, skipping ingest.")
        return

    print(f"[loader] Starting ingest from {DATASET} (limit={INGEST_LIMIT or 'all'})...")

    batch: list[tuple] = []
    total = 0
    seen_ids: set[str] = set()

    async with aiosqlite.connect(DB_PATH) as db:
        for config in ALL_CONFIGS:
            if INGEST_LIMIT > 0 and total >= INGEST_LIMIT:
                break

            lang_code = config.split("_")[0]  # e.g. "hau" from "hau_tts"
            lang_name = get_language_name(lang_code)
            lang_family = get_family(lang_code)

            # Try each split
            for split_name in ["train", "validation", "test"]:
                if INGEST_LIMIT > 0 and total >= INGEST_LIMIT:
                    break

                try:
                    ds = load_dataset(
                        DATASET,
                        config,
                        split=split_name,
                        streaming=True,
                        token=HF_TOKEN,
                        trust_remote_code=True,
                    )
                    # Remove audio column to avoid downloading audio bytes
                    ds = ds.remove_columns(["audio"])
                except Exception as e:
                    print(f"[loader] Skipping {config}/{split_name}: {e}")
                    continue

                try:
                    for i, row in enumerate(ds):
                        if INGEST_LIMIT > 0 and total >= INGEST_LIMIT:
                            break

                        sample_id = str(row.get("id", f"{lang_code}_{split_name}_{i:06d}"))

                        # Skip duplicates (same id may appear in asr + tts configs)
                        if sample_id in seen_ids:
                            continue
                        seen_ids.add(sample_id)

                        transcript = get_transcript(row, config)

                        record = (
                            sample_id,
                            lang_name,
                            lang_code,
                            lang_family,
                            str(row.get("speaker_id", "unknown")),
                            normalise_gender(row.get("gender")),
                            "unknown",  # no age_group in WaxalNLP
                            split_name,
                            0.0,  # duration computed on audio fetch
                            transcript,
                            config,  # store HF config for audio fetching
                        )
                        batch.append(record)
                        total += 1

                        if len(batch) >= 500:
                            await db.executemany(
                                """INSERT OR IGNORE INTO samples
                                   (id, language, language_code, language_family, speaker_id,
                                    gender, age_group, split, duration_sec, transcript, hf_config)
                                   VALUES (?,?,?,?,?,?,?,?,?,?,?)""",
                                batch,
                            )
                            await db.commit()
                            print(f"[loader] Inserted {total} rows ({config}/{split_name})...")
                            batch.clear()
                except Exception as e:
                    print(f"[loader] Error streaming {config}/{split_name}: {e}")
                    continue

        # Flush remaining
        if batch:
            await db.executemany(
                """INSERT OR IGNORE INTO samples
                   (id, language, language_code, language_family, speaker_id,
                    gender, age_group, split, duration_sec, transcript, hf_config)
                   VALUES (?,?,?,?,?,?,?,?,?,?,?)""",
                batch,
            )
            await db.commit()

        # Rebuild FTS index
        print("[loader] Rebuilding FTS5 index...")
        await db.execute("INSERT INTO samples_fts(samples_fts) VALUES('rebuild')")
        await db.commit()

    print(f"[loader] Ingest complete. Total rows: {total}")

# constants.py

from typing import TypedDict

class LangMeta(TypedDict):
    name: str
    family: str
    subfamily: str

# All WaxalNLP languages
# Keys are ISO 639-3 codes as used in the google/WaxalNLP HuggingFace dataset configs
LANGUAGE_FAMILY_MAP: dict[str, LangMeta] = {
    # --- Original 19 from spec ---
    "hau": {"name": "Hausa",       "family": "Afro-Asiatic",  "subfamily": "Chadic"},
    "yor": {"name": "Yoruba",      "family": "Niger-Congo",   "subfamily": "Volta-Niger"},
    "ibo": {"name": "Igbo",        "family": "Niger-Congo",   "subfamily": "Volta-Niger"},
    "swa": {"name": "Swahili",     "family": "Niger-Congo",   "subfamily": "Bantu"},
    "lug": {"name": "Luganda",     "family": "Niger-Congo",   "subfamily": "Bantu"},
    "wol": {"name": "Wolof",       "family": "Niger-Congo",   "subfamily": "Senegambian"},
    "aka": {"name": "Akan",        "family": "Niger-Congo",   "subfamily": "Kwa"},
    "amh": {"name": "Amharic",     "family": "Afro-Asiatic",  "subfamily": "Semitic"},
    "orm": {"name": "Oromo",       "family": "Afro-Asiatic",  "subfamily": "Cushitic"},
    "som": {"name": "Somali",      "family": "Afro-Asiatic",  "subfamily": "Cushitic"},
    "lin": {"name": "Lingala",     "family": "Niger-Congo",   "subfamily": "Bantu"},
    "kin": {"name": "Kinyarwanda", "family": "Niger-Congo",   "subfamily": "Bantu"},
    "twi": {"name": "Twi",         "family": "Niger-Congo",   "subfamily": "Kwa"},
    "nso": {"name": "Sesotho",     "family": "Niger-Congo",   "subfamily": "Bantu"},
    "sid": {"name": "Sidama",      "family": "Afro-Asiatic",  "subfamily": "Cushitic"},
    "ikp": {"name": "Ikposo",      "family": "Niger-Congo",   "subfamily": "Kwa"},
    "dyu": {"name": "Dyula",       "family": "Niger-Congo",   "subfamily": "Mande"},
    "bam": {"name": "Bambara",     "family": "Niger-Congo",   "subfamily": "Mande"},
    "ful": {"name": "Fula",        "family": "Niger-Congo",   "subfamily": "Senegambian"},
    # --- Additional languages found in google/WaxalNLP ---
    "ach": {"name": "Acholi",      "family": "Nilo-Saharan",  "subfamily": "Western Nilotic"},
    "bau": {"name": "Baulé",       "family": "Niger-Congo",   "subfamily": "Kwa"},
    "dag": {"name": "Dagbani",     "family": "Niger-Congo",   "subfamily": "Gur"},
    "dga": {"name": "Dagaare",     "family": "Niger-Congo",   "subfamily": "Gur"},
    "ewe": {"name": "Ewe",         "family": "Niger-Congo",   "subfamily": "Kwa"},
    "fat": {"name": "Fante",       "family": "Niger-Congo",   "subfamily": "Kwa"},
    "kik": {"name": "Kikuyu",      "family": "Niger-Congo",   "subfamily": "Bantu"},
    "kpo": {"name": "Ikposo",      "family": "Niger-Congo",   "subfamily": "Kwa"},
    "luo": {"name": "Dholuo",      "family": "Nilo-Saharan",  "subfamily": "Western Nilotic"},
    "mas": {"name": "Maasai",      "family": "Nilo-Saharan",  "subfamily": "Eastern Nilotic"},
    "mlg": {"name": "Malagasy",    "family": "Austronesian",  "subfamily": "Barito"},
    "nyn": {"name": "Nyankore",    "family": "Niger-Congo",   "subfamily": "Bantu"},
    "pcm": {"name": "Naija",       "family": "English Creole", "subfamily": "Atlantic"},
    "sna": {"name": "Shona",       "family": "Niger-Congo",   "subfamily": "Bantu"},
    "sog": {"name": "Soga",        "family": "Niger-Congo",   "subfamily": "Bantu"},
    "tir": {"name": "Tigrinya",    "family": "Afro-Asiatic",  "subfamily": "Semitic"},
    "wal": {"name": "Wolaytta",    "family": "Afro-Asiatic",  "subfamily": "Omotic"},
}

FAMILY_COLORS: dict[str, str] = {
    "Niger-Congo":    "#e6a817",
    "Afro-Asiatic":   "#2dd4bf",
    "Nilo-Saharan":   "#f87171",
    "Khoisan":        "#a78bfa",
    "Austronesian":   "#60a5fa",
    "English Creole": "#fb923c",
    "Unknown":        "#8b949e",
}

def get_family(code: str) -> str:
    return LANGUAGE_FAMILY_MAP.get(code, {}).get("family", "Unknown")

def get_family_color(code: str) -> str:
    return FAMILY_COLORS.get(get_family(code), FAMILY_COLORS["Unknown"])

def get_language_name(code: str) -> str:
    return LANGUAGE_FAMILY_MAP.get(code, {}).get("name", code.upper())

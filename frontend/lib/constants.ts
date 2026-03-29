export interface LangMeta {
  name: string;
  family: string;
  subfamily: string;
}

// Mirror of backend/constants.py — must stay in sync
export const LANGUAGE_FAMILY_MAP: Record<string, LangMeta> = {
  hau: { name: "Hausa",       family: "Afro-Asiatic",  subfamily: "Chadic" },
  yor: { name: "Yoruba",      family: "Niger-Congo",   subfamily: "Volta-Niger" },
  ibo: { name: "Igbo",        family: "Niger-Congo",   subfamily: "Volta-Niger" },
  swa: { name: "Swahili",     family: "Niger-Congo",   subfamily: "Bantu" },
  lug: { name: "Luganda",     family: "Niger-Congo",   subfamily: "Bantu" },
  wol: { name: "Wolof",       family: "Niger-Congo",   subfamily: "Senegambian" },
  aka: { name: "Akan",        family: "Niger-Congo",   subfamily: "Kwa" },
  amh: { name: "Amharic",     family: "Afro-Asiatic",  subfamily: "Semitic" },
  orm: { name: "Oromo",       family: "Afro-Asiatic",  subfamily: "Cushitic" },
  som: { name: "Somali",      family: "Afro-Asiatic",  subfamily: "Cushitic" },
  lin: { name: "Lingala",     family: "Niger-Congo",   subfamily: "Bantu" },
  kin: { name: "Kinyarwanda", family: "Niger-Congo",   subfamily: "Bantu" },
  twi: { name: "Twi",         family: "Niger-Congo",   subfamily: "Kwa" },
  nso: { name: "Sesotho",     family: "Niger-Congo",   subfamily: "Bantu" },
  sid: { name: "Sidama",      family: "Afro-Asiatic",  subfamily: "Cushitic" },
  ikp: { name: "Ikposo",      family: "Niger-Congo",   subfamily: "Kwa" },
  dyu: { name: "Dyula",       family: "Niger-Congo",   subfamily: "Mande" },
  bam: { name: "Bambara",     family: "Niger-Congo",   subfamily: "Mande" },
  ful: { name: "Fula",        family: "Niger-Congo",   subfamily: "Senegambian" },
};

export const FAMILY_COLORS: Record<string, string> = {
  "Niger-Congo":  "var(--accent-gold)",
  "Afro-Asiatic": "var(--accent-teal)",
  "Nilo-Saharan": "var(--accent-coral)",
  "Unknown":      "var(--text-muted)",
};

// Hex values for Recharts (which doesn't accept CSS vars)
export const FAMILY_COLORS_HEX: Record<string, string> = {
  "Niger-Congo":  "#e6a817",
  "Afro-Asiatic": "#2dd4bf",
  "Nilo-Saharan": "#f87171",
  "Unknown":      "#8b949e",
};

export function getFamilyColor(languageCode: string): string {
  const family = LANGUAGE_FAMILY_MAP[languageCode]?.family ?? "Unknown";
  return FAMILY_COLORS[family] ?? FAMILY_COLORS["Unknown"];
}

export function getFamilyColorHex(languageCode: string): string {
  const family = LANGUAGE_FAMILY_MAP[languageCode]?.family ?? "Unknown";
  return FAMILY_COLORS_HEX[family] ?? FAMILY_COLORS_HEX["Unknown"];
}

export const ALL_FAMILIES = Object.keys(FAMILY_COLORS).filter(f => f !== "Unknown");

export const SPLIT_COLORS: Record<string, string> = {
  train:      "#e6a817",
  test:       "#2dd4bf",
  validation: "#a78bfa",
  unlabeled:  "#8b949e",
};

export const GENDER_COLORS: Record<string, string> = {
  male:    "#2dd4bf",
  female:  "#f87171",
  unknown: "#8b949e",
};

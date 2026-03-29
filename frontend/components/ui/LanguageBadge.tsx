import { getFamilyColor } from "@/lib/constants";

interface Props {
  language: string;
  languageCode: string;
}

export function LanguageBadge({ language, languageCode }: Props) {
  const color = getFamilyColor(languageCode);
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold"
      style={{
        backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
        color,
        border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
      }}
    >
      {language}
    </span>
  );
}

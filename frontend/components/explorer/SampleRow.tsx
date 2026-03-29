import { LanguageBadge } from "@/components/ui/LanguageBadge";
import { AudioPlayer } from "@/components/explorer/AudioPlayer";
import type { SampleRecord } from "@/types/waxal";

interface Props {
  sample: SampleRecord;
  searchQuery?: string;
}

// Wrap matching keyword in a highlight span
function highlightMatch(text: string, query: string | undefined): React.ReactNode {
  if (!query || !text) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  return parts.map((p, i) =>
    regex.test(p) ? (
      <mark
        key={i}
        style={{ background: "color-mix(in srgb, var(--accent-gold) 25%, transparent)", color: "var(--accent-gold)" }}
        className="rounded-sm"
      >
        {p}
      </mark>
    ) : p
  );
}

const SPLIT_COLORS: Record<string, string> = {
  train:      "var(--accent-gold)",
  test:       "var(--accent-teal)",
  validation: "var(--accent-violet)",
  unlabeled:  "var(--text-muted)",
};

export function SampleRow({ sample, searchQuery }: Props) {
  const transcript = sample.transcript ?? "\u2014";
  const truncated  = transcript.length > 80 ? transcript.slice(0, 80) + "\u2026" : transcript;

  return (
    <tr
      className="border-b border-border hover:bg-elevated transition-colors"
      style={{ borderColor: "var(--border)" }}
    >
      {/* Language */}
      <td className="px-4 py-3 whitespace-nowrap">
        <LanguageBadge language={sample.language} languageCode={sample.language_code} />
      </td>

      {/* Speaker */}
      <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-muted">
        {sample.speaker_id}
      </td>

      {/* Gender */}
      <td className="px-4 py-3 whitespace-nowrap font-sans text-xs text-muted capitalize">
        {sample.gender}
      </td>

      {/* Age */}
      <td className="px-4 py-3 whitespace-nowrap font-sans text-xs text-muted capitalize">
        {sample.age_group}
      </td>

      {/* Split */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span
          className="font-mono text-[10px] font-semibold uppercase"
          style={{ color: SPLIT_COLORS[sample.split] ?? "var(--text-muted)" }}
        >
          {sample.split}
        </span>
      </td>

      {/* Duration */}
      <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-muted">
        {sample.duration_sec.toFixed(1)}s
      </td>

      {/* Transcript */}
      <td className="px-4 py-3 font-sans text-xs text-muted max-w-[220px]" title={transcript}>
        {highlightMatch(truncated, searchQuery)}
      </td>

      {/* Audio */}
      <td className="px-4 py-3 min-w-[200px] max-w-[260px]">
        <AudioPlayer sampleId={sample.id} durationSec={sample.duration_sec} />
      </td>
    </tr>
  );
}

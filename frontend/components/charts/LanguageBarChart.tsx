"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  Cell, ResponsiveContainer,
} from "recharts";
import { getFamilyColorHex } from "@/lib/constants";
import type { LanguageStat } from "@/types/waxal";

interface Props {
  data: LanguageStat[];
  onLanguageClick?: (code: string) => void;
}

interface TooltipPayload {
  payload?: LanguageStat & { total_hours: number };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload!;
  return (
    <div
      className="bg-elevated border border-border rounded p-3 text-xs font-sans"
      style={{ borderColor: "var(--border)" }}
    >
      <p className="font-mono font-semibold text-primary mb-1">{d.language}</p>
      <p className="text-muted">Family: <span className="text-primary">{d.language_family}</span></p>
      <p className="text-muted">Hours:  <span className="text-gold">{d.total_hours.toFixed(1)}h</span></p>
      <p className="text-muted">Samples:<span className="text-primary ml-1">{d.total_samples.toLocaleString()}</span></p>
    </div>
  );
}

export function LanguageBarChart({ data, onLanguageClick }: Props) {
  const sorted = [...data].sort((a, b) => b.total_hours - a.total_hours);

  return (
    <div
      className="bg-surface border border-border rounded-lg p-5"
      style={{ borderColor: "var(--border)" }}
    >
      <h2 className="font-mono text-xs text-muted uppercase tracking-widest mb-4">
        Hours by Language
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={sorted}
          layout="vertical"
          margin={{ top: 0, right: 16, bottom: 0, left: 8 }}
          barSize={10}
        >
          <XAxis
            type="number"
            tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "IBM Plex Mono" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="language"
            width={80}
            tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "DM Sans" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--bg-elevated)" }} />
          <Bar
            dataKey="total_hours"
            radius={[0, 3, 3, 0]}
            cursor="pointer"
            onClick={(d) => onLanguageClick?.((d as unknown as LanguageStat).language_code)}
          >
            {sorted.map((entry) => (
              <Cell
                key={entry.language_code}
                fill={entry.family_color || getFamilyColorHex(entry.language_code)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

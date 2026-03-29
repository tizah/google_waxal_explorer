"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  Legend, ResponsiveContainer,
} from "recharts";
import type { LanguageStat } from "@/types/waxal";

const AGE_COLORS: Record<string, string> = {
  adult:   "#e6a817",
  elder:   "#2dd4bf",
  child:   "#a78bfa",
  unknown: "#8b949e",
};

interface Props { data: LanguageStat[] }

export function AgeDistributionChart({ data }: Props) {
  const chartData = data.map((l) => ({
    language: l.language,
    ...l.age_breakdown,
  }));

  const keys = ["adult", "elder", "child", "unknown"];

  return (
    <div
      className="bg-surface border border-border rounded-lg p-5"
      style={{ borderColor: "var(--border)" }}
    >
      <h2 className="font-mono text-xs text-muted uppercase tracking-widest mb-4">
        Age Distribution by Language
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 16, bottom: 0, left: 8 }}
          barSize={8}
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
          <Tooltip
            contentStyle={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              fontSize: 12,
              fontFamily: "DM Sans",
              color: "var(--text-primary)",
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, fontFamily: "DM Sans", color: "var(--text-muted)" }}
          />
          {keys.map((k) => (
            <Bar key={k} dataKey={k} stackId="a" fill={AGE_COLORS[k]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

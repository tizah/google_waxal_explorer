"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  Legend, ResponsiveContainer,
} from "recharts";
import { SPLIT_COLORS } from "@/lib/constants";
import type { LanguageStat } from "@/types/waxal";

interface Props { data: LanguageStat[] }

const SPLITS = ["train", "test", "validation", "unlabeled"];

export function SplitBreakdownChart({ data }: Props) {
  const chartData = data.map((l) => ({
    language: l.language,
    ...l.split_breakdown,
  }));

  return (
    <div
      className="bg-surface border border-border rounded-lg p-5"
      style={{ borderColor: "var(--border)" }}
    >
      <h2 className="font-mono text-xs text-muted uppercase tracking-widest mb-4">
        Split Breakdown by Language
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
              color: "var(--text-primary)",
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, fontFamily: "DM Sans", color: "var(--text-muted)" }}
          />
          {SPLITS.map((s) => (
            <Bar key={s} dataKey={s} stackId="a" fill={SPLIT_COLORS[s]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

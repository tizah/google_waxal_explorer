"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { GENDER_COLORS } from "@/lib/constants";

interface Props {
  data: Record<string, number>;
}

export function GenderDonutChart({ data }: Props) {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));
  const total = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <div
      className="bg-surface border border-border rounded-lg p-5"
      style={{ borderColor: "var(--border)" }}
    >
      <h2 className="font-mono text-xs text-muted uppercase tracking-widest mb-4">
        Gender Distribution
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry) => (
              <Cell
                key={entry.name}
                fill={GENDER_COLORS[entry.name] ?? "#8b949e"}
              />
            ))}
          </Pie>
          {/* Centre label */}
          <text
            x="50%"
            y="43%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--text-primary)"
            fontSize={20}
            fontFamily="IBM Plex Mono"
            fontWeight={600}
          >
            {total.toLocaleString()}
          </text>
          <text
            x="50%"
            y="52%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--text-muted)"
            fontSize={10}
            fontFamily="DM Sans"
          >
            speakers
          </text>
          <Tooltip
            contentStyle={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              fontSize: 12,
              fontFamily: "DM Sans",
              color: "var(--text-primary)",
            }}
            formatter={(v) => [Number(v).toLocaleString(), ""]}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, fontFamily: "DM Sans", color: "var(--text-muted)" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

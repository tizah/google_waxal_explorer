"use client";

import { useDashboardStats } from "@/hooks/useMetadata";
import { StatCard } from "@/components/ui/StatCard";
import { CardSkeleton, ChartSkeleton } from "@/components/ui/LoadingSkeleton";
import { LanguageBarChart } from "@/components/charts/LanguageBarChart";
import { GenderDonutChart } from "@/components/charts/GenderDonutChart";
import { AgeDistributionChart } from "@/components/charts/AgeDistributionChart";
import { SplitBreakdownChart } from "@/components/charts/SplitBreakdownChart";
import { useRouter } from "next/navigation";

export function DashboardOverview() {
  const { data: stats, isLoading, isError } = useDashboardStats();
  const router = useRouter();

  if (isError) {
    return (
      <p className="font-mono text-sm text-coral">
        Failed to load stats. Is the backend running?
      </p>
    );
  }

  const handleLanguageClick = (code: string) => {
    router.push(`/dashboard/explorer?language=${code}`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <StatCard label="Total Samples" value={stats!.total_samples} />
            <StatCard
              label="Total Hours"
              value={Math.round(stats!.total_hours)}
              suffix="h"
              color="var(--accent-teal)"
            />
            <StatCard
              label="Languages"
              value={stats!.total_languages}
              color="var(--accent-coral)"
            />
            <StatCard
              label="Speakers"
              value={Object.values(stats!.gender_totals).reduce((a, b) => a + b, 0)}
              color="var(--accent-violet)"
            />
          </>
        )}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {isLoading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            <LanguageBarChart
              data={stats!.language_stats}
              onLanguageClick={handleLanguageClick}
            />
            <GenderDonutChart data={stats!.gender_totals} />
          </>
        )}
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {isLoading ? (
          <>
            <ChartSkeleton />
            <ChartSkeleton />
          </>
        ) : (
          <>
            <AgeDistributionChart data={stats!.language_stats} />
            <SplitBreakdownChart  data={stats!.language_stats} />
          </>
        )}
      </div>
    </div>
  );
}

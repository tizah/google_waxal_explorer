import { Topbar } from "@/components/layout/Topbar";
import { DashboardOverview } from "@/components/DashboardOverview";

export default function DashboardPage() {
  return (
    <>
      <Topbar title="Overview" />
      <main className="p-6 overflow-y-auto">
        <DashboardOverview />
      </main>
    </>
  );
}

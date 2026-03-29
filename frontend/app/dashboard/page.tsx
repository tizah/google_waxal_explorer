import { Topbar } from "@/components/layout/Topbar";

export default function DashboardPage() {
  return (
    <>
      <Topbar title="Overview" />
      <main className="p-6">
        <p className="font-mono text-sm text-muted">
          Phase 3 will render charts here.
        </p>
      </main>
    </>
  );
}

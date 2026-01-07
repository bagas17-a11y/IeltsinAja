import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProgressOverview } from "@/components/dashboard/ProgressOverview";

export default function StatsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-light">Performance Stats</h1>
          <p className="text-muted-foreground text-sm">
            Track your progress and get AI-powered recommendations
          </p>
        </div>
        <ProgressOverview />
      </div>
    </DashboardLayout>
  );
}

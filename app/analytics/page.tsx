import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { ExperimentHistory } from "@/components/analytics/experiment-history"
import { DataExport } from "@/components/analytics/data-export"

export default function AnalyticsPage() {
  return (
    <div className="container py-6 md:py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Analyze your experiment data and track your progress over time.
          </p>
        </div>

        <div className="grid gap-6">
          <AnalyticsDashboard />
          <ExperimentHistory />
          <DataExport />
        </div>
      </div>
    </div>
  )
}
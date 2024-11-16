import '@/app/globals.css'
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { ExperimentHistory } from "@/components/analytics/experiment-history"
import { DataExport } from "@/components/analytics/data-export"

export default function AnalyticsPage() {
  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Analyze your experiment data and track your progress over time.
        </p>
      </div>

      {/* Analytics Overview */}
      <div className="space-y-4 sm:space-y-6">
        <AnalyticsDashboard />
      </div>

      {/* Experiment History */}
      <div className="space-y-4 sm:space-y-6">
        <ExperimentHistory />
      </div>

      {/* Data Export */}
      <div className="space-y-4 sm:space-y-6">
        <DataExport />
      </div>
    </div>
  )
}
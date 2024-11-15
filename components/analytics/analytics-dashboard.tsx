"use client"

import { useEffect } from "react"
import { useExperiments } from "@/hooks/use-experiments"
import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label
} from "recharts"

export function AnalyticsDashboard() {
  const { experiments, stats, loadStats, loadExperiments } = useExperiments()

  useEffect(() => {
    loadStats()
    loadExperiments()
  }, [loadStats, loadExperiments])

  // Tambahkan null check dan default values
  const chartData = experiments.map(exp => ({
    timestamp: exp.timestamp || new Date(),
    angle: exp.parameters?.angle || 0,
    duration: exp.duration || 0
  }))

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Analytics Overview</h2>
          <p className="text-sm text-muted-foreground">
            Summary of your experiment data and trends
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total Experiments</h3>
            <p className="text-2xl font-bold">{stats?.totalExperiments || 0}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Avg Duration</h3>
            <p className="text-2xl font-bold">{Math.round(stats?.avgDuration || 0)}s</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Avg Angle</h3>
            <p className="text-2xl font-bold">{(stats?.avgAngle || 0).toFixed(1)}°</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total Time</h3>
            <p className="text-2xl font-bold">{Math.round((stats?.totalTime || 0) / 60)}min</p>
          </Card>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleDateString()} 
              />
              <YAxis>
                <Label value="Angle (degrees)" angle={-90} position="insideLeft" />
              </YAxis>
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value) => [`${value}°`, 'Angle']}
              />
              <Line 
                type="monotone" 
                dataKey="angle" 
                stroke="#8884d8"
                name="Initial Angle" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}
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

  const chartData = experiments.map(exp => ({
    timestamp: exp.timestamp || new Date(),
    angle: exp.parameters?.angle || 0,
    duration: exp.duration || 0
  }))

  return (
    <Card className="p-2 xs:p-3 sm:p-4 md:p-6">
      <div className="space-y-3 sm:space-y-4">
        <div className="space-y-1 sm:space-y-2">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight">Analytics Overview</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Summary of your experiment data and trends
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
          <Card className="p-2.5 sm:p-3 md:p-4">
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Total Experiments</h3>
            <p className="text-base sm:text-lg md:text-2xl font-bold mt-1">{stats?.totalExperiments || 0}</p>
          </Card>
          <Card className="p-2.5 sm:p-3 md:p-4">
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Avg Duration</h3>
            <p className="text-base sm:text-lg md:text-2xl font-bold mt-1">{Math.round(stats?.avgDuration || 0)}s</p>
          </Card>
          <Card className="p-2.5 sm:p-3 md:p-4">
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Avg Angle</h3>
            <p className="text-base sm:text-lg md:text-2xl font-bold mt-1">{(stats?.avgAngle || 0).toFixed(1)}°</p>
          </Card>
          <Card className="p-2.5 sm:p-3 md:p-4">
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Total Time</h3>
            <p className="text-base sm:text-lg md:text-2xl font-bold mt-1">{Math.round((stats?.totalTime || 0) / 60)}min</p>
          </Card>
        </div>

        <div className="h-[300px] sm:h-[350px] md:h-[400px] mt-4 sm:mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={chartData}
              margin={{ 
                top: 5,
                right: 5,
                left: 5,
                bottom: 5 
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
                tick={{ fontSize: 12 }}
                tickMargin={8}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickMargin={8}
              >
                <Label 
                  value="Angle (degrees)" 
                  angle={-90} 
                  position="insideLeft"
                  style={{ fontSize: '12px' }}
                />
              </YAxis>
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value) => [`${value}°`, 'Angle']}
                contentStyle={{ fontSize: '12px' }}
              />
              <Line 
                type="monotone" 
                dataKey="angle" 
                stroke="#8884d8"
                name="Initial Angle"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}
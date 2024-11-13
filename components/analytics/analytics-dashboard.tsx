"use client"

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

// Sample historical data - in a real app, this would come from a database
const experimentData = {
  id: "exp-123",
  date: "2024-03-20",
  duration: "00:02:30",
  parameters: {
    length: 1.0,
    mass: 0.5,
    initialAngle: 45,
  },
  measurements: Array.from({ length: 100 }, (_, i) => ({
    time: i * 0.016,
    angle: 45 * Math.cos(2 * Math.PI * i / 60),
    energy: 10 * (1 - Math.cos(2 * Math.PI * i / 60)),
  }))
}

export function AnalyticsDashboard() {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Experiment Analysis</h2>
          <p className="text-sm text-muted-foreground">
            Detailed analysis of experiment #{experimentData.id}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Length</h3>
            <p className="text-2xl font-bold">{experimentData.parameters.length}m</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Mass</h3>
            <p className="text-2xl font-bold">{experimentData.parameters.mass}kg</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Initial Angle</h3>
            <p className="text-2xl font-bold">{experimentData.parameters.initialAngle}°</p>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Angular Displacement</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={experimentData.measurements} margin={{ top: 20, right: 30, left: 50, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time"
                  type="number"
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => value.toFixed(1)}
                >
                  <Label value="Time (s)" position="bottom" offset={0} />
                </XAxis>
                <YAxis
                  type="number"
                  domain={[-90, 90]}
                  tickFormatter={(value) => `${value}°`}
                >
                  <Label value="Angle (degrees)" angle={-90} position="left" offset={0} />
                </YAxis>
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(2)}°`, 'Angle']}
                  labelFormatter={(time) => `Time: ${Number(time).toFixed(2)}s`}
                />
                <Line 
                  type="monotone" 
                  dataKey="angle" 
                  stroke="hsl(var(--primary))" 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Energy Analysis</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={experimentData.measurements} margin={{ top: 20, right: 30, left: 50, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time"
                  type="number"
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => value.toFixed(1)}
                >
                  <Label value="Time (s)" position="bottom" offset={0} />
                </XAxis>
                <YAxis
                  type="number"
                  domain={[0, 'auto']}
                  tickFormatter={(value) => `${value.toFixed(1)}J`}
                >
                  <Label value="Energy (Joules)" angle={-90} position="left" offset={0} />
                </YAxis>
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(2)}J`, 'Energy']}
                  labelFormatter={(time) => `Time: ${Number(time).toFixed(2)}s`}
                />
                <Line 
                  type="monotone" 
                  dataKey="energy" 
                  stroke="hsl(var(--primary))" 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Max Angular Velocity</h3>
            <p className="text-2xl font-bold">2.34 rad/s</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Period</h3>
            <p className="text-2xl font-bold">2.01s</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground">Energy Loss</h3>
            <p className="text-2xl font-bold">4.2%</p>
          </Card>
        </div>
      </div>
    </Card>
  )
}
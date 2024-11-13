"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { usePendulum } from "@/hooks/use-pendulum"

export function SimulationData() {
  const { length, angle } = usePendulum()

  const period = 2 * Math.PI * Math.sqrt(length / 9.81)
  const frequency = 1 / period

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Real-time Data</CardTitle>
          <CardDescription>Current measurements and calculations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium">Period (T)</p>
            <p className="text-2xl font-bold">{period.toFixed(2)} s</p>
          </div>
          <div>
            <p className="text-sm font-medium">Frequency (f)</p>
            <p className="text-2xl font-bold">{frequency.toFixed(2)} Hz</p>
          </div>
          <div>
            <p className="text-sm font-medium">Angular Displacement</p>
            <p className="text-2xl font-bold">
              {(angle * (180 / Math.PI)).toFixed(1)}°
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
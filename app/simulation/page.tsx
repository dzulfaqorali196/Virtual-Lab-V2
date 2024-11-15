"use client"

import '@/app/globals.css'
import { SimulationCanvas } from "@/components/simulation/simulation-canvas"
import { SimulationControls } from "@/components/simulation/simulation-controls"
import { SimulationData } from "@/components/simulation/simulation-data"

export default function SimulationPage() {
  return (
    <div className="container py-6 md:py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pendulum Simulation</h1>
          <p className="text-muted-foreground mt-2">
            Experiment with a mathematical pendulum and observe its behavior in real-time.
          </p>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <SimulationCanvas />
            <SimulationControls />
          </div>
          <div>
            <SimulationData />
          </div>
        </div>
      </div>
    </div>
  )
}
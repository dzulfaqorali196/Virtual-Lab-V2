"use client"

import { useState, useEffect, Suspense } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Box, Square } from "lucide-react"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import { useUserPreferences } from "@/hooks/use-user-preferences"

const PendulumCanvas2D = dynamic(
  () => import("./pendulum-canvas-2d").then(mod => mod.PendulumCanvas2D),
  { ssr: false }
)

const PendulumCanvas3D = dynamic(
  () => import("./pendulum-canvas-3d").then(mod => mod.PendulumCanvas3D),
  { ssr: false }
)

export function SimulationCanvas() {
  const { data: session } = useSession()
  const { view3D, setPreference } = useUserPreferences()
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d")

  useEffect(() => {
    if (view3D !== undefined) {
      setViewMode(view3D ? "3d" : "2d")
    }
  }, [view3D])

  const handleViewModeChange = async (mode: "2d" | "3d") => {
    setViewMode(mode)
    if (session?.user) {
      await setPreference("view3D", mode === "3d")
    }
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex justify-end space-x-2">
          <Button
            variant={viewMode === "2d" ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewModeChange("2d")}
          >
            <Square className="h-4 w-4 mr-2" />
            2D View
          </Button>
          <Button
            variant={viewMode === "3d" ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewModeChange("3d")}
          >
            <Box className="h-4 w-4 mr-2" />
            3D View
          </Button>
        </div>
        
        <Suspense fallback={<div>Loading...</div>}>
          {viewMode === "2d" ? <PendulumCanvas2D /> : <PendulumCanvas3D />}
        </Suspense>
      </div>
    </Card>
  )
}
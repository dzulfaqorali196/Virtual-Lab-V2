"use client"

import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { PlayCircle, PauseCircle, RotateCcw, Save } from "lucide-react"
import { usePendulum } from "@/hooks/use-pendulum"
import { useUserPreferences } from "@/hooks/use-user-preferences"
import { useExperiments } from "@/hooks/use-experiments"
import { useSession } from "next-auth/react"

export function SimulationControls() {
  const { data: session } = useSession()
  const { 
    length,
    mass,
    angle,
    isRunning,
    updateLength, 
    updateMass, 
    updateAngle,
    toggleSimulation,
    resetSimulation,
  } = usePendulum()

  const {
    defaultLength,
    defaultMass,
    defaultAngle,
    setPreference,
    loadPreferences,
  } = useUserPreferences()

  const { saveExperiment } = useExperiments()

  // Load user preferences when component mounts
  useEffect(() => {
    if (session?.user) {
      loadPreferences()
    }
  }, [session, loadPreferences])

  // Apply loaded preferences
  useEffect(() => {
    if (defaultLength) updateLength(defaultLength)
    if (defaultMass) updateMass(defaultMass)
    if (defaultAngle) updateAngle(defaultAngle * (Math.PI / 180))
  }, [defaultLength, defaultMass, defaultAngle, updateLength, updateMass, updateAngle])

  const handleSaveExperiment = async () => {
    if (!session?.user) return

    await saveExperiment({
      timestamp: Date.now(),
      length,
      mass,
      angle,
      duration: 0, // You would calculate this based on actual experiment duration
      measurements: [] // You would include actual measurements here
    })
  }

  const handleLengthChange = async (value: number) => {
    updateLength(value)
    if (session?.user) {
      await setPreference("defaultLength", value)
    }
  }

  const handleMassChange = async (value: number) => {
    updateMass(value)
    if (session?.user) {
      await setPreference("defaultMass", value)
    }
  }

  const handleAngleChange = async (value: number) => {
    updateAngle(value * (Math.PI / 180))
    if (session?.user) {
      await setPreference("defaultAngle", value)
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>String Length (m)</Label>
            <Slider
              value={[length]}
              onValueChange={([value]) => handleLengthChange(value)}
              min={0.1}
              max={2}
              step={0.1}
            />
            <p className="text-sm text-muted-foreground">{length.toFixed(1)} m</p>
          </div>

          <div className="space-y-2">
            <Label>Mass (kg)</Label>
            <Slider
              value={[mass]}
              onValueChange={([value]) => handleMassChange(value)}
              min={0.1}
              max={2}
              step={0.1}
            />
            <p className="text-sm text-muted-foreground">{mass.toFixed(1)} kg</p>
          </div>

          <div className="space-y-2">
            <Label>Initial Angle (degrees)</Label>
            <Slider
              value={[angle * (180 / Math.PI)]}
              onValueChange={([value]) => handleAngleChange(value)}
              min={-90}
              max={90}
              step={1}
            />
            <p className="text-sm text-muted-foreground">{(angle * (180 / Math.PI)).toFixed(1)}°</p>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button
            onClick={toggleSimulation}
            className="flex-1"
          >
            {isRunning ? (
              <>
                <PauseCircle className="mr-2 h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <PlayCircle className="mr-2 h-4 w-4" />
                Start
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={resetSimulation}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          {session?.user && (
            <Button
              variant="outline"
              onClick={handleSaveExperiment}
            >
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
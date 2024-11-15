"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { PlayCircle, PauseCircle, RotateCcw, Save, CheckCircle } from "lucide-react"
import { usePendulum } from "@/hooks/use-pendulum"
import { useSession } from "next-auth/react"
import { useUserPreferences } from "@/hooks/use-user-preferences"
import { useExperiments } from "@/hooks/use-experiments"
import { toast } from 'sonner'

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

  const { preferences, setPreferences, isLoading, loadPreferences } = useUserPreferences()
  const { saveExperiment } = useExperiments()

  const [duration, setDuration] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [initialAngle, setInitialAngle] = useState(angle)
  
  // Timer effect untuk menghitung durasi
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isRunning && !isCompleted) {
      timer = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isRunning, isCompleted])

  // Tambahkan fungsi untuk menandai eksperimen selesai
  const handleComplete = () => {
    if (isRunning) {
      toggleSimulation() // Pause simulasi
    }
    setIsCompleted(true)
  }

  // Load preferences saat mount
  useEffect(() => {
    async function initializeState() {
      if (session?.user) {
        try {
          const prefs = await loadPreferences()
          if (prefs?.simulationSettings) {
            updateLength(prefs.simulationSettings.length)
            updateMass(prefs.simulationSettings.mass)
            updateAngle(prefs.simulationSettings.angle * (Math.PI / 180))
            setInitialAngle(prefs.simulationSettings.angle * (Math.PI / 180))
          }
        } catch (error) {
          console.error('Error loading preferences:', error)
        }
      }
    }
    initializeState()
  }, [])

  const handleChange = async (value: number, type: 'length' | 'mass' | 'angle') => {
    // Update local state
    switch(type) {
      case 'length':
        updateLength(value)
        break
      case 'mass':
        updateMass(value)
        break
      case 'angle':
        updateAngle(value * (Math.PI / 180))
        setInitialAngle(value * (Math.PI / 180))
        break
    }

    // Update database
    if (session?.user) {
      const newSettings = {
        ...preferences.simulationSettings,
        [type]: value
      }
      
      await setPreferences({
        simulationSettings: newSettings
      })
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes} menit ${remainingSeconds} detik`
  }

  const handleReset = async () => {
    resetSimulation()
    setDuration(0)
    setIsCompleted(false)
    setInitialAngle(angle)
    await setPreferences({
      simulationSettings: {
        length: 1.7,
        mass: 0.5,
        angle: 45
      }
    })
  }

  const handleSaveExperiment = async () => {
    if (!session?.user) {
      toast.error("Please login to save experiments")
      return
    }
    
    try {
      if (isRunning) {
        toast.error("Please complete the simulation before saving")
        return
      }

      if (!isCompleted) {
        toast.error("Please complete the experiment before saving")
        return
      }

      if (!length || !mass || !initialAngle) {
        toast.error("Invalid experiment parameters")
        return
      }

      const experimentData = {
        userId: session.user.email as string,
        title: `Experiment ${new Date().toLocaleString()}`,
        description: `Length: ${length}m, Mass: ${mass}kg, Initial Angle: ${initialAngle * (180 / Math.PI)}°`,
        timestamp: new Date(),
        parameters: {
          length,
          mass, 
          angle: initialAngle * (180 / Math.PI)
        },
        duration: duration,
        measurements: []
      }
      
      await saveExperiment(experimentData)
      toast.success('Experiment saved successfully!')
      // Reset states setelah save
      setDuration(0)
      setIsCompleted(false)

    } catch (error) {
      console.error('Error saving experiment:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save experiment')
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
              onValueChange={([value]) => handleChange(value, 'length')}
              min={0.1}
              max={2}
              step={0.1}
              disabled={isLoading || isRunning}
            />
            <p className="text-sm text-muted-foreground">{length.toFixed(2)} m</p>
          </div>

          <div className="space-y-2">
            <Label>Mass (kg)</Label>
            <Slider
              value={[mass]}
              onValueChange={([value]) => handleChange(value, 'mass')}
              min={0.1}
              max={2}
              step={0.1}
              disabled={isLoading || isRunning}
            />
            <p className="text-sm text-muted-foreground">{mass.toFixed(2)} kg</p>
          </div>

          <div className="space-y-2">
            <Label>Initial Angle (degrees)</Label>
            <Slider
              value={[angle * (180 / Math.PI)]}
              onValueChange={([value]) => handleChange(value, 'angle')}
              min={-90}
              max={90}
              step={1}
              disabled={isLoading || isRunning}
            />
            <p className="text-sm text-muted-foreground">
              Initial: {(initialAngle * (180 / Math.PI)).toFixed(1)}° | Current: {(angle * (180 / Math.PI)).toFixed(1)}°
            </p>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Duration: {formatDuration(duration)}
        </div>
        <div className="flex justify-between space-x-2">
          <Button
            onClick={toggleSimulation}
            disabled={isLoading || isCompleted}
          >
            {isRunning ? (
              <>
                <PauseCircle className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <PlayCircle className="w-4 h-4 mr-2" />
                Start
              </>
            )}
          </Button>

          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={handleComplete}
              disabled={isLoading || !session?.user || isCompleted}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete
            </Button>

            <Button
              variant="outline"
              onClick={handleSaveExperiment}
              disabled={isLoading || !session?.user || !isCompleted}
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isLoading}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
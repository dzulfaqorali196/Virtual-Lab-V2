import { create } from "zustand"

// Define measurement type
interface Measurement {
  time: number
  angle: number
  energy: number
}

interface PendulumState {
  length: number
  mass: number
  angle: number
  angularVelocity: number
  isRunning: boolean
  experimentStartTime: number | null
  experimentDuration: number
  measurements: Measurement[] // Add measurements array
  initialAngle: number
}

interface PendulumStore extends PendulumState {
  updateLength: (length: number) => void
  updateMass: (mass: number) => void
  updateAngle: (angle: number) => void
  toggleSimulation: () => void
  resetSimulation: () => void
  tick: () => void
}

const GRAVITY = 9.81
const DAMPING = 0.999
const TIME_STEP = 0.016

const initialState = {
  length: 1,
  mass: 1,
  angle: Math.PI / 4,
  angularVelocity: 0,
  isRunning: false,
  experimentStartTime: null,
  experimentDuration: 0,
  measurements: [], // Initialize empty measurements
  initialAngle: Math.PI / 4,
}

export const usePendulum = create<PendulumStore>((set) => ({
  ...initialState,

  updateLength: (length) => set({ length }),
  updateMass: (mass) => set({ mass }),
  updateAngle: (angle) => set({ 
    angle, 
    initialAngle: angle,
    angularVelocity: 0,
    measurements: []
  }),

  toggleSimulation: () => {
    set((state) => {
      const isRunning = !state.isRunning
      const now = Date.now()
      
      // Handle start/stop of simulation
      if (isRunning) {
        // Start new experiment
        const animate = () => {
          const state = usePendulum.getState()
          if (state.isRunning) {
            state.tick()
            requestAnimationFrame(animate)
          }
        }
        requestAnimationFrame(animate)
        
        return {
          isRunning,
          experimentStartTime: now,
          experimentDuration: 0,
          measurements: [] // Reset measurements on start
        }
      } else {
        // Stop experiment and calculate duration
        const duration = (now - (state.experimentStartTime || now)) / 1000
        return {
          isRunning,
          experimentStartTime: null,
          experimentDuration: duration
        }
      }
    })
  },

  resetSimulation: () => set(initialState),

  tick: () => set((state) => {
    // Calculate new pendulum state
    const angularAcceleration = -(GRAVITY / state.length) * Math.sin(state.angle)
    const newAngularVelocity = (state.angularVelocity + angularAcceleration * TIME_STEP) * DAMPING
    const newAngle = state.angle + newAngularVelocity * TIME_STEP

    // Calculate energy
    const height = state.length * (1 - Math.cos(state.angle))
    const potentialEnergy = state.mass * GRAVITY * height
    const kineticEnergy = 0.5 * state.mass * Math.pow(state.angularVelocity * state.length, 2)
    const totalEnergy = potentialEnergy + kineticEnergy

    // Create new measurement
    const currentTime = (Date.now() - (state.experimentStartTime || Date.now())) / 1000
    const measurement: Measurement = {
      time: currentTime,
      angle: newAngle,
      energy: totalEnergy
    }

    // Add to measurements array (keeping last N measurements to prevent memory issues)
    const MAX_MEASUREMENTS = 1000
    const measurements = [...state.measurements, measurement]
      .slice(-MAX_MEASUREMENTS)

    return {
      angle: newAngle,
      angularVelocity: newAngularVelocity,
      measurements
    }
  })
}))
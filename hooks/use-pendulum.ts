"use client"

import { create } from "zustand"

interface PendulumState {
  length: number
  mass: number
  angle: number
  angularVelocity: number
  isRunning: boolean
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
const TIME_STEP = 0.016 // ~60fps

const initialState = {
  length: 1,
  mass: 1,
  angle: Math.PI / 4,
  angularVelocity: 0,
  isRunning: false,
}

export const usePendulum = create<PendulumStore>()((set) => ({
  ...initialState,

  updateLength: (length) => set({ length }),
  updateMass: (mass) => set({ mass }),
  updateAngle: (angle) => set({ angle, angularVelocity: 0 }),
  
  toggleSimulation: () => {
    set((state) => {
      const isRunning = !state.isRunning
      if (isRunning) {
        const animate = () => {
          const state = usePendulum.getState()
          if (state.isRunning) {
            state.tick()
            requestAnimationFrame(animate)
          }
        }
        requestAnimationFrame(animate)
      }
      return { isRunning }
    })
  },

  resetSimulation: () => set(initialState),

  tick: () => set((state) => {
    const angularAcceleration = -(GRAVITY / state.length) * Math.sin(state.angle)
    const newAngularVelocity = (state.angularVelocity + angularAcceleration * TIME_STEP) * DAMPING
    const newAngle = state.angle + newAngularVelocity * TIME_STEP

    return {
      angle: newAngle,
      angularVelocity: newAngularVelocity
    }
  })
}))
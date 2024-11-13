"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { toast } from "sonner"

export interface ExperimentData {
  id?: string
  timestamp: number
  length: number
  mass: number
  angle: number
  duration: number
  measurements: Array<{
    time: number
    angle: number
    energy: number
  }>
}

interface ExperimentsState {
  experiments: ExperimentData[]
  currentExperiment: ExperimentData | null
  isLoading: boolean
  error: string | null
  loadExperiments: () => Promise<void>
  saveExperiment: (data: Omit<ExperimentData, 'id'>) => Promise<void>
  setCurrentExperiment: (experiment: ExperimentData | null) => void
}

export const useExperiments = create<ExperimentsState>((set) => ({
  experiments: [],
  currentExperiment: null,
  isLoading: false,
  error: null,

  loadExperiments: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch("/api/user/experiments");
      
      if (!response.ok) throw new Error("Failed to load experiments");

      const experiments = await response.json();
      set({ experiments, isLoading: false, error: null });
    } catch (error) {
      set({ isLoading: false, error: (error as Error).message });
      toast.error("Failed to load experiments");
    }
  },

  saveExperiment: async (data) => {
    try {
      set({ isLoading: true });
      const response = await fetch("/api/user/experiments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save experiment");

      const newExperiment = await response.json();
      set(state => ({
        experiments: [...state.experiments, newExperiment],
        currentExperiment: newExperiment,
        isLoading: false,
        error: null
      }));
      toast.success("Experiment saved successfully");
    } catch (error) {
      set({ isLoading: false, error: (error as Error).message });
      toast.error("Failed to save experiment");
    }
  },

  setCurrentExperiment: (experiment) => {
    set({ currentExperiment: experiment });
  },
}))
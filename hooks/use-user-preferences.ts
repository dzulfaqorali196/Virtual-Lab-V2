"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

interface UserPreferences {
  theme?: string
  defaultLength?: number
  defaultMass?: number
  defaultAngle?: number
  view3D?: boolean
}

interface PreferencesState extends UserPreferences {
  isLoading: boolean
  error: string | null
  setPreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => Promise<void>
  loadPreferences: () => Promise<void>
}

export const useUserPreferences = create<PreferencesState>((set) => ({
  theme: "system",
  defaultLength: 1.0,
  defaultMass: 0.5,
  defaultAngle: 45,
  view3D: false,
  isLoading: false,
  error: null,

  setPreference: async (key, value) => {
    try {
      set({ isLoading: true });
      const response = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value }),
      });

      if (!response.ok) throw new Error("Failed to update preference");

      const updatedPreferences = await response.json();
      set({ ...updatedPreferences, isLoading: false, error: null });
      toast.success("Preferences updated");
    } catch (error) {
      set({ isLoading: false, error: (error as Error).message });
      toast.error("Failed to update preferences");
    }
  },

  loadPreferences: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch("/api/user/preferences");
      
      if (!response.ok) throw new Error("Failed to load preferences");

      const preferences = await response.json();
      set({ ...preferences, isLoading: false, error: null });
    } catch (error) {
      set({ isLoading: false, error: (error as Error).message });
      toast.error("Failed to load preferences");
    }
  },
}))
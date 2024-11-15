import { create } from 'zustand'
import { toast } from 'sonner'
import { UserPreferences } from '@/types/user'

interface PreferencesStore {
  preferences: UserPreferences
  isLoading: boolean
  error: string | null
  view3D: boolean
  fetchPreferences: () => Promise<void>
  setPreferences: (updates: Partial<UserPreferences>) => Promise<void>
  setPreference: (key: keyof UserPreferences, value: any) => Promise<void>
  loadPreferences: () => Promise<UserPreferences>
  resetPreferences: () => void
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  view3D: false,
  notifications: {
    email: true,
    push: true
  },
  experimentSettings: {
    autoSave: true,
    showTips: true
  },
  simulationSettings: {
    length: 1.7,
    mass: 0.5,
    angle: 45,
    isCustom: false
  }
}

export const useUserPreferences = create<PreferencesStore>((set, get) => ({
  preferences: defaultPreferences,
  isLoading: false,
  error: null,
  view3D: false,

  fetchPreferences: async () => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch('/api/user/preferences')
      
      if (!response.ok) {
        throw new Error('Failed to fetch preferences')
      }

      const data = await response.json()
      set({ 
        preferences: { ...defaultPreferences, ...data },
        view3D: data.view3D || false,
        isLoading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch preferences',
        isLoading: false 
      })
      toast.error('Failed to load preferences')
    }
  },

  setPreferences: async (updates) => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        throw new Error('Failed to update preferences')
      }

      const updatedPreferences = await response.json()
      set({ 
        preferences: { ...get().preferences, ...updatedPreferences },
        view3D: updatedPreferences.view3D || false,
        isLoading: false 
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update preferences',
        isLoading: false 
      })
      toast.error('Failed to update preferences')
    }
  },

  setPreference: async (key, value) => {
    try {
      const updates = { [key]: value }
      await get().setPreferences(updates)
    } catch (error) {
      console.error('Failed to set preference:', error)
      throw error
    }
  },

  loadPreferences: async () => {
    await get().fetchPreferences()
    return get().preferences
  },

  resetPreferences: () => {
    set({ 
      preferences: defaultPreferences,
      view3D: false,
      isLoading: false,
      error: null 
    })
  }
})) 
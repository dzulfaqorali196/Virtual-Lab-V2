'use client'

import { create } from 'zustand'
import { UserProfile, ProfileUpdateData, UserStats } from '@/types/user'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

interface ValidationError {
  message: string;
  validationErrors?: string[];
}

interface ProfileState {
  profile: UserProfile | null;
  stats: UserStats | null;
  isLoading: boolean;
  error: string | null;
  lastUpdate: number | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  resetProfile: () => void;
  setError: (error: string | null) => void;
}

export const useUserProfile = create<ProfileState>((set, get) => ({
  profile: null,
  stats: null,
  isLoading: false,
  error: null,
  lastUpdate: null,

  fetchProfile: async () => {
    const currentState = get()
    // Prevent multiple simultaneous fetches
    if (currentState.isLoading) return

    // Cache control - only fetch if data is stale (5 minutes)
    const now = Date.now()
    if (currentState.lastUpdate && now - currentState.lastUpdate < 300000) {
      return
    }

    try {
      set({ isLoading: true, error: null })
      const response = await fetch('/api/user/profile', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch profile')
      }

      const data = await response.json()
      
      if (!data || !data.profile) {
        throw new Error('Invalid profile data')
      }

      set({ 
        profile: data.profile,
        stats: data.profile?.stats || null,
        isLoading: false,
        lastUpdate: now
      })

    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch profile',
        isLoading: false 
      })
      throw error
    }
  },

  updateProfile: async (data: ProfileUpdateData) => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        // Handle validation errors
        if ('validationErrors' in result) {
          const validationError = result as ValidationError
          throw new Error(validationError.message || validationError.validationErrors?.join('. '))
        }
        throw new Error(result.error || 'Failed to update profile')
      }

      set({ 
        profile: result.profile,
        stats: result.profile?.stats || null,
        isLoading: false,
        lastUpdate: Date.now()
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile'
      set({
        error: errorMessage,
        isLoading: false
      })
      throw error // Re-throw untuk handling di komponen
    }
  },

  resetProfile: () => {
    set({ 
      profile: null,
      stats: null,
      isLoading: false, 
      error: null,
      lastUpdate: null
    })
  },

  setError: (error: string | null) => set({ error })
}));

// Hook untuk auto sync dengan session
export function useProfileSync() {
  const { data: session, status } = useSession()
  const resetProfile = useUserProfile(state => state.resetProfile)
  const fetchProfile = useUserProfile(state => state.fetchProfile)

  useEffect(() => {
    let mounted = true
    let retryTimeout: NodeJS.Timeout

    async function syncProfile() {
      if (status === 'loading') return

      if (session?.user && mounted) {
        try {
          await fetchProfile()
        } catch (error) {
          // Retry fetch after 5 seconds on error
          retryTimeout = setTimeout(() => {
            if (mounted) syncProfile()
          }, 5000)
        }
      } else if (!session?.user && mounted) {
        resetProfile()
      }
    }

    syncProfile()

    return () => {
      mounted = false
      if (retryTimeout) clearTimeout(retryTimeout)
    }
  }, [session, status, fetchProfile, resetProfile])
}
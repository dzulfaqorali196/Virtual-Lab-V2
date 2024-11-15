import { create } from 'zustand'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

interface LearningProgress {
  completedSections: string[]
  quizScores: {
    [key: string]: number
  }
}

interface LearningProgressState {
  completedSections: string[]
  quizScores: { [key: string]: number }
  isLoading: boolean
  error: string | null
  loadProgress: () => Promise<void>
  setProgress: (lessonId: string, sectionId: string, score: number) => Promise<void>
  resetProgress: () => void
}

export const useLearningProgress = create<LearningProgressState>((set, get) => ({
  completedSections: [],
  quizScores: {},
  isLoading: false,
  error: null,

  loadProgress: async () => {
    try {
      set({ isLoading: true, error: null })
      const response = await fetch('/api/auth/user/learning-progress')
      
      if (!response.ok) {
        throw new Error('Gagal memuat progress pembelajaran')
      }

      const data = await response.json()
      set({ 
        completedSections: data.completedSections || [],
        quizScores: data.quizScores || {},
        isLoading: false
      })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Gagal memuat progress',
        isLoading: false 
      })
      toast.error('Gagal memuat progress pembelajaran')
    }
  },

  setProgress: async (lessonId: string, sectionId: string, score: number) => {
    const sectionKey = `${lessonId}-${sectionId}`
    try {
      set({ isLoading: true, error: null })
      const response = await fetch('/api/auth/user/learning-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionId: sectionKey,
          score
        })
      })

      if (!response.ok) {
        throw new Error('Gagal menyimpan progress')
      }

      const data = await response.json()
      set(state => ({
        completedSections: [...state.completedSections, sectionKey],
        quizScores: { ...state.quizScores, [sectionKey]: score },
        isLoading: false
      }))
      toast.success('Progress berhasil disimpan')
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Gagal menyimpan progress',
        isLoading: false 
      })
      toast.error('Gagal menyimpan progress pembelajaran')
    }
  },

  resetProgress: () => {
    set({
      completedSections: [],
      quizScores: {},
      isLoading: false,
      error: null
    })
  }
})) 
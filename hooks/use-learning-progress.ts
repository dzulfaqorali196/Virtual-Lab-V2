import { create } from 'zustand'

interface LearningProgress {
  completedSections: string[]
  quizScores: { [key: string]: number }
  isLoading: boolean
  setProgress: (lessonId: string, sectionId: string, score: number) => Promise<void>
  loadProgress: () => Promise<void>
}

export const useLearningProgress = create<LearningProgress>((set) => ({
  completedSections: [],
  quizScores: {},
  isLoading: false,

  setProgress: async (lessonId: string, sectionId: string, score: number) => {
    try {
      const sectionKey = `${lessonId}-${sectionId}`
      
      const response = await fetch('/api/learning/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionKey,
          score
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save progress')
      }

      set((state) => ({
        completedSections: [...state.completedSections, sectionKey],
        quizScores: {
          ...state.quizScores,
          [sectionKey]: score
        }
      }))
    } catch (error) {
      console.error('Failed to save progress:', error)
    }
  },

  loadProgress: async () => {
    try {
      set({ isLoading: true })
      const response = await fetch('/api/learning/progress')
      
      if (!response.ok) {
        throw new Error('Failed to load progress')
      }

      const data = await response.json()
      set({
        completedSections: data.completedSections || [],
        quizScores: data.quizScores || {},
        isLoading: false
      })
    } catch (error) {
      console.error('Failed to load progress:', error)
      set({ isLoading: false })
    }
  }
})) 
"use client"

import { create } from "zustand"
import { toast } from "sonner"

interface Progress {
  completedSections: string[]
  quizScores: Record<string, number>
}

interface LearningState extends Progress {
  isLoading: boolean
  error: string | null
  setProgress: (lessonId: string, sectionId: string, score: number) => Promise<void>
  loadProgress: () => Promise<void>
}

export const useLearningProgress = create<LearningState>((set, get) => ({
  completedSections: [],
  quizScores: {},
  isLoading: false,
  error: null,

  setProgress: async (lessonId: string, sectionId: string, score: number) => {
    try {
      set({ isLoading: true });
      const sectionKey = `${lessonId}-${sectionId}`;
      
      const response = await fetch("/api/user/learning-progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completedSections: [...get().completedSections, sectionKey],
          quizScores: {
            ...get().quizScores,
            [sectionKey]: score
          }
        })
      });

      if (!response.ok) throw new Error("Failed to save progress");

      const data = await response.json();
      set({
        completedSections: data.completedSections,
        quizScores: data.quizScores,
        isLoading: false,
        error: null
      });
      
      toast.success("Progress saved");
    } catch (error) {
      set({ 
        isLoading: false,
        error: (error as Error).message 
      });
      toast.error("Failed to save progress");
    }
  },

  loadProgress: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch("/api/user/learning-progress");
      
      if (!response.ok) throw new Error("Failed to load progress");

      const data = await response.json();
      set({ 
        completedSections: data.completedSections || [],
        quizScores: data.quizScores || {},
        isLoading: false,
        error: null 
      });
    } catch (error) {
      set({ 
        isLoading: false,
        error: (error as Error).message 
      });
      toast.error("Failed to load progress");
    }
  }
}))
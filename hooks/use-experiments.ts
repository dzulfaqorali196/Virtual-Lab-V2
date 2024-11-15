import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Experiment, ExperimentStats } from '@/types/experiment'
import Papa from 'papaparse'
import { formatDuration } from '@/lib/utils'
import { toast } from 'sonner'

interface ExperimentsState {
  experiments: Experiment[]
  currentExperiment: Partial<Experiment> | null
  stats: ExperimentStats | null
  isLoading: boolean
  error: string | null
  
  saveExperiment: (data: Partial<Experiment>) => Promise<void>
  loadExperiments: () => Promise<void>
  loadStats: () => Promise<void>
  exportData: (options: ExportOptions) => Promise<void>
  setCurrentExperiment: (experiment: Partial<Experiment> | null) => void
  resetState: () => void
  deleteExperiment: (id: string) => Promise<void>
}

interface ExportOptions {
  timeRange: string
  dataPoints: string
  format: "csv" | "json"
}

// Tambahkan interface untuk format data
interface ExperimentExportData {
  Date: string
  'Length (m)': number
  'Mass (kg)': number
  'Initial Angle (°)': string
  Duration: string
}

interface ExperimentSummaryData {
  'Total Experiments': number
  'Average Duration (s)': string
  'Average Angle (°)': string
  'Total Time (min)': string
}

export const useExperiments = create<ExperimentsState>()(
  persist(
    (set, get) => ({
      experiments: [],
      currentExperiment: null,
      stats: null,
      isLoading: false,
      error: null,

      loadExperiments: async () => {
        try {
          set({ isLoading: true, error: null })
          const response = await fetch('/api/auth/user/experiments')
          
          if (!response.ok) {
            throw new Error('Failed to load experiments')
          }

          const data = await response.json()
          set({ 
            experiments: data,
            isLoading: false 
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false 
          })
          throw error
        }
      },

      saveExperiment: async (data) => {
        try {
          set({ isLoading: true, error: null })
          const response = await fetch('/api/auth/user/experiments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })

          if (!response.ok) {
            throw new Error('Failed to save experiment')
          }

          const savedExperiment = await response.json()
          set(state => ({ 
            experiments: [...state.experiments, savedExperiment],
            currentExperiment: savedExperiment,
            isLoading: false 
          }))
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false 
          })
          throw error
        }
      },

      setCurrentExperiment: (experiment) => {
        set({ currentExperiment: experiment })
      },

      resetState: () => {
        set({ 
          currentExperiment: null,
          isLoading: false,
          error: null 
        })
      },

      loadStats: async () => {
        try {
          set({ isLoading: true, error: null })
          const response = await fetch('/api/auth/user/experiments/stats')
          
          if (!response.ok) {
            throw new Error('Failed to load stats')
          }

          const stats = await response.json()
          set({ stats, isLoading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false 
          })
          throw error
        }
      },

      exportData: async (options: ExportOptions) => {
        try {
          const { experiments } = get()
          let filteredData = experiments
          
          // Filter berdasarkan time range
          if (options.timeRange !== "all") {
            const now = new Date()
            const startDate = new Date()
            
            switch (options.timeRange) {
              case "today":
                startDate.setHours(0,0,0,0)
                break
              case "week":
                startDate.setDate(now.getDate() - 7)
                break
              case "month":
                startDate.setMonth(now.getMonth() - 1)
                break
            }
            
            filteredData = experiments.filter(exp => 
              new Date(exp.timestamp) >= startDate
            )
          }

          // Format data dengan tipe yang tepat
          if (options.dataPoints === 'summary') {
            const totalExperiments = filteredData.length
            const avgDuration = filteredData.reduce((acc, exp) => acc + exp.duration, 0) / totalExperiments
            const avgAngle = filteredData.reduce((acc, exp) => acc + exp.parameters.angle, 0) / totalExperiments
            const totalTime = filteredData.reduce((acc, exp) => acc + exp.duration, 0)

            // Export summary data langsung ke file
            const summaryData: ExperimentSummaryData = {
              'Total Experiments': totalExperiments,
              'Average Duration (s)': avgDuration.toFixed(1),
              'Average Angle (°)': avgAngle.toFixed(1),
              'Total Time (min)': (totalTime / 60).toFixed(1)
            }

            if (options.format === "json") {
              const json = JSON.stringify([summaryData], null, 2)
              downloadFile(json, `experiments_summary_${new Date().toISOString()}.json`, 'application/json')
            } else {
              const csv = Papa.unparse([summaryData])
              downloadFile(csv, `experiments_summary_${new Date().toISOString()}.csv`, 'text/csv')
            }
          } else {
            // Format untuk all data
            const exportData: ExperimentExportData[] = filteredData.map(exp => ({
              Date: new Date(exp.timestamp).toLocaleDateString(),
              'Length (m)': exp.parameters.length,
              'Mass (kg)': exp.parameters.mass,
              'Initial Angle (°)': exp.parameters.angle.toFixed(1),
              Duration: formatDuration(exp.duration)
            }))

            if (options.format === "json") {
              const json = JSON.stringify(exportData, null, 2)
              downloadFile(json, `experiments_all_${new Date().toISOString()}.json`, 'application/json')
            } else {
              const csv = Papa.unparse(exportData)
              downloadFile(csv, `experiments_all_${new Date().toISOString()}.csv`, 'text/csv')
            }
          }
        } catch (error) {
          console.error('Error exporting data:', error)
          toast.error('Failed to export data')
        }
      },

      deleteExperiment: async (id: string) => {
        try {
          set({ isLoading: true })
          const response = await fetch(`/api/experiments/${id}`, {
            method: 'DELETE'
          })
          
          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || 'Failed to delete experiment')
          }
          
          set((state) => ({
            experiments: state.experiments.filter(exp => exp.id !== id && exp._id !== id),
            isLoading: false
          }))
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      }
    }),
    {
      name: 'experiments-storage',
      partialize: (state) => ({
        currentExperiment: state.currentExperiment
      })
    }
  )
)

// Fungsi helper untuk download
function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type: `${type};charset=utf-8;` })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
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

interface ExperimentExportData {
  Date: string
  'Length (m)': number
  'Mass (kg)': number
  'Initial Angle (°)': string
  Duration: string
  'Time Range': string
}

interface ExperimentSummaryData {
  'Total Experiments': number
  'Average Duration (s)': string
  'Average Angle (°)': string
  'Total Time (min)': string
  'Time Period': string
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
          let timeRangeLabel = 'All Time'
          
          // Filter berdasarkan time range dengan validasi
          if (options.timeRange !== "all") {
            const now = new Date()
            const startDate = new Date()
            
            switch (options.timeRange) {
              case "today":
                startDate.setHours(0,0,0,0)
                timeRangeLabel = 'Today'
                break
              case "week":
                startDate.setDate(now.getDate() - 7)
                timeRangeLabel = 'Last 7 Days'
                break
              case "month":
                startDate.setMonth(now.getMonth() - 1)
                timeRangeLabel = 'Last 30 Days'
                break
              default:
                timeRangeLabel = 'All Time'
            }
            
            filteredData = experiments.filter(exp => {
              const expDate = new Date(exp.timestamp)
              return expDate >= startDate && expDate <= now
            })
          }

          if (filteredData.length === 0) {
            toast.error('No data available for selected time range')
            return
          }

          // Format data dengan validasi
          if (options.dataPoints === 'summary') {
            const totalExperiments = filteredData.length
            const avgDuration = filteredData.reduce((acc, exp) => acc + (exp.duration || 0), 0) / totalExperiments
            const avgAngle = filteredData.reduce((acc, exp) => acc + (exp.parameters?.angle || 0), 0) / totalExperiments
            const totalTime = filteredData.reduce((acc, exp) => acc + (exp.duration || 0), 0)

            const summaryData: ExperimentSummaryData = {
              'Total Experiments': totalExperiments,
              'Average Duration (s)': isNaN(avgDuration) ? '0.0' : avgDuration.toFixed(1),
              'Average Angle (°)': isNaN(avgAngle) ? '0.0' : avgAngle.toFixed(1),
              'Total Time (min)': isNaN(totalTime) ? '0.0' : (totalTime / 60).toFixed(1),
              'Time Period': timeRangeLabel
            }

            if (options.format === "json") {
              const json = JSON.stringify([summaryData], null, 2)
              downloadFile(json, `experiments_summary_${timeRangeLabel.toLowerCase()}_${new Date().toISOString()}.json`, 'application/json')
            } else {
              const csv = Papa.unparse([summaryData])
              downloadFile(csv, `experiments_summary_${timeRangeLabel.toLowerCase()}_${new Date().toISOString()}.csv`, 'text/csv')
            }
          } else {
            const exportData: ExperimentExportData[] = filteredData.map(exp => ({
              Date: new Date(exp.timestamp).toLocaleString(),
              'Length (m)': exp.parameters?.length || 0,
              'Mass (kg)': exp.parameters?.mass || 0,
              'Initial Angle (°)': (exp.parameters?.angle || 0).toFixed(1),
              Duration: formatDuration(exp.duration || 0),
              'Time Range': timeRangeLabel
            }))

            if (options.format === "json") {
              const json = JSON.stringify(exportData, null, 2)
              downloadFile(json, `experiments_detailed_${timeRangeLabel.toLowerCase()}_${new Date().toISOString()}.json`, 'application/json')
            } else {
              const csv = Papa.unparse(exportData)
              downloadFile(csv, `experiments_detailed_${timeRangeLabel.toLowerCase()}_${new Date().toISOString()}.csv`, 'text/csv')
            }
          }

          toast.success('Data exported successfully')
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
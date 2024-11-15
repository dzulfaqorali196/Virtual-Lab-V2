'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'

// Constants
const STORAGE_KEY = 'time-tracker-state'
const DEBOUNCE_DELAY = 1000 // 1 second
const MAX_RETRIES = 3

interface TimeTrackerState {
  startTime: number
  totalTimeSpent: number
  lastUpdate: number
}

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// Initial state helper function
function getInitialState(): TimeTrackerState {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse stored time tracker state')
      }
    }
  }
  return {
    startTime: Date.now(),
    totalTimeSpent: 0,
    lastUpdate: Date.now()
  }
}

export function useTimeTracker() {
  const { data: session } = useSession()
  const animationFrameRef = useRef<number>()
  const retryCountRef = useRef<number>(0)
  const stateRef = useRef<TimeTrackerState>(getInitialState())

  // Save state to localStorage
  const saveState = useCallback((state: TimeTrackerState) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }, [])

  // Update time in database with retry mechanism
  const updateTimeInDb = useCallback(async (timeSpent: number) => {
    if (!session?.user?.email) return

    try {
      const response = await fetch('/api/user/time-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeSpent })
      })

      if (!response.ok) {
        throw new Error('Failed to update time')
      }

      const data = await response.json()
      retryCountRef.current = 0 // Reset retry count on success
      return data

    } catch (error) {
      if (retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current++
        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, retryCountRef.current), 10000)
        await new Promise(resolve => setTimeout(resolve, delay))
        return updateTimeInDb(timeSpent)
      }
      throw error
    }
  }, [session])

  // Debounced version of updateTimeInDb
  const debouncedUpdate = useCallback(
    debounce(async (timeSpent: number) => {
      try {
        await updateTimeInDb(timeSpent)
        // Update local state after successful DB update
        const newState = {
          ...stateRef.current,
          lastUpdate: Date.now(),
          totalTimeSpent: stateRef.current.totalTimeSpent + timeSpent
        }
        stateRef.current = newState
        saveState(newState)
      } catch (error) {
        console.error('Failed to update time after retries:', error)
      }
    }, DEBOUNCE_DELAY),
    [updateTimeInDb, saveState]
  )

  useEffect(() => {
    if (!session?.user?.email) return

    let lastFrameTime = performance.now()

    // RequestAnimationFrame loop for accurate time tracking
    const trackTime = (currentFrameTime: number) => {
      const deltaTime = currentFrameTime - lastFrameTime
      lastFrameTime = currentFrameTime

      if (deltaTime > 0) {
        const timeSpentInMinutes = deltaTime / 60000 // Convert to minutes
        debouncedUpdate(timeSpentInMinutes)
      }

      animationFrameRef.current = requestAnimationFrame(trackTime)
    }

    animationFrameRef.current = requestAnimationFrame(trackTime)

    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      // Final update before unmounting
      const finalState = stateRef.current
      const finalTimeSpent = (Date.now() - finalState.lastUpdate) / 60000
      if (finalTimeSpent > 0) {
        updateTimeInDb(finalTimeSpent).catch(console.error)
      }
      saveState(finalState)
    }
  }, [session, debouncedUpdate, saveState])

  return stateRef.current.totalTimeSpent
}
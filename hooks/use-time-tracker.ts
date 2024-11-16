'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'

export function useTimeTracker() {
  const { data: session } = useSession()
  const lastUpdateRef = useRef<number>(Date.now())
  const isActiveRef = useRef<boolean>(true)

  useEffect(() => {
    if (!session?.user) return

    // Update time setiap 1 menit
    const interval = setInterval(async () => {
      if (!isActiveRef.current) return

      const now = Date.now()
      const timeSpent = Math.floor((now - lastUpdateRef.current) / 1000) // Convert to seconds
      
      try {
        const response = await fetch('/api/user/stats/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ timeSpent })
        })

        if (response.ok) {
          lastUpdateRef.current = now
        }
      } catch (error) {
        console.error('Failed to update time:', error)
      }
    }, 60000) // Check every minute

    // Track user activity
    const handleActivity = () => {
      isActiveRef.current = true
    }

    const handleInactivity = () => {
      isActiveRef.current = false
    }

    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('keypress', handleActivity)
    window.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        handleInactivity()
      } else {
        handleActivity()
      }
    })

    return () => {
      clearInterval(interval)
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keypress', handleActivity)
      window.removeEventListener('visibilitychange', handleInactivity)
    }
  }, [session])
}
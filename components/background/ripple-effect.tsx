"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"

interface Ripple {
  id: number
  x: number
  y: number
}

export function RippleEffect() {
  const [ripples, setRipples] = useState<Ripple[]>([])
  const { theme } = useTheme()
  const rippleColor = theme === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)"

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newRipple = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      }
      setRipples((prev) => [...prev, newRipple])
    }

    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [])

  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples((prev) => prev.slice(1))
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [ripples])

  return (
    <div className="fixed inset-0 pointer-events-none">
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ 
              width: 0, 
              height: 0,
              x: ripple.x,
              y: ripple.y,
              opacity: 0.7,
            }}
            animate={{ 
              width: 500,
              height: 500,
              x: ripple.x - 250,
              y: ripple.y - 250,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              position: "absolute",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${rippleColor} 0%, transparent 70%)`,
              boxShadow: theme === "dark" 
                ? "0 0 20px rgba(255, 255, 255, 0.1)"
                : "0 0 20px rgba(0, 0, 0, 0.08)",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
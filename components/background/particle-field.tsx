"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

interface Particle {
  id: number
  size: number
  x: number
  y: number
  duration: number
  delay: number
}

export function ParticleField() {
  const { theme, resolvedTheme } = useTheme()
  const [particles, setParticles] = useState<Particle[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const generateParticles = () => {
      const particleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 30 : 50
      
      return Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 2,
      }))
    }

    setParticles(generateParticles())
  }, [mounted])

  if (!mounted || !particles.length) return null

  const currentTheme = resolvedTheme || theme

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => {
        const isSmallParticle = particle.size < 4
        const particleColor = currentTheme === "dark"
          ? isSmallParticle
            ? "rgba(255, 255, 255, 0.2)"
            : "rgba(255, 255, 255, 0.15)"
          : isSmallParticle
            ? "rgba(0, 0, 0, 0.15)"
            : "rgba(0, 0, 0, 0.1)"

        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              backgroundColor: particleColor,
              boxShadow: currentTheme === "dark"
                ? "0 0 15px rgba(255, 255, 255, 0.1)"
                : "0 0 15px rgba(0, 0, 0, 0.05)",
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        )
      })}
    </div>
  )
}
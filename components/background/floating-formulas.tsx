"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"

const formulas = [
  "E = mc²",
  "F = ma",
  "v = λf",
  "PV = nRT",
  "F = -kx",
  "T = 2π√(L/g)",
]

export function FloatingFormulas() {
  const { theme } = useTheme()
  const [positions, setPositions] = useState<Array<{ x: number, y: number }>>([])
  const textColor = theme === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.2)"

  useEffect(() => {
    setPositions(formulas.map(() => ({
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
    })))
  }, [])

  if (!positions.length) return null

  return (
    <>
      {formulas.map((formula, index) => (
        <motion.div
          key={index}
          className="absolute pointer-events-none select-none font-mono text-2xl md:text-3xl font-bold"
          initial={{
            x: positions[index].x,
            y: positions[index].y,
            opacity: 0,
          }}
          animate={{
            x: [
              positions[index].x,
              Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            ],
            y: [
              positions[index].y,
              Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            ],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ color: textColor }}
        >
          {formula}
        </motion.div>
      ))}
    </>
  )
}
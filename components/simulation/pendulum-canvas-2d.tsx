"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { usePendulum } from "@/hooks/use-pendulum"

export function PendulumCanvas2D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { length, mass, angle } = usePendulum()
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const pixelsPerMeter = 150 // Scale factor for visualization

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set origin to center-top of canvas
    ctx.save()
    ctx.translate(canvas.width / 2, 50)

    // Set color based on theme
    const strokeColor = theme === "system" || theme === "dark" ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)"
    const fillColor = theme === "system" || theme === "dark" ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)"

    // Draw pivot point
    ctx.beginPath()
    ctx.arc(0, 0, 5, 0, Math.PI * 2)
    ctx.fillStyle = fillColor
    ctx.fill()

    // Draw string
    ctx.beginPath()
    ctx.moveTo(0, 0)
    const x = length * pixelsPerMeter * Math.sin(angle)
    const y = length * pixelsPerMeter * Math.cos(angle)
    ctx.lineTo(x, y)
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw bob
    ctx.beginPath()
    ctx.arc(x, y, mass * 20, 0, Math.PI * 2)
    ctx.fillStyle = fillColor
    ctx.fill()
    ctx.strokeStyle = strokeColor
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.restore()
  }, [length, mass, angle, theme])

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={400}
      className="w-full bg-background border rounded-lg"
    />
  )
}
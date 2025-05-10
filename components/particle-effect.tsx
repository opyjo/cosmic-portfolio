"use client"

import { useEffect, useRef, useState } from "react"

// Canvas-based particle system for better performance
export default function ParticleEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const animationRef = useRef<number>()
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const particlesRef = useRef<
    Array<{
      x: number
      y: number
      radius: number
      vx: number
      vy: number
      opacity: number
    }>
  >([])

  // Initialize dimensions on mount
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // Setup canvas and particles when dimensions change
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0 || dimensions.height === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Create particles
    const particleCount = Math.min(Math.floor(dimensions.width * dimensions.height * 0.00005), 150)
    const particles = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        radius: Math.random() * 1.5 + 0.5,
        vx: Math.random() * 0.2 - 0.1,
        vy: Math.random() * 0.2 - 0.1,
        opacity: Math.random() * 0.5 + 0.3,
      })
    }

    particlesRef.current = particles

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true,
      }

      // Reset active state after 100ms of inactivity
      setTimeout(() => {
        mouseRef.current.active = false
      }, 100)
    }

    // Throttled mouse move handler
    let lastMoveTime = 0
    const throttledMouseMove = (e: MouseEvent) => {
      const now = performance.now()
      if (now - lastMoveTime > 16) {
        // ~60fps
        lastMoveTime = now
        handleMouseMove(e)
      }
    }

    window.addEventListener("mousemove", throttledMouseMove)

    // Animation function
    const animate = () => {
      if (!ctx) return

      // Clear canvas with semi-transparent black for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Add some random movement
        particle.vx += (Math.random() - 0.5) * 0.01
        particle.vy += (Math.random() - 0.5) * 0.01

        // Limit velocity
        particle.vx = Math.max(Math.min(particle.vx, 0.5), -0.5)
        particle.vy = Math.max(Math.min(particle.vy, 0.5), -0.5)

        // Mouse attraction if mouse is active
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - particle.x
          const dy = mouseRef.current.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            const force = 0.5 / Math.max(distance, 10)
            particle.vx += dx * force
            particle.vy += dy * force
          }
        }

        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
        ctx.fill()
      })

      // Continue animation
      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    return () => {
      window.removeEventListener("mousemove", throttledMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions])

  return <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none"></canvas>
}

"use client"

import { useEffect, useRef, useState } from "react"

interface Particle {
  x: number
  y: number
  size: number
  color: string
  alpha: number
  vx: number
  vy: number
  life: number
  maxLife: number
}

export default function CometCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0, lastX: 0, lastY: 0, moving: false })
  const animationRef = useRef<number>()
  const lastParticleTimeRef = useRef(0)

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

  // Setup canvas and animation
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0 || dimensions.height === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Initialize particles array
    particlesRef.current = []

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX
      const currentY = e.clientY

      // Calculate mouse velocity
      const dx = currentX - mouseRef.current.lastX
      const dy = currentY - mouseRef.current.lastY
      const distance = Math.sqrt(dx * dx + dy * dy)

      mouseRef.current = {
        x: currentX,
        y: currentY,
        lastX: mouseRef.current.x,
        lastY: mouseRef.current.y,
        moving: distance > 0,
      }

      // Create particles based on mouse movement
      const now = performance.now()
      if (now - lastParticleTimeRef.current > 16 && distance > 0) {
        // Limit to ~60fps
        createParticles(currentX, currentY, Math.min(distance * 0.2, 3), dx, dy)
        lastParticleTimeRef.current = now
      }
    }

    // Touch move handler for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        handleMouseMove({
          clientX: touch.clientX,
          clientY: touch.clientY,
        } as MouseEvent)
      }
    }

    // Create particles at position
    const createParticles = (x: number, y: number, count: number, dx: number, dy: number) => {
      const speed = Math.sqrt(dx * dx + dy * dy)
      const particleCount = Math.max(1, Math.min(Math.floor(count), 5)) // Limit particles

      for (let i = 0; i < particleCount; i++) {
        // Calculate slightly varied position
        const offsetX = (Math.random() - 0.5) * 5
        const offsetY = (Math.random() - 0.5) * 5

        // Calculate velocity based on mouse movement
        const vx = (dx / 10) * (Math.random() * 0.5 - 0.25)
        const vy = (dy / 10) * (Math.random() * 0.5 - 0.25)

        // Create particle with color based on position
        const hue = (x + y) % 360
        const particle: Particle = {
          x: x + offsetX,
          y: y + offsetY,
          size: Math.random() * 2 + 1,
          color: `hsl(${210 + Math.random() * 40}, 80%, 70%)`, // Blue-ish colors
          alpha: 0.7 + Math.random() * 0.3,
          vx,
          vy,
          life: 0,
          maxLife: 20 + Math.random() * 20 * (speed / 10), // Lifespan based on speed
        }

        particlesRef.current.push(particle)
      }
    }

    // Animation function
    const animate = () => {
      if (!ctx) return

      // Clear canvas with transparent black for trail effect
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        // Update life
        particle.life++

        // Calculate opacity based on life
        const lifeRatio = particle.life / particle.maxLife
        const alpha = particle.alpha * (1 - lifeRatio)

        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Slow down
        particle.vx *= 0.97
        particle.vy *= 0.97

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color.replace(")", `, ${alpha})`)
        ctx.fill()

        // Keep particle if still alive
        return particle.life < particle.maxLife
      })

      // Continue animation
      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Add event listeners
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchmove", handleTouchMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouchMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions])

  return <canvas ref={canvasRef} className="fixed inset-0 z-50 pointer-events-none" />
}

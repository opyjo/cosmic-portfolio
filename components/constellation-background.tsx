"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface Constellation {
  id: string
  name: string
  position: {
    x: number
    y: number
  }
}

interface ConstellationBackgroundProps {
  activeConstellation: string | null
  constellations: Constellation[]
  isInitialLoad?: boolean
}

// Simple predefined constellation patterns with names
const constellationPatterns = [
  // Big Dipper-like pattern
  {
    name: "Celestial Compass",
    points: [
      { x: 0, y: 0 },
      { x: 30, y: 10 },
      { x: 60, y: 15 },
      { x: 80, y: 0 },
      { x: 100, y: 20 },
      { x: 90, y: 50 },
      { x: 110, y: 70 },
    ],
  },
  // Orion-like pattern
  {
    name: "Digital Voyager",
    points: [
      { x: 0, y: 0 },
      { x: 20, y: 30 },
      { x: 10, y: 60 },
      { x: 30, y: 80 },
      { x: 50, y: 70 },
      { x: 40, y: 40 },
      { x: 60, y: 20 },
      { x: 50, y: 0 },
    ],
  },
  // Cassiopeia-like pattern (W shape)
  {
    name: "Code Weaver",
    points: [
      { x: 0, y: 30 },
      { x: 25, y: 0 },
      { x: 50, y: 30 },
      { x: 75, y: 0 },
      { x: 100, y: 30 },
    ],
  },
  // Simple triangle
  {
    name: "Triad Nexus",
    points: [
      { x: 0, y: 0 },
      { x: 50, y: 80 },
      { x: 100, y: 0 },
      { x: 0, y: 0 },
    ],
  },
]

export default function ConstellationBackground({
  activeConstellation,
  constellations,
  isInitialLoad = false,
}: ConstellationBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const starsRef = useRef<
    Array<{
      x: number
      y: number
      radius: number
      opacity: number
      twinkleSpeed: number
    }>
  >([])
  const animationRef = useRef<number>()
  const timeRef = useRef(0)
  const lastShootingStarTimeRef = useRef(0)
  const createShootingStarFnRef = useRef<((x: number, y: number) => void) | null>(null)

  // Background constellation animations
  const bgConstellationsRef = useRef<
    Array<{
      pattern: (typeof constellationPatterns)[0]["points"]
      name: string
      x: number
      y: number
      scale: number
      rotation: number
      rotationSpeed: number
      opacity: number
      labelOpacity: number
      labelFadeDirection: number // 1 for fading in, -1 for fading out
    }>
  >([])

  // Shooting stars
  const shootingStarsRef = useRef<
    Array<{
      x: number
      y: number
      length: number
      speed: number
      angle: number
      opacity: number
      width: number
      trail: Array<{ x: number; y: number; opacity: number }>
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

  // Setup canvas and stars when dimensions change
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0 || dimensions.height === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Create stars - limit count for better performance
    const starCount = Math.min(Math.floor(dimensions.width * dimensions.height * 0.00015), 200)
    const stars = []

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.01 + 0.003,
      })
    }

    starsRef.current = stars

    // Create background constellations - just a few to keep it simple
    const bgConstellations = []
    const constellationCount = 4 // Keep this number low for performance

    for (let i = 0; i < constellationCount; i++) {
      const patternData = constellationPatterns[i % constellationPatterns.length]
      bgConstellations.push({
        pattern: patternData.points,
        name: patternData.name,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        scale: Math.random() * 0.5 + 0.5, // Random scale between 0.5 and 1
        rotation: Math.random() * Math.PI * 2, // Random initial rotation
        rotationSpeed: Math.random() * 0.0002 - 0.0001, // Very slow rotation
        opacity: Math.random() * 0.15 + 0.05, // Very subtle opacity
        labelOpacity: 0, // Start with invisible labels
        labelFadeDirection: 1, // Start by fading in
      })
    }

    bgConstellationsRef.current = bgConstellations
    shootingStarsRef.current = [] // Initialize empty shooting stars array

    // Create a new random shooting star
    function createRandomShootingStar() {
      // Determine starting position (usually from top or sides)
      const startFromTop = Math.random() > 0.5
      let x, y

      if (startFromTop) {
        x = Math.random() * canvas.width
        y = 0
      } else {
        x = Math.random() > 0.5 ? 0 : canvas.width
        y = Math.random() * (canvas.height / 2) // Start in top half
      }

      // Calculate angle - shooting stars should generally move downward
      let angle
      if (startFromTop) {
        angle = Math.PI / 4 + (Math.random() * Math.PI) / 2 // Downward angle
      } else {
        angle =
          x === 0
            ? Math.PI / 6 + (Math.random() * Math.PI) / 3 // From left
            : Math.PI - Math.PI / 6 - (Math.random() * Math.PI) / 3 // From right
      }

      // Create the shooting star
      const shootingStar = {
        x,
        y,
        length: 20 + Math.random() * 30, // Length of the shooting star
        speed: 3 + Math.random() * 7, // Speed of movement
        angle,
        opacity: 0.7 + Math.random() * 0.3, // Opacity
        width: 1 + Math.random() * 2, // Width of the line
        trail: [], // Trail effect
      }

      shootingStarsRef.current.push(shootingStar)
    }

    // Create a shooting star at a specific position
    function createShootingStarAtPosition(x: number, y: number) {
      // Determine angle based on position (shoot away from center)
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Calculate angle from center to click position
      let angle = Math.atan2(y - centerY, x - centerX)

      // Add some randomness to the angle
      angle += (Math.random() - 0.5) * 0.5

      // Create the shooting star
      const shootingStar = {
        x,
        y,
        length: 20 + Math.random() * 30,
        speed: 5 + Math.random() * 8, // Slightly faster than random stars
        angle,
        opacity: 0.8 + Math.random() * 0.2,
        width: 1.5 + Math.random() * 2,
        trail: [],
      }

      shootingStarsRef.current.push(shootingStar)
    }

    // Store the function in a ref so it can be accessed from outside the effect
    createShootingStarFnRef.current = createShootingStarAtPosition

    // Draw stars function
    const drawStars = (timestamp: number) => {
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw deep space background with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#0a0a1a")
      gradient.addColorStop(0.5, "#0d0d2a")
      gradient.addColorStop(1, "#000000")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add some nebula-like effects - limit for better performance
      ctx.globalAlpha = 0.05
      for (let i = 0; i < 2; i++) {
        const x = canvas.width * Math.random()
        const y = canvas.height * Math.random()
        const radius = Math.min(canvas.width, canvas.height) * (Math.random() * 0.2 + 0.1)

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius)
        gradient.addColorStop(0, "rgba(120, 100, 200, 0.2)")
        gradient.addColorStop(1, "rgba(20, 10, 40, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // Draw background constellations
      drawBackgroundConstellations()

      // Draw stars
      starsRef.current.forEach((star) => {
        // Twinkling effect
        const twinkle = Math.sin(timeRef.current * star.twinkleSpeed * 10) * 0.3 + 0.7

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`
        ctx.fill()
      })

      // Draw and update shooting stars
      drawAndUpdateShootingStars()

      // Draw constellation lines if active
      if (activeConstellation) {
        drawConstellationLines()
      }

      // Randomly create new shooting stars
      if (timestamp - lastShootingStarTimeRef.current > 5000 + Math.random() * 10000) {
        // Every 5-15 seconds
        createRandomShootingStar()
        lastShootingStarTimeRef.current = timestamp
      }

      timeRef.current++
    }

    // Draw and update shooting stars
    function drawAndUpdateShootingStars() {
      if (!ctx) return

      // Update and draw each shooting star
      shootingStarsRef.current = shootingStarsRef.current.filter((star) => {
        // Update position
        const dx = Math.cos(star.angle) * star.speed
        const dy = Math.sin(star.angle) * star.speed

        // Add current position to trail
        star.trail.unshift({ x: star.x, y: star.y, opacity: star.opacity })

        // Limit trail length
        if (star.trail.length > 10) {
          star.trail.pop()
        }

        // Update position
        star.x += dx
        star.y += dy

        // Draw the shooting star with trail
        ctx.beginPath()
        ctx.moveTo(star.x, star.y)

        // Draw the main shooting star
        const tailX = star.x - Math.cos(star.angle) * star.length
        const tailY = star.y - Math.sin(star.angle) * star.length

        // Create gradient for the shooting star
        const gradient = ctx.createLinearGradient(star.x, star.y, tailX, tailY)
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`)
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

        ctx.lineTo(tailX, tailY)
        ctx.strokeStyle = gradient
        ctx.lineWidth = star.width
        ctx.stroke()

        // Draw the trail with fading effect
        star.trail.forEach((point, index) => {
          const trailOpacity = point.opacity * (1 - index / star.trail.length)

          ctx.beginPath()
          ctx.arc(point.x, point.y, star.width / 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${trailOpacity * 0.3})`
          ctx.fill()
        })

        // Check if the shooting star is still on screen
        return star.x >= -100 && star.x <= canvas.width + 100 && star.y >= -100 && star.y <= canvas.height + 100
      })
    }

    // Draw background constellation patterns
    function drawBackgroundConstellations() {
      if (!ctx) return

      bgConstellationsRef.current.forEach((constellation) => {
        // Update rotation
        constellation.rotation += constellation.rotationSpeed

        // Update label opacity with pulsing effect
        constellation.labelOpacity += 0.002 * constellation.labelFadeDirection
        if (constellation.labelOpacity > 0.7) {
          constellation.labelFadeDirection = -1 // Start fading out
        } else if (constellation.labelOpacity < 0.2) {
          constellation.labelFadeDirection = 1 // Start fading in
        }

        // Ensure opacity stays within bounds
        constellation.labelOpacity = Math.max(0.2, Math.min(0.7, constellation.labelOpacity))

        ctx.save()
        ctx.translate(constellation.x, constellation.y)
        ctx.rotate(constellation.rotation)
        ctx.scale(constellation.scale, constellation.scale)

        // Draw constellation lines
        ctx.beginPath()
        ctx.strokeStyle = `rgba(255, 255, 255, ${constellation.opacity})`
        ctx.lineWidth = 0.5

        const pattern = constellation.pattern
        if (pattern.length > 0) {
          ctx.moveTo(pattern[0].x, pattern[0].y)

          for (let i = 1; i < pattern.length; i++) {
            ctx.lineTo(pattern[i].x, pattern[i].y)
          }
        }

        ctx.stroke()

        // Draw small dots at constellation points
        pattern.forEach((point) => {
          ctx.beginPath()
          ctx.arc(point.x, point.y, 1, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${constellation.opacity * 1.5})`
          ctx.fill()
        })

        // Draw constellation name
        ctx.font = "10px 'Arial', sans-serif"
        ctx.fillStyle = `rgba(255, 255, 255, ${constellation.labelOpacity})`
        ctx.textAlign = "center"

        // Find center point of constellation for label placement
        let centerX = 0
        let centerY = 0
        pattern.forEach((point) => {
          centerX += point.x
          centerY += point.y
        })
        centerX /= pattern.length
        centerY /= pattern.length

        // Add a slight offset to position the label near but not directly on the constellation
        const labelY = centerY + 20

        // Draw text with subtle glow effect
        ctx.shadowColor = "rgba(0, 0, 255, 0.3)"
        ctx.shadowBlur = 5
        ctx.fillText(constellation.name, centerX, labelY)
        ctx.shadowBlur = 0

        ctx.restore()
      })
    }

    // Draw lines between constellation points
    function drawConstellationLines() {
      if (!ctx) return

      const activeConst = constellations.find((c) => c.id === activeConstellation)
      if (!activeConst) return

      const centerX = (activeConst.position.x / 100) * canvas.width
      const centerY = (activeConst.position.y / 100) * canvas.height

      // Find nearby stars to connect - limit for better performance
      const constellationStars = starsRef.current
        .filter((star) => {
          const distance = Math.sqrt(Math.pow(star.x - centerX, 2) + Math.pow(star.y - centerY, 2))
          return distance < Math.min(canvas.width, canvas.height) * 0.15
        })
        .slice(0, 5) // Limit to 5 stars per constellation

      // Add the center point
      constellationStars.push({
        x: centerX,
        y: centerY,
        radius: 2,
        opacity: 1,
        twinkleSpeed: 0.005,
      })

      // Draw lines between stars
      ctx.beginPath()
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
      ctx.lineWidth = 0.5

      // Create a path through the stars
      for (let i = 0; i < constellationStars.length - 1; i++) {
        ctx.moveTo(constellationStars[i].x, constellationStars[i].y)
        ctx.lineTo(constellationStars[i + 1].x, constellationStars[i + 1].y)
      }

      // Connect back to the first star to complete the constellation
      if (constellationStars.length > 2) {
        ctx.moveTo(
          constellationStars[constellationStars.length - 1].x,
          constellationStars[constellationStars.length - 1].y,
        )
        ctx.lineTo(constellationStars[0].x, constellationStars[0].y)
      }

      ctx.stroke()
    }

    // Animation loop with frame limiting
    let lastFrameTime = 0
    const targetFPS = isInitialLoad ? 60 : 30 // Lower FPS after initial load

    const animate = (timestamp: number) => {
      // Limit frame rate for better performance
      if (timestamp - lastFrameTime < 1000 / targetFPS) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      lastFrameTime = timestamp
      drawStars(timestamp)
      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions, activeConstellation, constellations, isInitialLoad])

  // Handle canvas click to create shooting star
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !createShootingStarFnRef.current) return

    // Get click position relative to canvas
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Create a shooting star at the clicked position
    createShootingStarFnRef.current(x, y)
  }

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 cursor-pointer" onClick={handleCanvasClick} />
}

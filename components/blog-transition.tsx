"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface BlogTransitionProps {
  isActive: boolean
  onAnimationComplete: () => void
}

export default function BlogTransition({ isActive, onAnimationComplete }: BlogTransitionProps) {
  const [stars, setStars] = useState<Array<{ x: number; y: number; size: number; delay: number }>>([])

  // Generate stars for the animation
  useEffect(() => {
    if (isActive) {
      const newStars = Array.from({ length: 100 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 0.5,
      }))
      setStars(newStars)

      // Redirect after animation completes
      const timer = setTimeout(() => {
        onAnimationComplete()
      }, 2000) // Animation duration + small buffer

      return () => clearTimeout(timer)
    }
  }, [isActive, onAnimationComplete])

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-50 bg-black overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Stars animation */}
          {stars.map((star, index) => (
            <motion.div
              key={index}
              className="absolute rounded-full bg-white"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 3] }}
              transition={{
                duration: 1.5,
                delay: star.delay,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Central portal effect */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{ width: "300vw", height: "300vw", opacity: 0.8 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
          />

          {/* Blog text */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.h2
              className="text-3xl md:text-5xl font-light tracking-wider mb-2"
              animate={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              Blog
            </motion.h2>
            <motion.p
              className="text-sm md:text-base text-white/80"
              animate={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              Redirecting to Hashnode...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

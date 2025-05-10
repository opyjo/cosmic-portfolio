"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface HeroSectionProps {
  introComplete: boolean
  setIntroComplete: (value: boolean) => void
  activeSection: string | null
}

export default function HeroSection({ introComplete, setIntroComplete, activeSection }: HeroSectionProps) {
  const [showExplorePrompt, setShowExplorePrompt] = useState(false)

  // Show explore prompt after intro animation
  useEffect(() => {
    if (introComplete) {
      const timer = setTimeout(() => {
        setShowExplorePrompt(true)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [introComplete])

  return (
    <AnimatePresence>
      {!activeSection && (
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Initial centered hero content */}
          {!introComplete && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 1 }}
            >
              <motion.h1
                className="text-4xl md:text-6xl font-light tracking-wider mb-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                JOHNSON OJO
              </motion.h1>

              <motion.div
                className="text-center max-w-md px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ duration: 1, delay: 1 }}
              >
                <p className="text-lg md:text-xl mb-2">Frontend Engineer</p>
                <p className="text-base md:text-lg">
                  Building high-performance, scalable web applications with modern technologies
                </p>
              </motion.div>

              <motion.button
                className="mt-12 px-6 py-2 border border-white/30 rounded-full text-sm backdrop-blur-sm hover:bg-white/10 transition-colors pointer-events-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2 }}
                onClick={() => setIntroComplete(true)}
              >
                Explore My Universe
              </motion.button>
            </motion.div>
          )}

          {/* Header that appears after intro animation */}
          {introComplete && (
            <motion.header
              className="absolute top-0 left-0 w-full px-6 py-4 md:px-12 md:py-6 z-20"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex flex-col md:flex-row justify-between items-center">
                <motion.h1
                  className="text-2xl md:text-3xl font-light tracking-wider mb-2 md:mb-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  JOHNSON OJO
                </motion.h1>

                <motion.div
                  className="text-sm md:text-base text-white/70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <p>Frontend Engineer</p>
                </motion.div>
              </div>
            </motion.header>
          )}

          {/* Explore prompt that appears after header animation */}
          {showExplorePrompt && (
            <motion.div
              className="absolute bottom-12 left-0 w-full flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <motion.div
                className="text-center max-w-md px-6 py-4 bg-black/30 backdrop-blur-sm rounded-lg border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.p
                  className="text-base md:text-lg text-white/90 mb-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Welcome to my cosmic portfolio
                </motion.p>
                <motion.p
                  className="text-xs md:text-sm text-white/70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  Navigate through the constellations to explore my professional universe
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

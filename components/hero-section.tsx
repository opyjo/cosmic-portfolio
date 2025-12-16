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
                className="text-5xl md:text-7xl font-heading font-bold tracking-wider mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: [0, -10, 0],
                }}
                transition={{
                  opacity: { duration: 1, delay: 0.3 },
                  y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                JOHNSON OJO
              </motion.h1>

              <motion.div
                className="text-center max-w-md px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ duration: 1, delay: 1 }}
              >
                <p className="text-xl md:text-2xl mb-2 font-light text-primary-foreground">Frontend Engineer</p>
                <p className="text-base md:text-lg text-muted-foreground">
                  Building high-performance, scalable web applications with modern technologies
                </p>
              </motion.div>

              <motion.button
                className="mt-12 px-8 py-3 rounded-full text-sm font-medium tracking-wide text-white bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(var(--primary),0.5)] transition-all duration-300 pointer-events-auto group relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2 }}
                onClick={() => setIntroComplete(true)}
              >
                <span className="relative z-10">Explore My Universe</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

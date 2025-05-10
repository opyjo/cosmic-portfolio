"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Linkedin, Github, Twitter } from "lucide-react"
import type { JSX } from "react"

interface SocialLink {
  name: string
  url: string
  icon: JSX.Element
  color: string
}

export default function SocialSection() {
  const [activeLink, setActiveLink] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [animationComplete, setAnimationComplete] = useState(false)

  // Social media links
  const socialLinks: SocialLink[] = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/opeyemi-ojo-86649629/",
      icon: <Linkedin className="w-6 h-6" />,
      color: "from-blue-400 to-blue-600",
    },
    {
      name: "Twitter",
      url: "https://x.com/opyjo",
      icon: <Twitter className="w-6 h-6" />,
      color: "from-sky-400 to-sky-600",
    },
    {
      name: "GitHub",
      url: "https://github.com/opyjo",
      icon: <Github className="w-6 h-6" />,
      color: "from-purple-400 to-purple-600",
    },
  ]

  // Trigger initial animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true)
    }, 2000) // After initial animations

    return () => clearTimeout(timer)
  }, [])

  return (
    <div ref={containerRef} className="space-y-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-light tracking-wider border-b border-white/10 pb-2"
      >
        Connect With Me
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-white/80 mb-16"
      >
        <p className="text-center">Explore my online presence and connect with me across these platforms.</p>
      </motion.div>

      {/* Cosmic Portal Animation - moved down with more spacing */}
      <div className="relative flex justify-center items-center py-20 mt-10">
        <motion.div
          className="absolute w-40 h-40 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-xl"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.5, 1], opacity: [0, 0.3, 0.2] }}
          transition={{ duration: 1.5 }}
        />

        {/* Orbiting Social Icons - adjusted size and positioning */}
        <div className="relative w-64 h-64 mt-4">
          {socialLinks.map((social, index) => {
            // Adjust angles to position icons away from the top text
            // Start from bottom and go around, skipping the top area
            const startAngle = Math.PI / 2 // Start from bottom
            const angle = startAngle + (index * (2 * Math.PI - Math.PI / 2)) / socialLinks.length
            const delay = index * 0.1

            return (
              <motion.div
                key={social.name}
                className="absolute"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                }}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  x: Math.cos(angle) * 120,
                  y: Math.sin(angle) * 120,
                  scale: 1,
                  opacity: 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  delay: delay,
                }}
              >
                <motion.div
                  className="relative w-full h-full cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setActiveLink(social.name)}
                  onHoverEnd={() => setActiveLink(null)}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-br opacity-80"
                    style={
                      {
                        background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                        "--tw-gradient-from": social.color.split(" ")[0].replace("from-", ""),
                        "--tw-gradient-to": social.color.split(" ")[1].replace("to-", ""),
                      } as any
                    }
                    initial={{ opacity: 0.5 }}
                    animate={{
                      opacity: activeLink === social.name ? 0.9 : 0.7,
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      opacity: { duration: 0.3 },
                      scale: {
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        duration: 2 + index * 0.5,
                      },
                    }}
                  />

                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm z-10"
                    aria-label={social.name}
                    onClick={(e) => {
                      // Ensure the link opens in a new tab
                      window.open(social.url, "_blank", "noopener,noreferrer")
                      e.preventDefault() // Prevent default to ensure our custom handling works
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, rotateY: 90 }}
                      animate={{ opacity: 1, rotateY: 0 }}
                      transition={{ delay: delay + 0.3, duration: 0.5 }}
                    >
                      {social.icon}
                    </motion.div>
                  </a>

                  {/* Orbital path */}
                  <motion.div
                    className="absolute -inset-2 rounded-full border border-white/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: activeLink === social.name ? 0.5 : 0.2 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Name label */}
                  <AnimatePresence>
                    {activeLink === social.name && (
                      <motion.div
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-sm whitespace-nowrap z-20"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {social.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            )
          })}

          {/* Central star */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.5, 1],
              opacity: [0, 0.9, 0.7],
              boxShadow: [
                "0 0 0 0 rgba(255, 255, 255, 0)",
                "0 0 20px 10px rgba(255, 255, 255, 0.5)",
                "0 0 10px 5px rgba(255, 255, 255, 0.3)",
              ],
            }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="w-full h-full rounded-full bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300"
              animate={{
                rotate: 360,
                background: [
                  "linear-gradient(to right, #93c5fd, #c4b5fd, #f9a8d4)",
                  "linear-gradient(to right, #f9a8d4, #93c5fd, #c4b5fd)",
                  "linear-gradient(to right, #c4b5fd, #f9a8d4, #93c5fd)",
                ],
              }}
              transition={{
                rotate: { repeat: Number.POSITIVE_INFINITY, duration: 20, ease: "linear" },
                background: { repeat: Number.POSITIVE_INFINITY, duration: 5, ease: "linear" },
              }}
            />
          </motion.div>

          {/* Particles */}
          {animationComplete &&
            Array.from({ length: 15 }).map((_, i) => {
              const angle = Math.random() * Math.PI * 2
              const distance = 30 + Math.random() * 100
              const size = 1 + Math.random() * 2
              const duration = 3 + Math.random() * 7
              const delay = Math.random() * 2

              return (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute top-1/2 left-1/2 rounded-full bg-white"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                  }}
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 0,
                  }}
                  animate={{
                    x: [0, Math.cos(angle) * distance],
                    y: [0, Math.sin(angle) * distance],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: duration,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: delay,
                    ease: "easeOut",
                  }}
                />
              )
            })}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        className="text-center text-white/60 text-sm mt-8"
      >
        <p>Click on any platform to connect with me</p>
      </motion.div>
    </div>
  )
}

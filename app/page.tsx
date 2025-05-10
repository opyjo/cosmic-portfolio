"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ConstellationBackground from "@/components/constellation-background"
import AboutSection from "@/components/about-section"
import WorkSection from "@/components/work-section"
import SkillsSection from "@/components/skills-section"
import ContactSection from "@/components/contact-section"
import SideProjectsSection from "@/components/side-projects-section"
import ParticleEffect from "@/components/particle-effect"
import HeroSection from "@/components/hero-section"
import BlogTransition from "@/components/blog-transition"
import CometCursor from "@/components/comet-cursor"
import SocialSection from "@/components/social-section"

export default function Home() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [hoveredConstellation, setHoveredConstellation] = useState<string | null>(null)
  const [introComplete, setIntroComplete] = useState(false)
  const [showConstellations, setShowConstellations] = useState(false)
  const [showBlogTransition, setShowBlogTransition] = useState(false)
  const mainRef = useRef<HTMLDivElement>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Update the sections array to replace resume with side-projects
  const sections = [
    { id: "about", name: "About", position: { x: 20, y: 30 } },
    { id: "work", name: "Work", position: { x: 50, y: 30 } },
    { id: "skills", name: "Skills", position: { x: 80, y: 30 } },
    { id: "blog", name: "Blog", position: { x: 20, y: 70 } },
    { id: "social", name: "Social", position: { x: 50, y: 70 } },
    { id: "side-projects", name: "Side-Projects", position: { x: 20, y: 50 } },
    { id: "contact", name: "Contact", position: { x: 80, y: 70 } },
  ]

  // Update the handleConstellationClick function to handle the blog link with transition
  const handleConstellationClick = (sectionId: string) => {
    if (sectionId === "blog") {
      setShowBlogTransition(true)
    } else {
      setActiveSection(activeSection === sectionId ? null : sectionId)
    }
  }

  // Handle blog transition completion
  const handleBlogTransitionComplete = () => {
    window.open("https://opyjo2.hashnode.dev/", "_blank")
    setShowBlogTransition(false)
  }

  // Throttled hover handler
  const handleConstellationHover = (sectionId: string | null) => {
    if (hoveredConstellation !== sectionId) {
      setHoveredConstellation(sectionId)
    }
  }

  // Close active section when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mainRef.current && !mainRef.current.contains(e.target as Node)) {
        setActiveSection(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Set initial load to false after animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Handle intro animation sequence
  useEffect(() => {
    if (isInitialLoad) return

    // After initial load, start intro sequence
    const introTimer = setTimeout(() => {
      setIntroComplete(true)

      // After intro completes, show constellations
      const constellationsTimer = setTimeout(() => {
        setShowConstellations(true)
      }, 1000)

      return () => clearTimeout(constellationsTimer)
    }, 3500)

    return () => clearTimeout(introTimer)
  }, [isInitialLoad])

  return (
    <main ref={mainRef} className="relative h-screen w-full overflow-hidden bg-black text-white">
      <ConstellationBackground
        activeConstellation={hoveredConstellation || activeSection}
        constellations={sections}
        isInitialLoad={isInitialLoad}
      />
      <ParticleEffect />
      <CometCursor />

      {/* Blog Transition Animation */}
      <BlogTransition isActive={showBlogTransition} onAnimationComplete={handleBlogTransitionComplete} />

      {/* Hero Section */}
      <HeroSection introComplete={introComplete} setIntroComplete={setIntroComplete} activeSection={activeSection} />

      {/* Navigation Constellations */}
      <AnimatePresence>
        {showConstellations && !activeSection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-20"
          >
            {sections.map((section) => (
              <motion.div
                key={section.id}
                className="absolute cursor-pointer"
                style={{
                  left: `${section.position.x}%`,
                  top: `${section.position.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: Math.random() * 0.5, // Random delay for each constellation
                }}
                whileHover={{ scale: 1.1 }}
                onClick={() => handleConstellationClick(section.id)}
                onMouseEnter={() => handleConstellationHover(section.id)}
                onMouseLeave={() => handleConstellationHover(null)}
              >
                <div className="relative">
                  <div
                    className={`w-3 h-3 rounded-full bg-white ${
                      hoveredConstellation === section.id || activeSection === section.id ? "opacity-100" : "opacity-50"
                    }`}
                  ></div>
                  <motion.div
                    className="absolute -inset-2 rounded-full border border-white/20"
                    initial={{ scale: 1, opacity: 0.2 }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                    }}
                  ></motion.div>
                  <motion.p
                    className="absolute mt-4 left-1/2 -translate-x-1/2 text-xs md:text-sm font-light tracking-wider whitespace-nowrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredConstellation === section.id || activeSection === section.id ? 1 : 0.6 }}
                  >
                    {section.name}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Sections - Only render the active section */}
      <AnimatePresence mode="wait">
        {activeSection && (
          <motion.div
            key={activeSection}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-30 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-black/60 backdrop-blur-md rounded-lg p-6 md:p-10 max-w-4xl w-[90%] max-h-[80vh] overflow-y-auto"
            >
              <button
                onClick={() => setActiveSection(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white"
              >
                <span className="sr-only">Close</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              {activeSection === "about" && <AboutSection />}
              {activeSection === "work" && <WorkSection />}
              {activeSection === "skills" && <SkillsSection />}
              {activeSection === "social" && <SocialSection />}
              {activeSection === "side-projects" && <SideProjectsSection />}
              {activeSection === "contact" && <ContactSection />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

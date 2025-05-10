"use client"

import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"

export default function AboutSection() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [timelineRendered, setTimelineRendered] = useState(false)

  useEffect(() => {
    if (!svgRef.current || timelineRendered) return

    const renderTimeline = () => {
      const svg = d3.select(svgRef.current)
      const width = svgRef.current.clientWidth
      const height = 120

      // Clear previous elements
      svg.selectAll("*").remove()

      // Create a timeline
      const timelineData = [
        { year: 2018, label: "Started Career" },
        { year: 2020, label: "CRA" },
        { year: 2023, label: "Bell" },
        { year: 2025, label: "Present" },
      ]

      const xScale = d3
        .scaleLinear()
        .domain([2018, 2025])
        .range([50, width - 50])

      // Draw the line
      svg
        .append("line")
        .attr("x1", xScale(2018))
        .attr("y1", height / 2)
        .attr("x2", xScale(2025))
        .attr("y2", height / 2)
        .attr("stroke", "rgba(255, 255, 255, 0.3)")
        .attr("stroke-width", 2)

      // Pre-calculate and batch DOM operations
      const timelinePoints = timelineData.map((d, i) => ({
        x: xScale(d.year),
        y: height / 2,
        year: d.year,
        label: d.label,
        delay: i * 300,
      }))

      // Create groups for each point
      const timelineGroup = svg
        .selectAll(".timeline-point")
        .data(timelinePoints)
        .enter()
        .append("g")
        .attr("class", "timeline-point")
        .attr("transform", (d) => `translate(${d.x}, ${d.y})`)

      // Add circles with animation
      timelineGroup
        .append("circle")
        .attr("r", 0)
        .attr("fill", "white")
        .transition()
        .duration(1000)
        .delay((d) => d.delay)
        .attr("r", 6)

      // Add year labels
      timelineGroup
        .append("text")
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .attr("fill", "rgba(255, 255, 255, 0.7)")
        .style("font-size", "12px")
        .text((d) => d.year)
        .style("opacity", 0)
        .transition()
        .duration(1000)
        .delay((d) => d.delay + 300)
        .style("opacity", 1)

      // Add description labels
      timelineGroup
        .append("text")
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .attr("fill", "rgba(255, 255, 255, 0.9)")
        .style("font-size", "12px")
        .text((d) => d.label)
        .style("opacity", 0)
        .transition()
        .duration(1000)
        .delay((d) => d.delay + 600)
        .style("opacity", 1)

      setTimelineRendered(true)
    }

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(renderTimeline)
  }, [timelineRendered])

  return (
    <div className="space-y-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-light tracking-wider border-b border-white/10 pb-2"
      >
        About Me
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4 text-sm md:text-base text-white/80"
      >
        <p>
          I'm Johnson Ojo, a proficient Front-End Developer with six years of experience in building high-performance,
          scalable web applications. I'm skilled in modern web technologies including JavaScript, TypeScript, Redux,
          React, NextJS, and HTML/CSS, with a strong focus on creating responsive and user-friendly interfaces.
        </p>

        <p>
          Experienced in agile methodologies and cross-functional teamwork, I consistently deliver projects with a keen
          eye for detail and maintainability. I have extensive knowledge in advanced React concepts and a deep
          understanding of web standards, including cross-browser compatibility and responsive design.
        </p>

        <div className="mt-8 mb-4">
          <h3 className="text-lg font-light mb-3">Career Timeline</h3>
          <svg ref={svgRef} width="100%" height="120"></svg>
        </div>

        <div className="pt-4">
          <h3 className="text-lg font-light mb-3">Highlight of Qualifications</h3>
          <ul className="space-y-3">
            {[
              "Knowledge of Agile development methodologies with deep understanding of iterative development",
              "Extensive knowledge in advanced React concepts, JavaScript, HTML5, and CSS",
              "In-depth understanding of web standards and responsive design",
              "Active collaboration with team members, contributing to project success through technical expertise",
              "Deep understanding of REST principles and experience with backend APIs",
              "Triage and manage issues and pull requests in GitHub repository",
            ].map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                className="flex items-start"
              >
                <span className="text-white/50 mr-2">•</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="pt-4">
          <p className="text-white/60 text-sm">
            <span className="text-white/80">Contact:</span> (437)-778-5339 | johnsonoojo@gmail.com
          </p>
        </div>
      </motion.div>
    </div>
  )
}

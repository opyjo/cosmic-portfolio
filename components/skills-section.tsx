"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import * as d3 from "d3"

const skills = [
  {
    category: "Frontend",
    items: [
      { name: "JavaScript (ES6+)", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "React", level: 95 },
      { name: "Next.js", level: 90 },
      { name: "HTML5", level: 95 },
      { name: "CSS3", level: 90 },
      { name: "Redux", level: 85 },
    ],
  },
  {
    category: "Tools & Methods",
    items: [
      { name: "Webpack", level: 80 },
      { name: "Babel", level: 75 },
      { name: "Git/GitHub", level: 85 },
      { name: "SASS/LESS", level: 80 },
      { name: "Jest", level: 75 },
      { name: "React Testing Library", level: 80 },
      { name: "Agile/Scrum", level: 85 },
    ],
  },
  {
    category: "Other Skills",
    items: [
      { name: "RESTful APIs", level: 85 },
      { name: "GraphQL", level: 70 },
      { name: "Performance Optimization", level: 80 },
      { name: "Responsive Design", level: 90 },
      { name: "Web Accessibility", level: 85 },
      { name: "Cross-Browser Compatibility", level: 85 },
      { name: "Figma/Adobe XD", level: 70 },
    ],
  },
]

// Simplified radar data for better performance
const radarData = [
  { axis: "JavaScript", value: 0.95 },
  { axis: "React", value: 0.95 },
  { axis: "TypeScript", value: 0.9 },
  { axis: "Next.js", value: 0.9 },
  { axis: "HTML/CSS", value: 0.92 },
  { axis: "Redux", value: 0.85 },
  { axis: "Testing", value: 0.78 },
  { axis: "API Integration", value: 0.85 },
]

export default function SkillsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const chartRef = useRef<SVGSVGElement>(null)
  const [chartRendered, setChartRendered] = useState(false)

  // Memoize chart rendering to prevent unnecessary re-renders
  useEffect(() => {
    if (!chartRef.current || !isInView || chartRendered) return

    const renderChart = () => {
      const svg = d3.select(chartRef.current)
      const width = chartRef.current.clientWidth
      const height = 300
      const radius = Math.min(width, height) / 2 - 40

      // Clear previous elements
      svg.selectAll("*").remove()

      const angleSlice = (Math.PI * 2) / radarData.length

      // Create the radar chart group
      const g = svg.append("g").attr("transform", `translate(${width / 2}, ${height / 2})`)

      // Draw the circular grid - reduce levels for better performance
      const levels = 4
      const gridGroup = g.append("g").attr("class", "grid-group")

      // Pre-calculate and batch DOM operations
      const circles = []
      for (let j = 0; j < levels; j++) {
        const levelFactor = radius * ((j + 1) / levels)
        circles.push({
          r: levelFactor,
          delay: j * 200,
        })
      }

      // Batch append circles
      gridGroup
        .selectAll(".level-circle")
        .data(circles)
        .enter()
        .append("circle")
        .attr("class", "level-circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 0)
        .attr("fill", "none")
        .attr("stroke", "rgba(255, 255, 255, 0.1)")
        .attr("stroke-width", 0.5)
        .transition()
        .duration(1000)
        .delay((d) => d.delay)
        .attr("r", (d) => d.r)

      // Pre-calculate axis data
      const axisData = radarData.map((d, i) => {
        const angle = angleSlice * i - Math.PI / 2
        return {
          x: radius * Math.cos(angle),
          y: radius * Math.sin(angle),
          textX: radius * 1.1 * Math.cos(angle),
          textY: radius * 1.1 * Math.sin(angle),
          textAnchor: i === 0 || i === radarData.length / 2 ? "middle" : i < radarData.length / 2 ? "start" : "end",
          label: d.axis,
          delay: i * 100 + 500,
        }
      })

      // Draw the axes in a batch
      const axisGroup = g.append("g").attr("class", "axis-group")

      // Batch append lines
      axisGroup
        .selectAll(".axis-line")
        .data(axisData)
        .enter()
        .append("line")
        .attr("class", "axis-line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", 0)
        .attr("stroke", "rgba(255, 255, 255, 0.2)")
        .attr("stroke-width", 0.5)
        .transition()
        .duration(1000)
        .delay((d) => d.delay)
        .attr("x2", (d) => d.x)
        .attr("y2", (d) => d.y)

      // Batch append text
      axisGroup
        .selectAll(".axis-text")
        .data(axisData)
        .enter()
        .append("text")
        .attr("class", "axis-text")
        .attr("x", (d) => d.textX)
        .attr("y", (d) => d.textY)
        .attr("text-anchor", (d) => d.textAnchor)
        .attr("dy", "0.35em")
        .attr("fill", "rgba(255, 255, 255, 0.7)")
        .style("font-size", "10px")
        .style("opacity", 0)
        .text((d) => d.label)
        .transition()
        .duration(500)
        .delay((d) => d.delay + 500)
        .style("opacity", 1)

      // Draw the radar chart path
      const radarLine = d3
        .lineRadial<{ axis: string; value: number }>()
        .radius((d) => d.value * radius)
        .angle((d, i) => i * angleSlice)
        .curve(d3.curveLinearClosed)

      // Create a clip path for animation
      const clipId = "radar-clip-" + Math.floor(Math.random() * 1000)

      svg
        .append("defs")
        .append("clipPath")
        .attr("id", clipId)
        .append("circle")
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .attr("r", 0)
        .transition()
        .duration(1500)
        .attr("r", radius + 10)

      // Draw the radar area
      g.append("path")
        .datum(radarData)
        .attr("clip-path", `url(#${clipId})`)
        .attr("d", radarLine as any)
        .attr("fill", "rgba(100, 150, 255, 0.2)")
        .attr("stroke", "rgba(100, 150, 255, 0.8)")
        .attr("stroke-width", 2)

      // Pre-calculate point data
      const pointData = radarData.map((d, i) => {
        const angle = angleSlice * i - Math.PI / 2
        return {
          x: d.value * radius * Math.cos(angle),
          y: d.value * radius * Math.sin(angle),
          delay: i * 100 + 1500,
        }
      })

      // Batch append points
      g.selectAll(".radar-point")
        .data(pointData)
        .enter()
        .append("circle")
        .attr("class", "radar-point")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", 0)
        .attr("fill", "rgba(100, 150, 255, 1)")
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .style("filter", "drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))")
        .transition()
        .duration(500)
        .delay((d) => d.delay)
        .attr("r", 4)

      setChartRendered(true)
    }

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(renderChart)
  }, [isInView, chartRendered])

  return (
    <div ref={containerRef} className="space-y-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-light tracking-wider border-b border-white/10 pb-2"
      >
        Skills & Expertise
      </motion.h2>

      <div className="flex justify-center mb-8">
        <svg ref={chartRef} width="100%" height="300"></svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {skills.map((skillGroup, groupIndex) => (
          <motion.div
            key={groupIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 + groupIndex * 0.1 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-light border-b border-white/10 pb-1">{skillGroup.category}</h3>
            <div className="space-y-3">
              {skillGroup.items.map((skill, skillIndex) => (
                <motion.div
                  key={skillIndex}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.4 + skillIndex * 0.05 }}
                  className="space-y-1"
                >
                  <div className="flex justify-between text-sm">
                    <span>{skill.name}</span>
                    <span className="text-white/50">{skill.level}%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-400 to-indigo-500"
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${skill.level}%` } : {}}
                      transition={{ duration: 1, delay: 0.5 + skillIndex * 0.1 }}
                    ></motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

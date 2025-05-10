"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import * as d3 from "d3"

const workExperience = [
  {
    company: "Bell",
    location: "Mississauga, Ontario",
    period: "Jan 2023 - Present",
    title: "Software Engineer",
    achievements: [
      "Played a pivotal role in the development of the Unified Promocodes Management application, leading to 30% increase in promotional code efficiency",
      "Facilitated a 20% improvement in cross-functional team collaboration by aligning front-end functionalities with overall system architecture",
      "Spearheaded the implementation of playwright for end-to-end testing, resulting in a 40% improvement in testing speed",
      "Managed the build process for front-end assets using Webpack, optimizing application for maximum speed and scalability",
      "Utilized Next.js for server-side rendering and static site generation, enhancing SEO and load times for content-rich websites",
    ],
  },
  {
    company: "Canada Revenue Agency",
    location: "Hamilton, Ontario",
    period: "Oct 2020 - Dec 2022",
    title: "Front End Developer",
    achievements: [
      "Successfully drove multiple projects from concept to deployment, demonstrating proficiency in each stage of the software development lifecycle",
      "Delivered features with a high standard of quality, implementing robust testing protocols. Reduced bug rates by 30%",
      "Consistently applied engineering best practices throughout development, resulting in maintainable, reliable, and secure systems",
      "Experienced with applying fixes, patches, and upgrades from the product vendor",
      "Actively participated in agile sprints and technical planning, demonstrating strong teamwork and communication skills",
    ],
  },
  {
    company: "Genpact",
    location: "Mississauga, ON",
    period: "Jan 2018 - Sept 2020",
    title: "Junior Front-End Developer",
    achievements: [
      "Spearheaded the redesign of our main web application to be fully responsive, leading to a 40% increase in mobile user engagement",
      "Focused on optimizing page load times and overall web performance, improving the site's performance score by 35%",
      "Led the effort to make our web applications compatible across all major browsers, resulting in a 15% rise in user accessibility",
      "Possess strong knowledge of operating systems, middleware, and other technologies for building enterprise solutions",
      "Developed and integrated multiple RESTful APIs and utilized AJAX for asynchronous data loading",
    ],
  },
]

export default function WorkSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const svgRef = useRef<SVGSVGElement>(null)
  const [graphRendered, setGraphRendered] = useState(false)

  useEffect(() => {
    if (!svgRef.current || !isInView || graphRendered) return

    const renderGraph = () => {
      const svg = d3.select(svgRef.current)
      const width = svgRef.current.clientWidth
      const height = 80

      // Clear previous elements
      svg.selectAll("*").remove()

      // Create data for contribution graph - reduce data points for better performance
      const now = new Date()
      const startDate = new Date(now)
      startDate.setDate(startDate.getDate() - 365) // Last year

      // Generate data more efficiently - use fewer data points
      const weeksCount = 52
      const daysPerWeek = 7
      const data = []

      for (let week = 0; week < weeksCount; week++) {
        for (let day = 0; day < daysPerWeek; day++) {
          // Only include every other day to reduce data points
          if ((week + day) % 2 === 0) {
            const date = new Date(startDate)
            date.setDate(date.getDate() + week * 7 + day)
            data.push({
              date,
              count: Math.floor(Math.random() * 5), // Random contribution count
              week,
              day,
            })
          }
        }
      }

      // Create scales
      const colorScale = d3.scaleSequential().domain([0, 4]).interpolator(d3.interpolateBlues)

      // Draw cells
      const cellSize = 10
      const cellPadding = 2

      // Batch append cells
      svg
        .selectAll(".contribution-cell")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "contribution-cell")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", (d) => d.week * (cellSize + cellPadding))
        .attr("y", (d) => d.day * (cellSize + cellPadding))
        .attr("rx", 2)
        .attr("ry", 2)
        .attr("fill", "rgba(255, 255, 255, 0.1)")
        .transition()
        .duration(1000)
        .delay((d, i) => i * 5) // Faster delay
        .attr("fill", (d) => colorScale(d.count))

      // Add month labels - reduce number of labels
      const months = d3.timeMonth.range(startDate, now, 2) // Every other month

      svg
        .selectAll(".month-label")
        .data(months)
        .enter()
        .append("text")
        .attr("class", "month-label")
        .attr("x", (d) => {
          const weekIndex = Math.floor(d3.timeDay.count(startDate, d) / 7)
          return weekIndex * (cellSize + cellPadding)
        })
        .attr("y", height - 5)
        .attr("text-anchor", "start")
        .attr("fill", "rgba(255, 255, 255, 0.6)")
        .style("font-size", "9px")
        .text((d) => d3.timeFormat("%b")(d))
        .style("opacity", 0)
        .transition()
        .duration(1000)
        .delay((_, i) => i * 200 + 1000)
        .style("opacity", 1)

      setGraphRendered(true)
    }

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(renderGraph)
  }, [isInView, graphRendered])

  return (
    <div ref={containerRef} className="space-y-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-light tracking-wider border-b border-white/10 pb-2"
      >
        Work Experience
      </motion.h2>

      <div className="mb-6">
        <h3 className="text-lg font-light mb-2">Contribution Activity</h3>
        <svg ref={svgRef} width="100%" height="80"></svg>
      </div>

      <div className="space-y-8">
        {workExperience.map((job, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            className="border-l-2 border-white/20 pl-4 relative"
          >
            <div className="absolute w-3 h-3 bg-white rounded-full -left-[7px] top-1"></div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
              <h3 className="text-lg font-light">{job.company}</h3>
              <p className="text-white/60 text-sm">{job.period}</p>
            </div>
            <p className="text-white/80 mb-1">
              {job.title} | {job.location}
            </p>
            <ul className="mt-3 space-y-2">
              {job.achievements.map((achievement, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 + i * 0.05 }}
                  className="text-sm text-white/70 flex items-start"
                >
                  <span className="text-white/50 mr-2">•</span>
                  <span>{achievement}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

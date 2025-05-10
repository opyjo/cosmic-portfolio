"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import * as d3 from "d3"

// Pre-defined nodes and links for better performance
const nodes = [
  { id: "Computer Science", group: 1, size: 25 },
  { id: "Programming", group: 1, size: 20 },
  { id: "Web Development", group: 1, size: 22 },
  { id: "Algorithms", group: 1, size: 18 },
  { id: "Data Structures", group: 1, size: 18 },
  { id: "UI/UX", group: 2, size: 20 },
  { id: "Design Principles", group: 2, size: 18 },
  { id: "User Research", group: 2, size: 16 },
  { id: "Prototyping", group: 2, size: 15 },
  { id: "Software Engineering", group: 3, size: 22 },
  { id: "Agile", group: 3, size: 18 },
  { id: "Testing", group: 3, size: 16 },
  { id: "DevOps", group: 3, size: 15 },
]

const links = [
  { source: "Computer Science", target: "Programming", value: 1 },
  { source: "Computer Science", target: "Algorithms", value: 1 },
  { source: "Computer Science", target: "Data Structures", value: 1 },
  { source: "Programming", target: "Web Development", value: 1 },
  { source: "Web Development", target: "UI/UX", value: 1 },
  { source: "UI/UX", target: "Design Principles", value: 1 },
  { source: "UI/UX", target: "User Research", value: 1 },
  { source: "UI/UX", target: "Prototyping", value: 1 },
  { source: "Computer Science", target: "Software Engineering", value: 1 },
  { source: "Software Engineering", target: "Agile", value: 1 },
  { source: "Software Engineering", target: "Testing", value: 1 },
  { source: "Software Engineering", target: "DevOps", value: 1 },
]

export default function EducationSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  const svgRef = useRef<SVGSVGElement>(null)
  const [graphRendered, setGraphRendered] = useState(false)
  const simulationRef = useRef<d3.Simulation<any, any> | null>(null)

  // Memoize graph rendering to prevent unnecessary re-renders
  useEffect(() => {
    if (!svgRef.current || !isInView || graphRendered) return

    const renderGraph = () => {
      const svg = d3.select(svgRef.current)
      const width = svgRef.current.clientWidth
      const height = 200

      // Clear previous elements
      svg.selectAll("*").remove()

      // Create a color scale
      const color = d3.scaleOrdinal<number, string>().domain([1, 2, 3]).range(["#4f83cc", "#7c43bd", "#3a9fbf"])

      // Create the force simulation with optimized parameters
      const simulation = d3
        .forceSimulation<any>()
        .force(
          "link",
          d3
            .forceLink()
            .id((d: any) => d.id)
            .distance(70),
        )
        .force("charge", d3.forceManyBody().strength(-80).distanceMax(150))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .alphaDecay(0.05) // Faster convergence

      simulationRef.current = simulation

      // Create the links
      const link = svg
        .append("g")
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("stroke", "rgba(255, 255, 255, 0.2)")
        .attr("stroke-width", 1)
        .attr("opacity", 0)

      // Create the nodes
      const node = svg
        .append("g")
        .selectAll("g")
        .data(nodes)
        .enter()
        .append("g")
        .call(d3.drag<any, any>().on("start", dragstarted).on("drag", dragged).on("end", dragended))

      // Add circles to nodes
      node
        .append("circle")
        .attr("r", 0)
        .attr("fill", (d: any) => color(d.group))
        .attr("stroke", "white")
        .attr("stroke-width", 0.5)
        .style("filter", "drop-shadow(0 0 3px rgba(0, 0, 0, 0.3))")
        .transition()
        .duration(1000)
        .delay((_, i) => i * 100)
        .attr("r", (d: any) => d.size / 3)

      // Add labels to nodes - only for larger nodes to reduce DOM elements
      node
        .filter((d: any) => d.size > 18) // Only add text to larger nodes
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", 3)
        .attr("fill", "white")
        .style("font-size", "8px")
        .style("pointer-events", "none")
        .style("opacity", 0)
        .text((d: any) => d.id)
        .transition()
        .duration(500)
        .delay((_, i) => i * 100 + 500)
        .style("opacity", 1)

      // Fade in links after a delay
      setTimeout(() => {
        link.transition().duration(1000).attr("opacity", 1)
      }, 500)

      // Update positions during simulation
      simulation.nodes(nodes).on("tick", ticked)

      simulation.force<d3.ForceLink<any, any>>("link")!.links(links)

      function ticked() {
        // Update link positions directly without transitions
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y)

        // Update node positions directly without transitions
        node.attr("transform", (d) => `translate(${d.x},${d.y})`)
      }

      function dragstarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        event.subject.fx = event.subject.x
        event.subject.fy = event.subject.y
      }

      function dragged(event: any) {
        event.subject.fx = event.x
        event.subject.fy = event.y
      }

      function dragended(event: any) {
        if (!event.active) simulation.alphaTarget(0)
        event.subject.fx = null
        event.subject.fy = null
      }

      // Stop simulation after it stabilizes to save CPU
      setTimeout(() => {
        simulation.alphaTarget(0).stop()
      }, 3000)

      setGraphRendered(true)
    }

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(renderGraph)

    return () => {
      // Clean up simulation when component unmounts
      if (simulationRef.current) {
        simulationRef.current.stop()
      }
    }
  }, [isInView, graphRendered])

  return (
    <div ref={containerRef} className="space-y-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-light tracking-wider border-b border-white/10 pb-2"
      >
        Education & Training
      </motion.h2>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/5 rounded-lg p-4"
        >
          <h3 className="text-lg font-light">Diploma in Computer Programming</h3>
          <p className="text-white/70 text-sm">Algonquin College, Ottawa</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/5 rounded-lg p-4"
        >
          <h3 className="text-lg font-light">Bachelor of Science</h3>
          <p className="text-white/70 text-sm">Obafemi Awolowo University</p>
        </motion.div>

        <div className="mt-8">
          <h3 className="text-lg font-light mb-4">Knowledge Graph</h3>
          <p className="text-sm text-white/70 mb-4">
            Interactive visualization of educational focus areas (drag nodes to explore)
          </p>
          <div className="bg-black/30 rounded-lg p-2">
            <svg ref={svgRef} width="100%" height="200"></svg>
          </div>
        </div>
      </div>
    </div>
  )
}

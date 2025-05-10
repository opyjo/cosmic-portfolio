"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Send, Mail, Github, Linkedin, Twitter } from "lucide-react";
import * as d3 from "d3";
import emailjs from "emailjs-com";

export default function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const svgRef = useRef<SVGSVGElement>(null);
  const [waveRendered, setWaveRendered] = useState(false);
  const animationRef = useRef<number>();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
        {
          from_name: formState.name,
          from_email: formState.email,
          message: formState.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string
      );
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormState({ name: "", email: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      setIsSubmitting(false);
      alert("Failed to send message. Please try again.");
    }
  };

  useEffect(() => {
    if (!svgRef.current || !isInView || waveRendered) return;

    const renderWave = () => {
      const svg = d3.select(svgRef.current);
      const width = svgRef.current.clientWidth;
      const height = 100;

      // Clear previous elements
      svg.selectAll("*").remove();

      // Create gradient
      const gradient = svg
        .append("defs")
        .append("linearGradient")
        .attr("id", "contactGradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0)
        .attr("y1", height / 2)
        .attr("x2", width)
        .attr("y2", height / 2);

      gradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#4f83cc");
      gradient
        .append("stop")
        .attr("offset", "50%")
        .attr("stop-color", "#7c43bd");
      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#3a9fbf");

      // Create a wave animation with fewer points for better performance
      const pointCount = 25; // Reduced from 50
      const waveData = Array.from({ length: pointCount }, (_, i) => ({
        x: i * (width / pointCount),
        y: height / 2,
      }));

      const line = d3
        .line<{ x: number; y: number }>()
        .x((d) => d.x)
        .y((d) => d.y)
        .curve(d3.curveBasis);

      const path = svg
        .append("path")
        .datum(waveData)
        .attr("fill", "none")
        .attr("stroke", "url(#contactGradient)")
        .attr("stroke-width", 2)
        .attr("d", line);

      // Animate the wave more efficiently
      let phase = 0;
      let lastFrameTime = 0;

      const animateWave = (timestamp: number) => {
        // Throttle to ~30fps for better performance
        if (timestamp - lastFrameTime < 33) {
          animationRef.current = requestAnimationFrame(animateWave);
          return;
        }

        lastFrameTime = timestamp;
        phase += 0.1;

        waveData.forEach((d, i) => {
          d.y = height / 2 + Math.sin(phase + i * 0.2) * 15;
        });

        path.attr("d", line);

        animationRef.current = requestAnimationFrame(animateWave);
      };

      animationRef.current = requestAnimationFrame(animateWave);
      setWaveRendered(true);
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(renderWave);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isInView, waveRendered]);

  return (
    <div ref={containerRef} className="space-y-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-light tracking-wider border-b border-white/10 pb-2"
      >
        Contact
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <p className="text-white/80">
            Interested in working together? Feel free to reach out through the
            form or connect with me directly.
          </p>

          <div className="space-y-3 pt-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-white/50" />
              <a
                href="mailto:johnsonoojo@gmail.com"
                className="hover:text-white/90 transition-colors"
              >
                johnsonoojo@gmail.com
              </a>
            </div>

            <div className="flex items-center space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/50"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>(437)-778-5339</span>
            </div>

            <div className="flex space-x-4 pt-2">
              <a
                href="https://github.com/opyjo"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/opeyemi-ojo-86649629/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/opyjo"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-white/10 hover:bg-white/10 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="pt-6">
            <svg ref={svgRef} width="100%" height="100"></svg>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full flex items-center justify-center text-center p-6 border border-white/10 rounded-lg"
            >
              <div className="space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-white/10 flex items-center justify-center">
                  <Send className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-light">Message Sent!</h3>
                <p className="text-white/70">
                  Thank you for reaching out. I'll get back to you soon.
                </p>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm text-white/70 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-white/30 text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm text-white/70 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-white/30 text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm text-white/70 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-white/30 text-white resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-md transition-colors duration-300 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}

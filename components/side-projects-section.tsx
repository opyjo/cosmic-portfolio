"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  ExternalLink,
  Github,
  Code,
  Layers,
  Zap,
  Cpu,
  BookOpen,
  Users,
  Brain,
} from "lucide-react";
import type { JSX } from "react";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  image: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  icon: JSX.Element;
  color: string;
}

export default function SideProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [activeFilter, setActiveFilter] = useState<"all" | "featured">("all");
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  // Real side projects data
  const projects: Project[] = [
    {
      title: "FocusFlow",
      description:
        "A productivity and focus management app to help users stay on track and achieve deep work.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      image: "/focusflow.png",
      liveUrl: "https://focus-flow-zeta.vercel.app/",
      featured: true,
      icon: <Zap className="w-5 h-5" />, // Lightning for focus
      color: "from-purple-500 to-indigo-600",
    },
    {
      title: "Meeting Document/Visualizer (MeetMetrixs)",
      description:
        "A tool for creating, visualizing, and exporting meeting notes and insights.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "D3.js"],
      image: "/meetmetrixs.png",
      liveUrl: "https://www.meetmetrixs.com/",
      featured: true,
      icon: <Layers className="w-5 h-5" />, // Layers for documents/visualization
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Kids Learn Coding",
      description:
        "An open-source platform to help kids learn programming through interactive lessons and games.",
      technologies: ["React", "TypeScript", "Firebase", "Tailwind CSS"],
      image: "/kids-learn-coding.png",
      githubUrl: "https://github.com/opyjo/KidsLearnCoding",
      featured: true,
      icon: <BookOpen className="w-5 h-5" />, // Book for learning
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Scrum-Poker",
      description:
        "A collaborative estimation tool for agile teams to play planning poker online.",
      technologies: ["React", "TypeScript", "Socket.io", "Tailwind CSS"],
      image: "/scrum-poker.png",
      githubUrl: "https://github.com/opyjo/scrum-poker",
      featured: true,
      icon: <Users className="w-5 h-5" />, // Users for team collaboration
      color: "from-pink-500 to-fuchsia-600",
    },
    {
      title: "Programming Quiz App",
      description:
        "A quiz application to test and improve your programming knowledge.",
      technologies: ["React", "TypeScript", "Redux", "Tailwind CSS"],
      image: "/programming-quiz.png",
      githubUrl: "https://github.com/opyjo/programming-quiz-app",
      featured: false,
      icon: <Brain className="w-5 h-5" />, // Brain for quiz/knowledge
      color: "from-yellow-500 to-orange-600",
    },
  ];

  // Filter projects based on active filter
  const filteredProjects = projects.filter(
    (project) => activeFilter === "all" || project.featured
  );

  return (
    <div ref={containerRef} className="space-y-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-light tracking-wider border-b border-white/10 pb-2"
      >
        Side Projects
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-white/80 mb-6"
      >
        <p>
          A collection of personal projects I've built to explore new
          technologies and ideas.
        </p>
      </motion.div>

      {/* Filter buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex space-x-4 mb-8"
      >
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
            activeFilter === "all"
              ? "bg-white/20 text-white"
              : "bg-transparent border border-white/20 text-white/70 hover:bg-white/10"
          }`}
        >
          All Projects
        </button>
        <button
          onClick={() => setActiveFilter("featured")}
          className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
            activeFilter === "featured"
              ? "bg-white/20 text-white"
              : "bg-transparent border border-white/20 text-white/70 hover:bg-white/10"
          }`}
        >
          Featured
        </button>
      </motion.div>

      {/* Projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
            onMouseEnter={() => setHoveredProject(project.title)}
            onMouseLeave={() => setHoveredProject(null)}
          >
            {/* Project image */}
            <div className="h-48 overflow-hidden">
              <motion.div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${project.image})` }}
                initial={{ scale: 1 }}
                animate={{ scale: hoveredProject === project.title ? 1.05 : 1 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Project icon */}
            <div
              className={`absolute top-4 right-4 p-2 rounded-full bg-gradient-to-br ${project.color} shadow-lg`}
            >
              {project.icon}
            </div>

            {/* Project content */}
            <div className="p-5">
              <h3 className="text-xl font-medium mb-2">{project.title}</h3>
              <p className="text-white/70 text-sm mb-4">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/80"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex justify-end space-x-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label={`GitHub repository for ${project.title}`}
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label={`Live demo for ${project.title}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Hover effect overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: hoveredProject === project.title ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Empty state if no projects match filter */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10"
        >
          <p className="text-white/60">No projects match the current filter.</p>
        </motion.div>
      )}

      {/* More projects coming soon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center mt-8 pt-4 border-t border-white/10"
      >
        <p className="text-white/60 text-sm">More projects coming soon...</p>
      </motion.div>
    </div>
  );
}

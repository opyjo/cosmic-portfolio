"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { ChevronDown, ChevronUp, ExternalLink, Mail, Phone, MapPin } from "lucide-react"

export default function ResumeSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const resumeRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true })
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    experience: true,
    education: true,
    skills: true,
    projects: true,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div ref={containerRef} className="space-y-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-light tracking-wider border-b border-white/10 pb-2"
      >
        Interactive Resume
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-6"
      >
        <div
          ref={resumeRef}
          className="bg-black/30 backdrop-blur-sm rounded-lg p-6 md:p-8 border border-white/10 transition-all duration-300"
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-light tracking-wider mb-2">JOHNSON OJO</h1>
            <p className="text-white/80 mb-3">Frontend Engineer</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-white/70">
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span>johnsonoojo@gmail.com</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>(437)-778-5339</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>Mississauga, Ontario</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6">
            <p className="text-white/90 leading-relaxed">
              Proficient Front-End Developer with six years of experience in building high-performance, scalable web
              applications. Skilled in modern web technologies including JavaScript, TypeScript, Redux, React, NextJS,
              and HTML/CSS, with a strong focus on creating responsive and user-friendly interfaces.
            </p>
          </div>

          {/* Experience Section */}
          <div className="mb-6">
            <div
              className="flex justify-between items-center mb-3 pb-1 border-b border-white/20 cursor-pointer"
              onClick={() => toggleSection("experience")}
            >
              <h2 className="text-xl font-light">Professional Experience</h2>
              <button className="p-1 rounded-full hover:bg-white/10 transition-colors pdf-hide">
                {expandedSections.experience ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {expandedSections.experience && (
              <div className="space-y-6 transition-all duration-300">
                {/* Bell */}
                <div className="group relative pl-5 border-l border-white/20">
                  <div className="absolute w-3 h-3 bg-white/80 rounded-full -left-[6.5px] top-1.5"></div>
                  <div className="mb-1 flex flex-col md:flex-row md:justify-between md:items-center">
                    <h3 className="text-lg font-medium">Software Engineer</h3>
                    <p className="text-white/70 text-sm">Jan 2023 - Present</p>
                  </div>
                  <p className="text-white/80 mb-2">Bell | Mississauga, Ontario</p>
                  <ul className="mt-2 space-y-1.5">
                    <li className="text-sm text-white/70 flex items-start">
                      <span className="text-white/50 mr-2">•</span>
                      <span>
                        Played a pivotal role in the development of the Unified Promocodes Management application,
                        leading to 30% increase in promotional code efficiency
                      </span>
                    </li>
                    <li className="text-sm text-white/70 flex items-start">
                      <span className="text-white/50 mr-2">•</span>
                      <span>
                        Facilitated a 20% improvement in cross-functional team collaboration by aligning front-end
                        functionalities with overall system architecture
                      </span>
                    </li>
                    <li className="text-sm text-white/70 flex items-start">
                      <span className="text-white/50 mr-2">•</span>
                      <span>
                        Spearheaded the implementation of playwright for end-to-end testing, resulting in a 40%
                        improvement in testing speed
                      </span>
                    </li>
                  </ul>
                </div>

                {/* CRA */}
                <div className="group relative pl-5 border-l border-white/20">
                  <div className="absolute w-3 h-3 bg-white/80 rounded-full -left-[6.5px] top-1.5"></div>
                  <div className="mb-1 flex flex-col md:flex-row md:justify-between md:items-center">
                    <h3 className="text-lg font-medium">Front End Developer</h3>
                    <p className="text-white/70 text-sm">Oct 2020 - Dec 2022</p>
                  </div>
                  <p className="text-white/80 mb-2">Canada Revenue Agency | Hamilton, Ontario</p>
                  <ul className="mt-2 space-y-1.5">
                    <li className="text-sm text-white/70 flex items-start">
                      <span className="text-white/50 mr-2">•</span>
                      <span>
                        Successfully drove multiple projects from concept to deployment, demonstrating proficiency in
                        each stage of the software development lifecycle
                      </span>
                    </li>
                    <li className="text-sm text-white/70 flex items-start">
                      <span className="text-white/50 mr-2">•</span>
                      <span>
                        Delivered features with a high standard of quality, implementing robust testing protocols.
                        Reduced bug rates by 30%
                      </span>
                    </li>
                    <li className="text-sm text-white/70 flex items-start">
                      <span className="text-white/50 mr-2">•</span>
                      <span>
                        Consistently applied engineering best practices throughout development, resulting in
                        maintainable, reliable, and secure systems
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Genpact */}
                <div className="group relative pl-5 border-l border-white/20">
                  <div className="absolute w-3 h-3 bg-white/80 rounded-full -left-[6.5px] top-1.5"></div>
                  <div className="mb-1 flex flex-col md:flex-row md:justify-between md:items-center">
                    <h3 className="text-lg font-medium">Junior Front-End Developer</h3>
                    <p className="text-white/70 text-sm">Jan 2018 - Sept 2020</p>
                  </div>
                  <p className="text-white/80 mb-2">Genpact | Mississauga, ON</p>
                  <ul className="mt-2 space-y-1.5">
                    <li className="text-sm text-white/70 flex items-start">
                      <span className="text-white/50 mr-2">•</span>
                      <span>
                        Spearheaded the redesign of our main web application to be fully responsive, leading to a 40%
                        increase in mobile user engagement
                      </span>
                    </li>
                    <li className="text-sm text-white/70 flex items-start">
                      <span className="text-white/50 mr-2">•</span>
                      <span>
                        Focused on optimizing page load times and overall web performance, improving the site's
                        performance score by 35%
                      </span>
                    </li>
                    <li className="text-sm text-white/70 flex items-start">
                      <span className="text-white/50 mr-2">•</span>
                      <span>
                        Led the effort to make our web applications compatible across all major browsers, resulting in a
                        15% rise in user accessibility
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Education Section */}
          <div className="mb-6">
            <div
              className="flex justify-between items-center mb-3 pb-1 border-b border-white/20 cursor-pointer"
              onClick={() => toggleSection("education")}
            >
              <h2 className="text-xl font-light">Education</h2>
              <button className="p-1 rounded-full hover:bg-white/10 transition-colors pdf-hide">
                {expandedSections.education ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {expandedSections.education && (
              <div className="space-y-4 transition-all duration-300">
                <div className="group hover:bg-white/5 p-3 rounded-md transition-colors">
                  <div className="mb-1 flex flex-col md:flex-row md:justify-between md:items-center">
                    <h3 className="text-lg font-medium">Diploma in Computer Programming</h3>
                    <p className="text-white/70 text-sm">2016 - 2018</p>
                  </div>
                  <p className="text-white/80">Algonquin College, Ottawa</p>
                </div>

                <div className="group hover:bg-white/5 p-3 rounded-md transition-colors">
                  <div className="mb-1 flex flex-col md:flex-row md:justify-between md:items-center">
                    <h3 className="text-lg font-medium">Bachelor of Science</h3>
                    <p className="text-white/70 text-sm">2010 - 2014</p>
                  </div>
                  <p className="text-white/80">Obafemi Awolowo University</p>
                </div>
              </div>
            )}
          </div>

          {/* Skills Section */}
          <div className="mb-6">
            <div
              className="flex justify-between items-center mb-3 pb-1 border-b border-white/20 cursor-pointer"
              onClick={() => toggleSection("skills")}
            >
              <h2 className="text-xl font-light">Technical Skills</h2>
              <button className="p-1 rounded-full hover:bg-white/10 transition-colors pdf-hide">
                {expandedSections.skills ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {expandedSections.skills && (
              <div className="transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-white/90 font-medium mb-2">Frontend</h3>
                    <div className="space-y-3">
                      {[
                        { name: "JavaScript (ES6+)", level: 95 },
                        { name: "TypeScript", level: 90 },
                        { name: "React", level: 95 },
                        { name: "Next.js", level: 90 },
                        { name: "HTML5/CSS3", level: 95 },
                      ].map((skill, index) => (
                        <div key={index} className="group space-y-1 hover:bg-white/5 p-1.5 rounded transition-colors">
                          <div className="flex justify-between text-sm">
                            <span>{skill.name}</span>
                            <span className="text-white/50">{skill.level}%</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-white/90 font-medium mb-2">Tools & Methods</h3>
                    <div className="space-y-3">
                      {[
                        { name: "Git/GitHub", level: 85 },
                        { name: "Webpack", level: 80 },
                        { name: "Jest/RTL", level: 80 },
                        { name: "Agile/Scrum", level: 85 },
                        { name: "CI/CD", level: 75 },
                      ].map((skill, index) => (
                        <div key={index} className="group space-y-1 hover:bg-white/5 p-1.5 rounded transition-colors">
                          <div className="flex justify-between text-sm">
                            <span>{skill.name}</span>
                            <span className="text-white/50">{skill.level}%</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-white/90 font-medium mb-2">Other Skills</h3>
                    <div className="space-y-3">
                      {[
                        { name: "RESTful APIs", level: 85 },
                        { name: "GraphQL", level: 70 },
                        { name: "Performance Opt.", level: 80 },
                        { name: "Responsive Design", level: 90 },
                        { name: "Web Accessibility", level: 85 },
                      ].map((skill, index) => (
                        <div key={index} className="group space-y-1 hover:bg-white/5 p-1.5 rounded transition-colors">
                          <div className="flex justify-between text-sm">
                            <span>{skill.name}</span>
                            <span className="text-white/50">{skill.level}%</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full"
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Projects Section */}
          <div className="mb-6">
            <div
              className="flex justify-between items-center mb-3 pb-1 border-b border-white/20 cursor-pointer"
              onClick={() => toggleSection("projects")}
            >
              <h2 className="text-xl font-light">Featured Projects</h2>
              <button className="p-1 rounded-full hover:bg-white/10 transition-colors pdf-hide">
                {expandedSections.projects ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {expandedSections.projects && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-300">
                <div className="group bg-white/5 hover:bg-white/10 p-4 rounded-lg transition-all duration-200 border border-white/10">
                  <h3 className="text-lg font-medium mb-1">E-Commerce Platform</h3>
                  <p className="text-white/70 text-sm mb-2">React, Redux, Node.js, MongoDB</p>
                  <p className="text-sm text-white/80 mb-3">
                    Developed a full-featured e-commerce platform with product catalog, shopping cart, and payment
                    processing.
                  </p>
                  <div className="flex justify-end">
                    <button className="flex items-center gap-1 text-xs text-white/60 hover:text-white/90 transition-colors pdf-hide">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Project</span>
                    </button>
                  </div>
                </div>

                <div className="group bg-white/5 hover:bg-white/10 p-4 rounded-lg transition-all duration-200 border border-white/10">
                  <h3 className="text-lg font-medium mb-1">Task Management App</h3>
                  <p className="text-white/70 text-sm mb-2">Next.js, TypeScript, Prisma, PostgreSQL</p>
                  <p className="text-sm text-white/80 mb-3">
                    Built a collaborative task management application with real-time updates and team collaboration
                    features.
                  </p>
                  <div className="flex justify-end">
                    <button className="flex items-center gap-1 text-xs text-white/60 hover:text-white/90 transition-colors pdf-hide">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Project</span>
                    </button>
                  </div>
                </div>

                <div className="group bg-white/5 hover:bg-white/10 p-4 rounded-lg transition-all duration-200 border border-white/10">
                  <h3 className="text-lg font-medium mb-1">Analytics Dashboard</h3>
                  <p className="text-white/70 text-sm mb-2">React, D3.js, Express, MongoDB</p>
                  <p className="text-sm text-white/80 mb-3">
                    Created an interactive analytics dashboard with data visualization and real-time metrics tracking.
                  </p>
                  <div className="flex justify-end">
                    <button className="flex items-center gap-1 text-xs text-white/60 hover:text-white/90 transition-colors pdf-hide">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Project</span>
                    </button>
                  </div>
                </div>

                <div className="group bg-white/5 hover:bg-white/10 p-4 rounded-lg transition-all duration-200 border border-white/10">
                  <h3 className="text-lg font-medium mb-1">Portfolio Website</h3>
                  <p className="text-white/70 text-sm mb-2">Next.js, Framer Motion, Tailwind CSS</p>
                  <p className="text-sm text-white/80 mb-3">
                    Designed and developed an interactive portfolio website with animations and responsive design.
                  </p>
                  <div className="flex justify-end">
                    <button className="flex items-center gap-1 text-xs text-white/60 hover:text-white/90 transition-colors pdf-hide">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Project</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-white/20 text-center text-sm text-white/60">
            <p>This interactive resume was created with React, Framer Motion, and Tailwind CSS.</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

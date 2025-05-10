import { useState } from "react";

export const useOpenAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateResponse = async (prompt: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `API call failed with status: ${response.status}`
        );
      }

      const data = await response.json();
      return data.message;
    } catch (err) {
      console.error("Error calling chat API:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      return "Sorry, I encountered an error processing your request. Please try again.";
    } finally {
      setIsLoading(false);
    }
  };

  return { generateResponse, isLoading, error };
};

// Export resume context for the API route (optional, for reference)
export const resumeContext = `
Johnson Ojo
Frontend Engineer with six years of experience in building high-performance, scalable web applications.
Skills: JavaScript, TypeScript, Redux, React, NextJS, and HTML/CSS.

HIGHLIGHT OF QUALIFICATION AND SKILLS
• Knowledge of Agile development methodologies
• Extensive knowledge in advanced React concepts, JavaScript, HTML5, and CSS
• In-depth understanding of web standards
• Collaborative team player with mentorship experience
• Deep understanding of REST principles and API implementation
• Experience with GitHub and open-source project management

PROFESSIONAL EXPERIENCE:
Bell, Mississauga, Ontario (Jan 2023 - Present)
Software Engineer
• Developed Unified Promocodes Management application (30% increase in efficiency)
• Improved cross-functional team collaboration by 20%
• Implemented playwright for end-to-end testing (40% improvement in testing speed)
• Managed front-end build processes using Webpack
• Built scalable SPAs with React and Next.js

Canada Revenue Agency, Hamilton, Ontario (Oct 2020 – Dec 2022)
Front End Developer
• Drove projects from concept to deployment
• Reduced bug rates by 30% through testing
• Applied engineering best practices
• Participated in agile sprints and technical planning

Genpact, Mississauga, ON (Jan 2018 – Sept 2020)
Junior Front-End Developer
• Redesigned web application to be fully responsive (40% increase in mobile engagement)
• Optimized page load times (35% improvement)
• Ensured cross-browser compatibility
• Integrated RESTful APIs and AJAX (20% increase in user retention)

TECHNICAL SKILLS:
• Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3
• Frameworks/Libraries: React, Next.js, Redux
• Front-End Development: Responsive Design, Web Accessibility Standards
• Build Tools: Webpack, Babel, npm
• Testing: Jest, React Testing Library

EDUCATION:
• Diploma in Computer Programming, Algonquin College, Ottawa
• Bachelor of Science, Obafemi Awolowo University
`;

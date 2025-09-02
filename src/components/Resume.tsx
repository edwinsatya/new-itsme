"use client";

import { resumeLink } from "@/constants/links";
import { certifications } from "@/constants/skills";

const Resume = () => {
  const experiences = [
    {
      period: "Jun 2023 - Feb 2025",
      company: "Magloft",
      position: "Full Stack Developer",
      description: "Contributed to the development of Magloft's digital publishing platform, enhancing features and optimizing performance for a seamless user experience.",
    },
    {
      period: "May 2022 - Jun 2023",
      company: "Bountie",
      position: "Software Engineer",
      description: "Worked on developing and optimizing web applications, collaborating with cross-functional teams to deliver high-quality software solutions.",
    },
    {
      period: "Mar 2020 - May 2022",
      company: "homecare24.id",
      position: "Front-end Developer",
      description: "Developed and maintained the front-end of the homecare24.id platform, focusing on user experience and performance optimization.",
    },
    {
      period: "Sep 2013 - Jan 2014",
      company: "Telkom Indonesia",
      position: "Network Fiber Optic Internship",
      description: "Assisted in the installation and maintenance of fiber optic networks, ensuring optimal connectivity and performance.",
    },
  ];

  const skills = [
    { category: "Frontend", items: ["React", "Next.js", "Vue.js", "Angular.js", "TypeScript", "Tailwind CSS"], level: 90 },
    { category: "Backend", items: ["Node.js", "Express", "RestAPI", "Graphql"], level: 80 },
    { category: "Database", items: ["MongoDB", "PostgreSQL", "MySQL"], level: 80 },
    { category: "Tools", items: ["Git", "Docker", "AWS", "Figma", "VS Code"], level: 88 },
  ];

  return (
    <section id="resume" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-mono">
            <span className="code-bracket">{"<"}</span>
            resume
            <span className="code-bracket">{">"}</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto font-mono">
            My journey in web development and the skills I&apos;ve acquired along the way.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Experience */}
          <div>
            <h3 className="text-2xl font-bold text-green-400 mb-8 font-mono">
              <span className="code-bracket">{"{"}</span>
              experience
              <span className="code-bracket">{"}"}</span>
            </h3>

            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <div
                  key={index}
                  className="bg-black border border-green-500/20 rounded-lg p-6 hover-glow transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                    <h4 className="text-xl font-bold text-white font-mono">{exp.position}</h4>
                    <span className="text-blue-400 font-mono text-sm">{exp.period}</span>
                  </div>
                  <p className="text-green-400 font-mono mb-3">@ {exp.company}</p>
                  <p className="text-gray-300 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>

            {/* Download Resume Button */}
            <div className="mt-8">
              <a href={resumeLink} target="_blank" className="terminal-button inline-flex items-center space-x-2">
                <span>Download CV</span>
                <span className="text-lg">↓</span>
              </a>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-2xl font-bold text-green-400 mb-8 font-mono">
              <span className="code-bracket">{"["}</span>
              technical_skills
              <span className="code-bracket">{"]"}</span>
            </h3>

            <div className="space-y-8">
              {skills.map((skillGroup, index) => (
                <div key={index} className="bg-black border border-green-500/20 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-white font-mono">{skillGroup.category}</h4>
                    <span className="text-blue-400 font-mono text-sm">{skillGroup.level}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${skillGroup.level}%` }}
                    ></div>
                  </div>

                  {/* Skill Tags */}
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-green-400/10 border border-green-400/30 rounded text-green-400 text-xs font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div className="mt-8 bg-black border border-green-500/20 rounded-lg p-6">
              <h4 className="text-lg font-bold text-white font-mono mb-4">
                <span className="code-bracket">{"<"}</span>
                certifications
                <span className="code-bracket">{"/>"}</span>
              </h4>
              <ul className="space-y-2 text-gray-300 font-mono text-sm">
                {
                  certifications.map((certificate) => (
                    <li key={certificate} className="flex items-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>{certificate}</span>
                    </li>
                  ))
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;

"use client";

import { projects } from "@/constants/projects";
import { ExternalLink } from "lucide-react";
import { DynamicIcon } from 'lucide-react/dynamic';
import Image from "next/image";

const Portfolio = () => {
  return (
    <section id="portfolio" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-mono">
            <span className="code-bracket">{"<"}</span>
            portfolio
            <span className="code-bracket">{">"}</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto font-mono">
            A selection of my recent work showcasing my skills and experience through real-world projects.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-900 border border-green-500/20 rounded-lg overflow-hidden hover-glow group transition-all duration-300"
            >
              {/* Project Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border-b border-green-500/20 overflow-hidden">
                {
                  project.image && 
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover opacity-80"
                  />
                }

                {/* Overlay with links */}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                  <a
                    target="_blank"
                    href={project.github}
                    className="p-3 bg-green-400 text-black rounded-full hover:bg-green-300 transition-colors duration-300"
                    title="View Code"
                  >
                    <DynamicIcon name="github" size={20} />
                  </a>
                  <a
                    target="_blank"
                    href={project.live}
                    className="p-3 bg-green-400 text-black rounded-full hover:bg-green-300 transition-colors duration-300"
                    title="Live Demo"
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-green-400 mb-3 font-mono">
                  <span className="code-bracket">{"{ "}</span>
                  {project.title}
                  <span className="code-bracket">{" }"}</span>
                </h3>

                <p className="text-gray-300 text-sm mb-4 font-mono leading-relaxed">{project.description}</p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-green-400/10 border border-green-400/30 rounded text-green-400 text-xs font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <a href="#" className="terminal-button inline-flex items-center space-x-2">
            <span>View All Projects</span>
            <span className="text-lg">{"#"}</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;

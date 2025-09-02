"use client";

import { skills } from "@/constants/skills";
import { Code, Database, Palette } from "lucide-react";

const Services = () => {
  const services = [
    {
      id: 1,
      title: "front-end developer",
      icon: <Code size={32} />,
      description:
        "Building interactive and performant user interfaces using modern JavaScript frameworks and cutting-edge web technologies.",
      features: ["React/Next.js", "Vue.js", "TypeScript", "Modern CSS", "Web Performance"],
    },
    {
      id: 2,
      title: "full-stack engineer",
      icon: <Database size={32} />,
      description:
        "Developing complete web applications from database design to deployment, ensuring scalable and maintainable code.",
      features: ["API Development", "Database Design", "Cloud Deployment"],
    },
    {
      id: 3,
      title: "AI enthusiast",
      icon: <Palette size={32} />,
      description:
        "Exploring and integrating artificial intelligence technologies to create innovative solutions that enhance user experiences.",
      features: ["Open AI", "ChatGPT", "AI Integration", "Automation"],
    },
  ];

  return (
    <section id="services" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-mono">
            <span className="code-bracket">{"<"}</span>
            services
            <span className="code-bracket">{">"}</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto font-mono">
           What I can do for you to bring your ideas to life
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-black border border-green-500/20 rounded-lg p-8 hover-glow group transition-all duration-300"
            >
              {/* Service Icon */}
              <div className="text-green-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>

              {/* Service Title */}
              <h3 className="text-2xl font-bold text-white mb-4 font-mono">
                <span className="code-bracket">{"{ "}</span>
                <span className="code-string text-xl">&quot;{service.title}&quot;</span>
                <span className="code-bracket">{" }"}</span>
              </h3>

              {/* Service Description */}
              <p className="text-gray-300 mb-6 leading-relaxed text-base">{service.description}</p>

              {/* Service Features */}
              <ul className="space-y-2">
                {service.features.map((feature, index) => (
                  <li key={index} className="text-green-400 font-mono text-sm flex items-center">
                    <span className="mr-2">→</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional Services Highlight */}
        <div className="bg-black border border-green-500/30 rounded-lg p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-white mb-2 font-mono">Need something specific?</h3>
              <p className="text-gray-300 font-mono">I offer custom solutions tailored to your unique requirements</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact" className="terminal-button">
                Discuss Project
              </a>
              <a
                href="#"
                className="text-center px-6 py-3 border border-green-400/50 text-green-400 font-mono hover:bg-green-400/10 transition-colors duration-300 rounded"
              >
                all_services
              </a>
            </div>
          </div>
        </div>

        {/* Tech Stack Showcase */}
        <div className="mt-16">
          <h3 className="text-center text-2xl font-bold text-white mb-8 font-mono">
            <span className="code-bracket">{"<"}</span>
            tech_stack
            <span className="code-bracket">{"/>"}</span>
          </h3>

          <div className="flex flex-wrap justify-center gap-4">
            {skills.map(
              (skill) => (
                <div
                  key={skill}
                  className="bg-green-400/10 border border-green-400/30 rounded-full px-4 py-2 text-green-400 font-mono text-sm hover:bg-green-400/20 transition-colors duration-300"
                >
                  {skill}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;

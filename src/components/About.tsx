"use client";

import { skills } from "@/constants/skills";
import { useState } from "react";

const About = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentExperience = new Date().getFullYear() - 2020;

  return (
    <section id="about" className="py-20 bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Code block */}
          <div className="bg-black border border-green-500/30 rounded-lg p-6 font-mono text-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-gray-400">about_me.js</span>
            </div>

            <div className="space-y-2">
              <div className="text-green-400">
                <span className="code-bracket">{"<"}</span>
                <span>about_me</span>
                <span className="code-bracket">{">"}</span>
              </div>

              <div className="pl-4">
                <p className="text-gray-300 mb-2">
                  <span className="text-purple-400">const</span> <span className="text-yellow-400">developer</span>{" "}
                  <span className="text-white">=</span> <span className="code-bracket">{"{"}</span>
                </p>

                <div className="pl-4 space-y-1 text-gray-300">
                  <p>
                    <span className="text-blue-400">name:</span>{" "}
                    <span className="code-string">&quot;Edwin&quot;</span>,
                  </p>
                  <p>
                    <span className="text-blue-400">experience:</span> <span className="text-orange-400">{currentExperience}</span>,
                  </p>
                  <p>
                    <span className="text-blue-400">skills:</span> <span className="code-bracket">[</span>
                  </p>
                  <div className="pl-4">
                    {
                      skills.map((skill) => (
                        <p key={skill}>
                          <span className="code-string">&quot;{skill}&quot;</span>,
                        </p>
                      ))
                    }
                  </div>
                  <p>
                    <span className="code-bracket">]</span>,
                  </p>
                  <p>
                    <span className="text-blue-400">passion:</span>{" "}
                    <span className="code-string">&quot;Clean Code&quot;</span>
                  </p>
                </div>

                <p className="text-gray-300">
                  <span className="code-bracket">{"}"}</span>
                </p>
              </div>

              <div className="text-green-400">
                <span className="code-bracket">{"</"}</span>
                <span>about_me</span>
                <span className="code-bracket">{">"}</span>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-mono">
                <span className="code-bracket">{"<"}</span>
                about_me
                <span className="code-bracket">{">"}</span>
              </h2>

              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p className="text-lg">
                  You can call me Edwin, i live in Indonesia. Im a passionate web developer dedicated to crafting high-quality digital experiences.
                </p>

                <div className="bg-black/50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="font-semibold text-green-400 mb-2">
                    ...I have over {currentExperience} years of experience in web development, with a strong background in both front-end
                    and back-end technologies;
                  </p>
                </div>

                <p className={`transition-all duration-300 ${isExpanded ? "block" : "hidden"}`}>
                 {`<lorem> Contact me for more information; </ipsum>`}.
                </p>

                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-green-400 hover:text-green-300 font-mono underline transition-colors duration-300"
                >
                  {isExpanded ? "read_less" : "read_more"}
                </button>
              </div>
            </div>

            {/* Skills highlight */}
            <div className="bg-black/30 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-400 mb-4 font-mono">
                <span className="code-bracket">{"{"}</span>
                skills
                <span className="code-bracket">{"}"}</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="bg-green-400/10 border border-green-400/30 rounded px-3 py-2 text-center text-green-400 font-mono text-sm hover:bg-green-400/20 transition-colors duration-300"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

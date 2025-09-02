"use client";

import { useEffect, useState } from "react";

const roles = ["front-end developer", "full-stack developer", "tech enthusiastic", "AI enthusiastic"];

const Hero = () => {
  const [displayText, setDisplayText] = useState("");
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const currentRole = roles[currentRoleIndex];
    let timeoutId: NodeJS.Timeout;

    if (isTyping) {
      // Typing effect
      if (displayText.length < currentRole.length) {
        timeoutId = setTimeout(() => {
          setDisplayText(currentRole.slice(0, displayText.length + 1));
        }, 100);
      } else {
        // Finished typing, wait then start deleting
        timeoutId = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    } else {
      // Deleting effect
      if (displayText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 50);
      } else {
        // Finished deleting, move to next role
        setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [displayText, currentRoleIndex, isTyping]);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Matrix-like background effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-px h-full bg-green-500 animate-pulse"></div>
        <div className="absolute top-0 left-2/4 w-px h-full bg-green-500 animate-pulse delay-1000"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-green-500 animate-pulse delay-2000"></div>
      </div>

      <div className="text-center z-10 max-w-4xl mx-auto px-4">
        {/* Greeting */}
        <div className="mb-8">
          <p className="text-gray-400 text-lg md:text-xl mb-2 font-mono">
            <span className="code-comment">{`// HI, I'M Edwin Satya Yudistira`}</span>
          </p>
        </div>

        {/* Main Title with Typewriter Animation */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            <span className="code-bracket">{"{"}</span>
            <span className="code-string">&quot;_</span>

            {/* Typewriter text with cursor */}
            <span className="code-string relative">
              {displayText}
              <span className="typing-cursor text-green-400 font-bold">|</span>
            </span>

            <span className="code-string">_&quot;</span>
            <span className="code-bracket">{"}"}</span>
          </h1>
        </div>

        {/* Description */}
        <div className="mb-12">
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-mono">
            Specialized in modern web technologies, I focus on writing clean, maintainable code and delivering user-focused applications.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#portfolio" className="terminal-button inline-block">
            View Portfolio
          </a>
          <a href="#contact" className="terminal-button inline-block">
            Get In Touch
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-green-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-green-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

"use client";

import { DynamicIcon } from 'lucide-react/dynamic';
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-20 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-mono">
            <span className="code-bracket">{"<"}</span>
            contact_me
            <span className="code-bracket">{">"}</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto font-mono">
            I&apos;m here to help bring your ideas to life. Whether you have a project in mind or just want to say hello, feel free to reach out!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gray-900 border border-green-500/20 rounded-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-gray-400 font-mono text-sm">contact_form.js</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-green-400 font-mono mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-green-500/30 rounded text-white font-mono focus:border-green-400 focus:outline-none transition-colors duration-300"
                  placeholder="Enter your name..."
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-green-400 font-mono mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-green-500/30 rounded text-white font-mono focus:border-green-400 focus:outline-none transition-colors duration-300"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-green-400 font-mono mb-2">
                  _message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 bg-black border border-green-500/30 rounded text-white font-mono focus:border-green-400 focus:outline-none transition-colors duration-300 resize-vertical"
                  placeholder="Tell me about your project..."
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <button type="submit" className="terminal-button w-full flex items-center justify-center space-x-2">
                <span>send</span>
                <DynamicIcon name="send" size={16} />
              </button>
            </form>
          </div>

          {/* Contact Info & Social */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="bg-gray-900 border border-green-500/20 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-6 font-mono">
                <span className="code-bracket">{"{ "}</span>
                get_in_touch
                <span className="code-bracket">{" }"}</span>
              </h3>

              <div className="space-y-4 font-mono">
                <div className="flex items-start space-x-3">
                  <span className="text-green-400 mt-1">→</span>
                  <div>
                    <p className="text-green-400">location:</p>
                    <p className="text-gray-300">Lumajang, Indonesia</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="text-green-400 mt-1">→</span>
                  <div>
                    <p className="text-green-400">email:</p>
                    <p className="text-gray-300">edwinsatyayudistira@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="text-green-400 mt-1">→</span>
                  <div>
                    <p className="text-green-400">availability:</p>
                    <p className="text-gray-300">Open for new Job / Projects</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-gray-900 border border-green-500/20 rounded-lg p-8">
              <h3 className="text-xl font-bold text-white mb-6 font-mono">
                <span className="code-bracket">{"["}</span>
                social_links
                <span className="code-bracket">{"]"}</span>
              </h3>

              <div className="flex space-x-4">
                <a
                  href="#"
                  className="flex items-center justify-center w-12 h-12 bg-green-400/10 border border-green-400/30 rounded-full text-green-400 hover:bg-green-400 hover:text-black transition-all duration-300"
                  title="Github"
                >
                  <DynamicIcon name="github" size={20} />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center w-12 h-12 bg-green-400/10 border border-green-400/30 rounded-full text-green-400 hover:bg-green-400 hover:text-black transition-all duration-300"
                  title="LinkedIn"
                >
                  <DynamicIcon name="linkedin" size={20} />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center w-12 h-12 bg-green-400/10 border border-green-400/30 rounded-full text-green-400 hover:bg-green-400 hover:text-black transition-all duration-300"
                  title="Instagram"
                >
                  <DynamicIcon name="instagram" size={20} />
                </a>
              </div>
            </div>

            {/* Quick Response */}
            <div className="bg-black border border-green-500/30 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-mono text-sm">status: online</span>
              </div>
              <p className="text-gray-300 font-mono text-sm">
                Average response time: <span className="text-blue-400">{"< 24 hours"}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

"use client";

import { DynamicIcon } from 'lucide-react/dynamic';
import { useState } from "react";

type SubmitStatus = "idle" | "loading" | "success" | "error";

type Web3FormsResponse = {
  success?: boolean;
  message?: string;
  body?: { message?: string };
};

const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    if (!accessKey) {
      setStatus("error");
      setErrorMessage("Contact form is not configured. Set NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY.");
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          subject: `Portfolio contact from ${formData.name.trim()}`,
          from_name: formData.name.trim(),
          replyto: formData.email.trim(),
          botcheck: false,
        }),
      });

      const data = (await response.json()) as Web3FormsResponse;
      const apiMessage = data.body?.message ?? data.message;

      if (!response.ok || !data.success) {
        throw new Error(apiMessage ?? "Failed to send message.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to send message.");
    }
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
              {/* Honeypot for spam bots — leave empty */}
              <input
                type="checkbox"
                name="botcheck"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden
              />

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

              {status === "success" && (
                <p className="text-green-400 font-mono text-sm border border-green-500/30 rounded px-4 py-3 bg-green-400/5">
                  Message sent. I&apos;ll get back to you soon.
                </p>
              )}

              {status === "error" && (
                <p className="text-red-400 font-mono text-sm border border-red-500/30 rounded px-4 py-3 bg-red-400/5">
                  {errorMessage}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="terminal-button w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{status === "loading" ? "sending..." : "send"}</span>
                {status !== "loading" && <DynamicIcon name="send" size={16} />}
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
                  href="https://github.com/edwinsatya"
                  target='_blank'
                  className="flex items-center justify-center w-12 h-12 bg-green-400/10 border border-green-400/30 rounded-full text-green-400 hover:bg-green-400 hover:text-black transition-all duration-300"
                  title="Github"
                >
                  <DynamicIcon name="github" size={20} />
                </a>
                <a
                  href="https://www.linkedin.com/in/edwin-satya-yudistira/"
                  target='_blank'
                  className="flex items-center justify-center w-12 h-12 bg-green-400/10 border border-green-400/30 rounded-full text-green-400 hover:bg-green-400 hover:text-black transition-all duration-300"
                  title="LinkedIn"
                >
                  <DynamicIcon name="linkedin" size={20} />
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

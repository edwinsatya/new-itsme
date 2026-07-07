"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useRevealScope } from "@/hooks/useRevealScope";
import {
  useSectionParallax,
  SunOutline,
  Cloud,
  Waves,
  Rainbow,
  CrossMarks,
  SectionGrid,
} from "./scenes";

type SubmitStatus = "idle" | "loading" | "success" | "error";

type Web3FormsResponse = {
  success?: boolean;
  message?: string;
  body?: { message?: string };
};

const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

const Contact = () => {
  const scope = useRevealScope<HTMLElement>();
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

  useSectionParallax(scope);

  return (
    <section id="contact" ref={scope} data-theme="aqua" className="section-shell overflow-hidden">
      {/* Calm-after-the-rain scenery */}
      <SectionGrid />
      <SunOutline className="left-[6%] top-[4%] h-56 w-56 text-[#0e4347] opacity-20 md:h-80 md:w-80" speed={-0.26} />
      <Rainbow className="right-[4%] top-[10%] h-32 w-64 md:h-48 md:w-[28rem]" speed={-0.3} />
      <Cloud className="right-[2%] top-[26%] h-14 w-52 text-[#efeee8] opacity-70" speed={-0.35} />
      <Cloud className="right-[30%] top-[16%] h-10 w-36 text-[#efeee8] opacity-50" speed={-0.18} />
      <CrossMarks className="text-[#0e4347] opacity-25" speed={-0.2} />
      <Waves className="text-[#0e4347]" />

      <div data-enter className="relative z-10 mx-auto max-w-6xl">
        <div data-reveal className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <p className="hud-label">005 — Contact</p>
            <p className="hud-label">WX // Clear after rain — 24°C</p>
          </div>
          <p className="hud-label">
            <span className="mr-1 inline-block h-[6px] w-[6px] animate-pulse bg-[var(--accent)]" />
            Open for new job / projects
          </p>
        </div>

        <h2 data-scroll-speed="-0.2" className="font-display mb-20 text-[clamp(2.6rem,8vw,6.5rem)] text-[var(--ink)]">
          <span className="line-mask md:ml-[10vw]">
            <span>Join the</span>
          </span>
          <span className="line-mask">
            <span>story. let&apos;s build.</span>
          </span>
        </h2>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Form */}
          <form onSubmit={handleSubmit} data-reveal className="space-y-10">
            <input
              type="checkbox"
              name="botcheck"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden
            />

            <div>
              <label htmlFor="name" className="hud-label mb-1 !flex">
                01 — Your name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="field-kpr"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="hud-label mb-1 !flex">
                02 — Your email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="field-kpr"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="hud-label mb-1 !flex">
                03 — Your message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="field-kpr resize-none"
                placeholder="Tell me about your project..."
                required
              />
            </div>

            {status === "success" && (
              <p className="border border-[var(--ink)] px-5 py-4 font-mono text-sm text-[var(--ink)]">
                Message sent. I&apos;ll get back to you soon.
              </p>
            )}

            {status === "error" && (
              <p className="border border-[var(--accent)] px-5 py-4 font-mono text-sm text-[var(--accent)]">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-hud disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "loading" ? "Sending..." : "Send message"}
              <ArrowUpRight size={16} />
            </button>
          </form>

          {/* Info */}
          <div className="flex flex-col justify-between gap-12">
            <div data-reveal className="space-y-10">
              <div>
                <p className="hud-label mb-3">Email</p>
                <a
                  href="mailto:edwinsatyayudistira@gmail.com"
                  className="link-underline font-display block w-fit break-all text-[clamp(1.1rem,2.2vw,1.8rem)] uppercase text-[var(--ink)]"
                >
                  edwinsatyayudistira@gmail.com
                </a>
              </div>

              <div>
                <p className="hud-label mb-3">Location</p>
                <p className="text-xl text-[var(--ink)]">Lumajang, Indonesia</p>
              </div>

              <div>
                <p className="hud-label mb-3">Socials</p>
                <div className="flex gap-8">
                  <a
                    href="https://github.com/edwinsatya"
                    target="_blank"
                    className="link-underline flex items-center gap-1 text-lg text-[var(--ink)]"
                  >
                    Github <ArrowUpRight size={14} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/edwin-satya-yudistira/"
                    target="_blank"
                    className="link-underline flex items-center gap-1 text-lg text-[var(--ink)]"
                  >
                    LinkedIn <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </div>

            <div data-reveal className="border border-[var(--line)] p-8">
              <p className="hud-label">Average response time</p>
              <p className="font-display mt-2 text-3xl text-[var(--ink)]">{"< 24 hours"}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

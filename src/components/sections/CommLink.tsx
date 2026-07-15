"use client";

import { useState } from "react";
import Sector from "@/components/Sector";
import GlitchText from "@/components/fx/GlitchText";
import { runner, socials } from "@/constants/profile";

type SubmitStatus = "idle" | "loading" | "success" | "error";

const CommLink = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Transmission failed. Please try again.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Transmission failed. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Sector
      id="comm"
      index="05"
      name="COMM LINK"
      jp="通信"
      status="[CHANNEL OPEN]"
      statusVariant="magenta"
      bg="comm"
      alt
      zIndex={35}
    >
      <div className="flex flex-wrap items-end justify-between gap-8">
        <h2 className="font-display text-[clamp(2.6rem,7vw,5.6rem)] text-[var(--ink)]">
          <GlitchText as="span" className="glitch--block" text="OPEN A" />
          <GlitchText as="span" className="glitch--block md:ml-[6vw]" text="COMM CHANNEL." delay={0.14} />
        </h2>
        <p data-reveal className="hud-label hud-label--bare">
          <span className="live-dot mr-1 text-[var(--magenta)]" />
          Accepting new jobs &amp; runs
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-2">
        {/* ---- transmission form ---- */}
        <form onSubmit={handleSubmit} data-reveal className="space-y-8">
          <div>
            <label htmlFor="name" className="hud-label hud-label--bare mb-2 !flex">
              <span className="mr-2 text-[var(--magenta)]">&gt;</span> 01_Handle
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="field-term"
              placeholder="Your name"
              maxLength={120}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="hud-label hud-label--bare mb-2 !flex">
              <span className="mr-2 text-[var(--magenta)]">&gt;</span> 02_Return signal
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="field-term"
              placeholder="you@example.com"
              maxLength={254}
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="hud-label hud-label--bare mb-2 !flex">
              <span className="mr-2 text-[var(--magenta)]">&gt;</span> 03_Transmission
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="field-term resize-none"
              placeholder="Tell me about the job..."
              maxLength={5000}
              required
            />
          </div>

          {status === "success" && (
            <p className="border border-[rgba(0,229,255,0.4)] bg-[rgba(0,229,255,0.05)] px-5 py-4 font-mono text-xs uppercase tracking-[0.14em] text-[var(--cyan)]">
              [SIGNAL RECEIVED] — transmission logged. Expect a reply within 24 hours.
            </p>
          )}
          {status === "error" && (
            <p className="border border-[rgba(255,46,136,0.5)] bg-[rgba(255,46,136,0.05)] px-5 py-4 font-mono text-xs uppercase tracking-[0.14em] text-[var(--magenta)]">
              [SIGNAL LOST] — {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-neon btn-neon--m disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "loading" ? "Transmitting..." : "Transmit message"}
          </button>
        </form>

        {/* ---- uplink info ---- */}
        <div className="flex flex-col justify-between gap-12">
          <div className="space-y-10">
            <div data-reveal>
              <p className="hud-label mb-3">Direct line</p>
              <a
                href={`mailto:${runner.email}`}
                className="link-neon block w-fit break-all font-mono text-[clamp(0.95rem,2vw,1.4rem)] text-[var(--ink)]"
              >
                {runner.email}
              </a>
            </div>

            <div data-reveal>
              <p className="hud-label mb-3">Base of operations</p>
              <p className="text-lg text-[var(--ink)]">{runner.location}</p>
              <p className="mt-1 font-mono text-[0.62rem] tracking-[0.2em] text-[var(--faint)]">
                {runner.coords}
              </p>
            </div>

            <div data-reveal>
              <p className="hud-label mb-4">Social uplinks</p>
              <div className="flex flex-wrap gap-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tag !px-4 !py-2 !text-[0.62rem] transition-shadow duration-300 hover:shadow-[0_0_18px_rgba(0,229,255,0.25)]"
                  >
                    {social.label} ↗
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div data-reveal className="tgt border border-[var(--line)] bg-[rgba(14,14,24,0.6)] p-8">
            <p className="hud-label">Signal latency</p>
            <p className="font-display mt-2 text-4xl text-[var(--ink)]">
              {runner.responseTime}
            </p>
            <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[var(--faint)]">
              Average response time — all channels monitored
            </p>
          </div>
        </div>
      </div>
    </Sector>
  );
};

export default CommLink;

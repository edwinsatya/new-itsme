"use client";

import { useState } from "react";
import Sector from "@/components/Sector";
import { runner, socials } from "@/constants/profile";

type SubmitStatus = "idle" | "loading" | "success" | "error";

/**
 * GAME_06 — CO-OP MODE. A multiplayer lobby: P1 (Edwin) is readied up,
 * P2's slot is open — the contact form is the party invite. Socials as
 * player-card links, response time as average queue time.
 */
const Lobby = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    // Web3Forms free tier only accepts browser-side calls, so this posts
    // directly from the client; the access key is public-safe by design.
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setStatus("error");
      setErrorMessage("Contact form is not configured.");
      return;
    }

    const name = formData.name.trim();
    const email = formData.email.trim();

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          name,
          email,
          message: formData.message.trim(),
          subject: `Portfolio contact from ${name}`,
          from_name: name,
          replyto: email,
        }),
      });

      const data = (await response.json()) as { success?: boolean; message?: string };
      if (!response.ok || !data.success) {
        throw new Error(data.message ?? "Connection error. Please try again.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Connection error. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Sector id="contact" zone="contact" zIndex={40} status="[1/2 PLAYERS]" statusVariant="secondary">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="font-display text-[clamp(2.6rem,7vw,5.6rem)] text-[var(--ink)]">
          <span data-glitch data-text="JOIN THE" className="glitch glitch--block">
            JOIN THE
          </span>
          <span
            data-glitch
            data-glitch-delay="0.14"
            data-text="PARTY"
            className="glitch glitch--block md:ml-[6vw]"
          >
            <span className="accent-1">PARTY</span>
          </span>
        </h2>
        <p data-reveal className="hud-label hud-label--bare">
          <span className="live-dot mr-1 text-[var(--accent-secondary)]" />
          Accepting invites — new projects &amp; roles
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* ---- the lobby ---- */}
        <div className="flex flex-col gap-6">
          {/* P1 card */}
          <div data-reveal className="pcard">
            <div className="pcard-banner" />
            <div className="flex flex-wrap items-center justify-between gap-4 p-6">
              <div className="flex items-center gap-4">
                <div className="tgt tgt-hot flex h-14 w-14 items-center justify-center">
                  <span className="font-display text-xl text-[var(--ink)]">
                    E<span className="accent-1">S</span>Y
                  </span>
                </div>
                <div>
                  <p className="font-display text-xl text-[var(--ink)]">{runner.name}</p>
                  <p className="font-mono text-[0.56rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                    P1 — {runner.role}
                  </p>
                </div>
              </div>
              <span className="ready-chip">
                <span className="live-dot" />
                Ready
              </span>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-[var(--line-soft)] px-6 py-4">
              <span className="tag tag--dim">SERVER: ASIA-SE</span>
              <span className="tag tag--dim">REGION: {runner.location}</span>
              <span className="tag tag--dim">PING: 12MS</span>
            </div>
          </div>

          {/* P2 empty slot */}
          <div data-reveal className="pcard pcard--empty">
            <div className="flex flex-wrap items-center justify-between gap-4 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center border border-dashed border-[rgba(238,242,247,0.25)] font-mono text-lg text-[var(--faint)]">
                  ?
                </div>
                <div>
                  <p className="press-start font-display text-xl text-[var(--muted)]">
                    Waiting for Player 2…
                  </p>
                  <p className="font-mono text-[0.56rem] uppercase tracking-[0.2em] text-[var(--faint)]">
                    P2 — this could be you
                  </p>
                </div>
              </div>
              <span className="tag tag--dim">SLOT OPEN</span>
            </div>
          </div>

          {/* comms */}
          <div data-reveal className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="panel p-6">
              <p className="hud-label mb-3">Direct DM</p>
              <a
                href={`mailto:${runner.email}`}
                className="link-game block w-fit break-all font-mono text-[0.82rem] text-[var(--ink)]"
              >
                {runner.email}
              </a>
              <div className="mt-5 flex flex-wrap gap-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tag !px-4 !py-2 !text-[0.62rem] transition-shadow duration-300 hover:shadow-[0_0_18px_rgba(var(--accent-primary-rgb),0.25)]"
                    data-cursor-label={social.label.toUpperCase()}
                  >
                    {social.label} ↗
                  </a>
                ))}
              </div>
            </div>
            <div className="panel p-6">
              <p className="hud-label mb-3">Average queue time</p>
              <p className="font-display text-4xl text-[var(--ink)]">{runner.responseTime}</p>
              <p className="mt-2 font-mono text-[0.56rem] uppercase tracking-[0.2em] text-[var(--faint)]">
                All channels monitored — fast matchmaking
              </p>
            </div>
          </div>
        </div>

        {/* ---- party invite form ---- */}
        <form onSubmit={handleSubmit} data-reveal className="panel h-fit space-y-7 p-7 md:p-8">
          <div className="flex items-center justify-between">
            <p className="hud-label">Send party invite</p>
            <span className="tag tag--2">CO-OP</span>
          </div>

          <div>
            <label htmlFor="name" className="hud-label hud-label--bare mb-2 !flex">
              <span className="mr-2 text-[var(--accent-secondary)]">&gt;</span> 01_Gamertag
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="field-game"
              placeholder="Your name"
              maxLength={120}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="hud-label hud-label--bare mb-2 !flex">
              <span className="mr-2 text-[var(--accent-secondary)]">&gt;</span> 02_Contact frequency
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="field-game"
              placeholder="you@example.com"
              maxLength={254}
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="hud-label hud-label--bare mb-2 !flex">
              <span className="mr-2 text-[var(--accent-secondary)]">&gt;</span> 03_Mission brief
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="field-game resize-none"
              placeholder="Tell me about the project..."
              maxLength={5000}
              required
            />
          </div>

          {status === "success" && (
            <p className="border border-[rgba(69,224,108,0.4)] bg-[rgba(69,224,108,0.06)] px-5 py-4 font-mono text-xs uppercase tracking-[0.14em] text-[#45e06c]">
              [INVITE SENT] — GG! Expect a reply within 24 hours.
            </p>
          )}
          {status === "error" && (
            <p className="border border-[rgba(var(--accent-secondary-rgb),0.5)] bg-[rgba(var(--accent-secondary-rgb),0.05)] px-5 py-4 font-mono text-xs uppercase tracking-[0.14em] text-[var(--accent-secondary)]">
              [CONNECTION ERROR] — {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-game w-full disabled:cursor-not-allowed disabled:opacity-50"
            data-cursor-label="SEND"
          >
            {status === "loading" ? "Connecting…" : "✓ Ready Up — Send Invite"}
          </button>
        </form>
      </div>
    </Sector>
  );
};

export default Lobby;

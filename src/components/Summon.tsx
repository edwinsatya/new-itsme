"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useRevealScope } from "@/hooks/useRevealScope";
import ChapterHeader from "./fx/ChapterHeader";
import ChargeButton from "./fx/ChargeButton";

type SubmitStatus = "idle" | "loading" | "success" | "error";

type Web3FormsResponse = {
  success?: boolean;
  message?: string;
  body?: { message?: string };
};

const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

const Summon = () => {
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

  return (
    <section id="contact" ref={scope} className="theme-paper section-shell overflow-hidden">
      <div
        className="halftone-fade pointer-events-none absolute left-[-6%] top-[8%] h-96 w-[32rem] text-[var(--ink)] opacity-20"
        aria-hidden
      />
      <p
        className="font-jp pointer-events-none absolute right-[-2%] top-[6%] select-none text-[clamp(6rem,18vw,15rem)] leading-none opacity-[0.05]"
        aria-hidden
      >
        召喚
      </p>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <ChapterHeader
            chapter={5}
            sub="Final chapter — Contact"
            lines={["Send a", "Signal"]}
            className="max-w-xl"
          />
          <p data-reveal className="hud-label mt-2 animate-pulse text-[var(--red)]">
            Open for new quests
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Summon request form */}
          <form onSubmit={handleSubmit} data-wipe className="space-y-8">
            <input
              type="checkbox"
              name="botcheck"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden
            />

            <div>
              <label htmlFor="name" className="hud-label mb-2 !flex">
                01 — Your name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="field-manga"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="hud-label mb-2 !flex">
                02 — Your email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="field-manga"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="hud-label mb-2 !flex">
                03 — Your message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="field-manga resize-none"
                placeholder="Tell me about your quest..."
                required
              />
            </div>

            {status === "success" && (
              <p className="panel px-5 py-4 font-mono text-sm">
                Signal received. I&apos;ll answer the summons soon.
              </p>
            )}

            {status === "error" && (
              <p className="border-[3px] border-[var(--red)] px-5 py-4 font-mono text-sm text-[var(--red)]">
                {errorMessage}
              </p>
            )}

            <ChargeButton type="submit" disabled={status === "loading"} cursorLabel="FIRE!">
              {status === "loading" ? "Sending signal..." : "Fire the signal"}
              <ArrowUpRight size={16} />
            </ChargeButton>
          </form>

          {/* Character contact sheet */}
          <div className="flex flex-col justify-between gap-12">
            <div data-reveal className="space-y-10">
              <div>
                <p className="hud-label mb-3 text-[var(--red)]">Direct line</p>
                <a
                  href="mailto:edwinsatyayudistira@gmail.com"
                  className="slash-link font-display block w-fit break-all text-[clamp(1.1rem,2.2vw,1.7rem)] uppercase"
                >
                  edwinsatyayudistira@gmail.com
                </a>
              </div>

              <div>
                <p className="hud-label mb-3 text-[var(--red)]">Home base</p>
                <p className="text-xl">Lumajang, Indonesia</p>
              </div>

              <div>
                <p className="hud-label mb-3 text-[var(--red)]">Allies & records</p>
                <div className="flex gap-8">
                  <a
                    href="https://github.com/edwinsatya"
                    target="_blank"
                    className="slash-link flex items-center gap-1 text-lg"
                  >
                    Github <ArrowUpRight size={14} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/edwin-satya-yudistira/"
                    target="_blank"
                    className="slash-link flex items-center gap-1 text-lg"
                  >
                    LinkedIn <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </div>

            <div data-reveal-pop data-rotate="-1.5" className="opacity-0">
              <div className="panel panel--red p-8">
                <p className="hud-label text-[var(--red)]">Response speed stat</p>
                <p className="font-display mt-2 text-4xl">{"< 24 hours"}</p>
                <p className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] opacity-60">
                  Average time to answer a summons
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Summon;

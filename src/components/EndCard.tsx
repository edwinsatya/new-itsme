"use client";

import { ArrowUp } from "lucide-react";
import { useRevealScope } from "@/hooks/useRevealScope";

const credits = [
  ["Story & code", "Edwin Satya Yudistira"],
  ["Tools", "Next.js · TypeScript · Tailwind · GSAP · Lenis"],
  ["Location", "Lumajang, Indonesia"],
  ["Chapters", "000 Cold Open → 005 Final Chapter"],
];

/** Outro: the classic slanted "to be continued" end card, then a credits roll. */
const EndCard = () => {
  const scope = useRevealScope<HTMLElement>();
  const currentYear = new Date().getFullYear();

  return (
    <footer ref={scope} className="theme-ink relative overflow-hidden border-t-[3px] border-[var(--red)]">
      <div
        className="halftone-fade pointer-events-none absolute right-[-6%] top-[-4%] h-80 w-[30rem] text-[var(--paper)] opacity-10"
        aria-hidden
      />

      {/* To be continued */}
      <div className="relative px-6 pb-16 pt-20 md:px-12 md:pt-28">
        <div data-reveal className="relative mx-auto max-w-6xl">
          <div className="relative inline-block -skew-x-6">
            {/* red arrow wedge behind the words */}
            <svg
              className="absolute -left-8 top-1/2 -z-10 h-[130%] w-[112%] -translate-y-1/2 text-[var(--red)]"
              viewBox="0 0 600 160"
              preserveAspectRatio="none"
              fill="currentColor"
              aria-hidden
            >
              <polygon points="0,20 500,0 600,80 500,160 0,140 40,80" />
            </svg>
            <p className="font-display px-6 py-4 text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.95] text-[var(--paper)]">
              To be
              <br />
              continued...
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-baseline gap-x-6 gap-y-3">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.25em] opacity-70">
              Next episode: your project
            </p>
            <a
              href="#contact"
              className="slash-link font-display text-xl uppercase text-[var(--red)] md:text-2xl"
              data-cursor-label="GO!"
            >
              Join the story →
            </a>
          </div>
        </div>
      </div>

      {/* Credits roll */}
      <div className="relative border-t-2 border-[rgba(242,239,230,0.15)] px-6 py-12 md:px-12">
        <div data-reveal className="mx-auto grid max-w-6xl grid-cols-1 gap-x-12 gap-y-4 sm:grid-cols-2">
          {credits.map(([role, name]) => (
            <div
              key={role}
              className="flex items-baseline justify-between gap-6 border-b border-[rgba(242,239,230,0.12)] pb-2 font-mono text-[0.65rem] uppercase tracking-[0.2em]"
            >
              <span className="opacity-50">{role}</span>
              <span className="text-right">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative flex flex-col items-start justify-between gap-6 border-t-2 border-[rgba(242,239,230,0.15)] px-6 py-8 md:flex-row md:items-center md:px-12">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.25em] opacity-70">
          © {currentYear} Edwin Satya Yudistira — Inked with passion
        </p>

        <div className="flex items-center gap-8">
          <a
            href="https://github.com/edwinsatya"
            target="_blank"
            className="slash-link font-mono text-[0.62rem] uppercase tracking-[0.25em]"
          >
            Github
          </a>
          <a
            href="https://www.linkedin.com/in/edwin-satya-yudistira/"
            target="_blank"
            className="slash-link font-mono text-[0.62rem] uppercase tracking-[0.25em]"
          >
            LinkedIn
          </a>
          <a
            href="#home"
            aria-label="Back to top"
            data-cursor-label="REWIND"
            className="flex h-11 w-11 items-center justify-center border-2 border-[var(--paper)] transition-colors duration-200 hover:bg-[var(--red)] hover:text-[var(--paper)]"
          >
            <ArrowUp size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default EndCard;

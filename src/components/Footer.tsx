"use client";

import { ArrowUp } from "lucide-react";

const journey = ["Night", "Sunny", "Rain", "Wind", "Snow", "Rainbow"];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer data-theme="teal" className="relative overflow-hidden border-t border-[var(--line)]">
      <div
        className="flex flex-col gap-8 px-6 py-14 md:py-20"
        style={{ paddingLeft: "calc(var(--frame-pad) + var(--frame-rail) + 1.5rem)" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pr-4">
          <p className="hud-label">006 — End of forecast</p>
          <p className="hud-label hidden md:inline-flex">Journey complete</p>
        </div>

        <a
          href="#contact"
          className="font-display group block max-w-4xl text-[clamp(2rem,6vw,4.5rem)] uppercase leading-[1.05] text-[var(--ink)]"
        >
          The sky is clear.{" "}
          <span className="text-[var(--accent)] transition-opacity duration-300 group-hover:opacity-70">
            Let&apos;s build.
          </span>
        </a>

        {/* Weather journey recap */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-[var(--ink)] opacity-60">
          {journey.map((stop, i) => (
            <span key={stop} className="flex items-center gap-3">
              {stop}
              {i < journey.length - 1 && <span className="text-[var(--accent)]">→</span>}
            </span>
          ))}
        </div>
      </div>

      <div
        className="flex flex-col items-start justify-between gap-6 border-t border-[var(--line)] px-6 py-8 md:flex-row md:items-center"
        style={{ paddingLeft: "calc(var(--frame-pad) + var(--frame-rail) + 1.5rem)" }}
      >
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.25em] text-[var(--ink)] opacity-70">
          © {currentYear} Edwin Satya Yudistira — Coded with passion
        </p>

        <div className="flex items-center gap-8 pr-4">
          <a
            href="https://github.com/edwinsatya"
            target="_blank"
            className="link-underline font-mono text-[0.62rem] uppercase tracking-[0.25em] text-[var(--ink)]"
          >
            Github
          </a>
          <a
            href="https://www.linkedin.com/in/edwin-satya-yudistira/"
            target="_blank"
            className="link-underline font-mono text-[0.62rem] uppercase tracking-[0.25em] text-[var(--ink)]"
          >
            LinkedIn
          </a>
          <a
            href="#home"
            className="flex h-11 w-11 items-center justify-center border border-[var(--line)] text-[var(--ink)] transition-colors duration-300 hover:bg-[var(--ink)] hover:text-[var(--bg)]"
            aria-label="Back to top"
          >
            <ArrowUp size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

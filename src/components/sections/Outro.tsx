"use client";

import { ArrowUp } from "lucide-react";
import { useRevealScope } from "@/hooks/useRevealScope";
import GlitchText from "@/components/fx/GlitchText";
import { runner, socials } from "@/constants/profile";

/** Sign-off: connection terminated, one last flicker, then the city hums on. */
const Outro = () => {
  const scope = useRevealScope<HTMLElement>();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      ref={scope}
      className="sector sector--flat relative"
      style={{ zIndex: 30, marginTop: "-4rem", paddingBottom: "6.5rem" }}
    >
      <div className="sector-bg" aria-hidden style={{ background: "var(--bg)" }} />
      <div className="seam-band" aria-hidden />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center gap-8 text-center">
        <p data-reveal className="hud-label hud-label--bare">
          Session terminating…
        </p>

        <h2 className="font-display text-[clamp(2.8rem,9vw,7.5rem)] leading-[0.92] text-[var(--ink)]">
          <GlitchText as="span" className="glitch--block" text="CONNECTION" />
          <GlitchText as="span" className="glitch--block text-[var(--magenta)]" text="TERMINATED." delay={0.16} />
        </h2>

        <p className="blink-out font-mono text-[0.68rem] uppercase tracking-[0.24em] text-[var(--muted)]">
          <span className="mr-2 text-[var(--cyan)]">&gt;</span>
          logging off_ — the city keeps running.
        </p>

        <span className="font-jp text-sm text-[var(--faint)]" aria-hidden>
          切断
        </span>

        <a href="#comm" className="btn-neon mt-2">
          Re-open channel
        </a>
      </div>

      <div className="relative z-10 mx-auto mt-20 flex max-w-6xl flex-col items-start justify-between gap-6 border-t border-[var(--line)] pt-8 md:flex-row md:items-center">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-[var(--faint)]">
          © {currentYear} {runner.name} — wired with intent
        </p>

        <div className="flex items-center gap-7">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-neon font-mono text-[0.6rem] uppercase tracking-[0.22em] text-[var(--muted)]"
            >
              {social.label}
            </a>
          ))}
          <a
            href="#home"
            aria-label="Back to top"
            className="flex h-10 w-10 items-center justify-center border border-[var(--line)] text-[var(--muted)] transition-all duration-300 hover:border-[rgba(0,229,255,0.5)] hover:text-[var(--cyan)] hover:shadow-[0_0_16px_rgba(0,229,255,0.2)]"
          >
            <ArrowUp size={15} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Outro;

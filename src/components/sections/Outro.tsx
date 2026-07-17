"use client";

import { useEffect, useState } from "react";
import { useRevealScope } from "@/hooks/useRevealScope";
import SectionScene from "@/components/fx/SectionScene";
import { runner, socials } from "@/constants/profile";

/**
 * GAME OVER — the outro. The one section that leans intentionally
 * retro-arcade: phosphor green, scanlines, a looping CONTINUE countdown,
 * INSERT COIN blink, and a Play Again warp back to the top.
 */
const Outro = () => {
  const scope = useRevealScope<HTMLElement>();
  const [count, setCount] = useState(9);

  useEffect(() => {
    const t = setInterval(() => setCount((c) => (c <= 0 ? 9 : c - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <SectionScene zone="outro" id="outro" as="footer" ref={scope} zIndex={35} flat overlap>
      <div className="arcade-scan" aria-hidden />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center py-16 text-center md:py-24">
        <p data-reveal className="hud-label hud-label--bare mb-8">
          FINAL STAGE CLEARED — CREDITS ROLL
        </p>

        <h2
          data-glitch
          data-text="GAME OVER"
          className="glitch arcade-title text-[clamp(3.4rem,12vw,9rem)]"
        >
          GAME OVER
        </h2>

        <p data-reveal className="arcade-text mt-8 text-[clamp(0.8rem,2vw,1.05rem)]">
          CONTINUE? <span className="inline-block w-[2ch] text-[var(--accent-secondary)]" suppressHydrationWarning>{count}</span>
        </p>

        <div data-reveal className="mt-6 flex items-center gap-3">
          <span
            className="coin-pulse inline-block h-5 w-5 rounded-full border-2 border-[var(--accent-secondary)]"
            style={{ boxShadow: "inset 0 0 0 2px #070907, inset 0 0 0 4px var(--accent-secondary)" }}
            aria-hidden
          />
          <span className="press-start arcade-text text-sm">INSERT COIN TO CONTINUE</span>
        </div>

        {/* high scores */}
        <div data-reveal className="mt-12 w-full max-w-sm border border-[rgba(var(--accent-primary-rgb),0.25)] bg-[rgba(0,0,0,0.4)] p-5 font-mono text-[0.66rem] uppercase tracking-[0.18em]">
          <p className="mb-3 text-[var(--accent-secondary)]">— High Scores —</p>
          <div className="space-y-1.5 text-[var(--muted)]">
            <p className="flex justify-between">
              <span>1. YOU (for scrolling this far)</span>
              <span className="text-[var(--accent-primary)]">999999</span>
            </p>
            <p className="flex justify-between">
              <span>2. E.S.Y</span>
              <span>654321</span>
            </p>
            <p className="flex justify-between opacity-50">
              <span>3. AAA</span>
              <span>001337</span>
            </p>
          </div>
        </div>

        <div data-reveal className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <a href="#home" className="btn-game" data-cursor-label="RESTART">
            ↺ Play Again
          </a>
          <a href="#contact" className="btn-game btn-game--ghost" data-cursor-label="LOBBY">
            1UP — Hire Me
          </a>
        </div>

        {/* footer strip */}
        <div data-reveal className="mt-16 w-full border-t border-[var(--line-soft)] pt-8">
          <div className="flex flex-col items-center justify-between gap-4 font-mono text-[0.56rem] uppercase tracking-[0.2em] text-[var(--faint)] md:flex-row">
            <span>© {new Date().getFullYear()} {runner.name} — Thanks for playing</span>
            <span className="flex gap-5">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="link-game">
                  {s.label}
                </a>
              ))}
              <a href={`mailto:${runner.email}`} className="link-game">
                Email
              </a>
            </span>
          </div>
          <p className="mt-4 text-center font-mono text-[0.5rem] uppercase tracking-[0.3em] text-[rgba(238,242,247,0.18)]">
            EDWIN.SYS v5.0 — built with Next.js · no cartridges were harmed
          </p>
        </div>
      </div>
    </SectionScene>
  );
};

export default Outro;

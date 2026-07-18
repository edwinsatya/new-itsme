"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import Sector from "@/components/Sector";
import { runner } from "@/constants/profile";

/** fight-game attribute readout — Power/Speed/Technique, reframed */
const FIGHT_STATS = [
  { label: "Frontend", value: 90 },
  { label: "Backend", value: 80 },
  { label: "Design", value: 85 },
];

/** roster grid — one unlocked fighter, the rest are DLC */
const ROSTER = ["E", "?", "?", "?", "?", "?", "?", "?"];

/**
 * GAME_01 — STREET CODER VI. A fighting-game character select screen:
 * giant nameplate, portrait panel with P1 badge, attribute bars, a
 * roster grid with one unlocked fighter, and a blinking PRESS START.
 */
const Hero = () => {
  const scopeRef = useRef<HTMLDivElement>(null);
  const years = new Date().getFullYear() - runner.est;

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".statbar-fill[data-level]").forEach((el) => {
        const level = parseFloat(el.dataset.level ?? "0") / 100;
        if (reduced) {
          gsap.set(el, { scaleX: level });
          return;
        }
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: level,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          }
        );
      });
    }, scopeRef);
    return () => ctx.revert();
  }, []);

  return (
    <Sector id="hero" zone="hero" zIndex={65} status="[SELECT YOUR FIGHTER]" statusVariant="secondary">
      <div ref={scopeRef}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="font-display text-[clamp(2.4rem,6vw,4.6rem)] text-[var(--ink)]">
            <span data-glitch data-text="CHOOSE YOUR" className="glitch glitch--block">
              CHOOSE YOUR
            </span>
            <span
              data-glitch
              data-glitch-delay="0.14"
              data-text="FIGHTER"
              className="glitch glitch--block md:ml-[4vw]"
            >
              <span className="accent-1">FIGHTER</span>
            </span>
          </h1>
          <div data-reveal className="flex items-center gap-4">
            <p className="hud-label hud-label--bare">
              ROUND 1 <span className="mx-2 opacity-40">{"//"}</span> RANKED MATCH
            </p>
            {/* round-timer ring — select screens always have a clock */}
            <div className="ring-timer" aria-hidden>
              <i className="ring-timer-arc" />
              <span className="ring-timer-label">∞</span>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* ---- nameplate + attributes ---- */}
          <div className="lg:col-span-7">
            <p data-reveal className="hud-label mb-4">
              P1 — Fighter profile
            </p>
            <h2 className="font-display text-[clamp(3rem,8.5vw,7rem)] leading-[0.92] text-[var(--ink)]">
              <span data-glitch data-glitch-delay="0.2" data-text="EDWIN" className="glitch glitch--block">
                EDWIN
              </span>
              <span
                data-glitch
                data-glitch-delay="0.32"
                data-text="SATYA YUDISTIRA"
                className="glitch glitch--block"
              >
                SATYA <span className="text-hollow">YUDISTIRA</span>
              </span>
            </h2>
            <p data-reveal className="mt-5 font-display text-[clamp(1.05rem,2.4vw,1.7rem)] tracking-[0.06em] text-[var(--accent-secondary)]">
              “CODE. CREATE. REIMAGINE.”
            </p>
            <div data-reveal className="mt-4 flex flex-wrap items-center gap-3">
              <span className="tag">CLASS: {runner.role}</span>
              <span className="tag tag--dim">STYLE: PIXEL-PERFECT / SCALABLE</span>
            </div>

            {/* attribute bars */}
            <div className="mt-10 max-w-md space-y-5">
              {FIGHT_STATS.map((s) => (
                <div key={s.label} data-reveal className="cs-stat">
                  <div className="mb-2 flex items-baseline justify-between font-mono text-[0.62rem] uppercase tracking-[0.22em]">
                    <span className="text-[var(--muted)]">{s.label}</span>
                    <span className="text-[var(--accent-primary)]">{s.value}</span>
                  </div>
                  <div className="statbar">
                    <div className="statbar-fill" data-level={s.value} />
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div data-reveal className="mt-11 flex flex-wrap items-center gap-4">
              <a href="#contact" className="btn-game" data-cursor-label="HIRE ME" aria-label="Contact me">
                Press Start — Hire Me
              </a>
              <a href="#works" className="btn-game btn-game--ghost" data-cursor-label="PROJECTS" aria-label="View my projects">
                View My Projects ↓
              </a>
            </div>
          </div>

          {/* ---- portrait + roster ---- */}
          <div className="lg:col-span-5">
            <div data-reveal data-tilt="3" className="cs-portrait aspect-[4/5] w-full">
              {/* oversized monogram as the "portrait" */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display select-none text-[11rem] leading-none text-transparent [-webkit-text-stroke:2px_rgba(var(--accent-primary-rgb),0.55)] md:text-[13rem]">
                  E
                </span>
              </div>
              <span className="absolute left-4 top-4 tag tag--2">P1</span>
              <span className="absolute right-4 top-4 font-mono text-[0.56rem] uppercase tracking-[0.24em] text-[var(--faint)]">
                EST. {runner.est}
              </span>
              {/* record plate */}
              <div className="absolute inset-x-0 bottom-0 border-t border-[rgba(var(--accent-primary-rgb),0.3)] bg-[rgba(5,6,10,0.82)] px-5 py-4 backdrop-blur-[2px]">
                <div className="flex items-center justify-between gap-2 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-[var(--muted)]">
                  <span>
                    <span className="block text-lg font-display text-[var(--ink)]">{years}+</span>
                    yrs exp
                  </span>
                  <span>
                    <span className="block text-lg font-display text-[var(--ink)]">10+</span>
                    projects
                  </span>
                  <span>
                    <span className="block text-lg font-display text-[var(--ink)]">5</span>
                    teams
                  </span>
                  <span className="text-right">
                    <span className="block text-lg font-display text-[var(--accent-primary)]">W</span>
                    win streak
                  </span>
                </div>
              </div>
            </div>

            {/* roster grid */}
            <div data-reveal className="mt-4">
              <div className="grid grid-cols-8 gap-2">
                {ROSTER.map((r, i) => (
                  <div key={i} className={`roster-slot ${i === 0 ? "roster-slot--active" : ""}`} aria-hidden>
                    {r}
                  </div>
                ))}
              </div>
              <p className="mt-3 flex items-center justify-between font-mono text-[0.55rem] uppercase tracking-[0.2em] text-[var(--faint)]">
                <span>Roster: 1 unlocked</span>
                <span className="press-start text-[var(--accent-primary)]">Waiting for P2 — you?</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Sector>
  );
};

export default Hero;

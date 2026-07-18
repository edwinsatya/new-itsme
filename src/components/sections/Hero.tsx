"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import Sector from "@/components/Sector";
import FighterIcon, { FIGHTER_COLORS, type FighterId } from "@/components/fx/FighterIcon";
import { runner } from "@/constants/profile";

/** shared attribute labels — every fighter is rated on the same three */
const STAT_LABELS = ["Frontend", "Backend", "Design"] as const;

type Fighter = {
  tag: FighterId;
  name: string;
  /** fighting-style line, readable by non-gamers too */
  style: string;
  stats: [number, number, number];
  locked?: boolean;
};

/**
 * The roster — Edwin's fighter forms. EDWIN is the real, playable
 * all-rounder; the others are his specialist stances. The last slot
 * stays locked (a little conversion nudge).
 */
const FIGHTERS: Fighter[] = [
  { tag: "E", name: "EDWIN", style: "The Full-Stack — balanced all-rounder", stats: [90, 80, 85] },
  { tag: "FE", name: "PIXEL BRAWLER", style: "Frontend stance — fast UI strikes", stats: [97, 55, 88] },
  { tag: "BE", name: "API CRUSHER", style: "Backend stance — heavy server hits", stats: [55, 95, 60] },
  { tag: "DB", name: "QUERY MASTER", style: "Database stance — locks & joins", stats: [45, 92, 55] },
  { tag: "AI", name: "PROMPT SAGE", style: "AI stance — unpredictable combos", stats: [75, 78, 80] },
  { tag: "OPS", name: "DEPLOY DEMON", style: "DevOps stance — ships nonstop", stats: [60, 88, 58] },
  { tag: "UI", name: "UX ASSASSIN", style: "Design stance — pixel-perfect precision", stats: [92, 50, 96] },
  { tag: "?", name: "???", style: "Locked — hire me to unlock this fighter", stats: [0, 0, 0], locked: true },
];

/**
 * GAME_01 — STREET CODER VI. A Tekken-style character select: a roster
 * of clickable fighter icons under the portrait — picking one slams the
 * big card over to that fighter (portrait tag, name plate, style line)
 * and re-animates the attribute bars to their ratings.
 */
const Hero = () => {
  const scopeRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(0);
  const fighter = FIGHTERS[selected];
  const years = new Date().getFullYear() - runner.est;

  /* attribute bars chase the selected fighter's ratings */
  useEffect(() => {
    const reduced = prefersReducedMotion();
    const fills = scopeRef.current?.querySelectorAll<HTMLElement>(".statbar-fill");
    const nums = scopeRef.current?.querySelectorAll<HTMLElement>(".cs-stat-num");
    if (!fills) return;
    fills.forEach((el, i) => {
      const level = (fighter.stats[i] ?? 0) / 100;
      if (reduced) {
        gsap.set(el, { scaleX: level });
        if (nums?.[i]) nums[i].textContent = String(fighter.stats[i]);
        return;
      }
      gsap.to(el, { scaleX: level, duration: 0.7, ease: "power3.out", overwrite: "auto" });
      const proxy = { v: parseFloat(nums?.[i]?.textContent ?? "0") || 0 };
      gsap.to(proxy, {
        v: fighter.stats[i],
        duration: 0.7,
        ease: "power3.out",
        overwrite: "auto",
        onUpdate: () => {
          if (nums?.[i]) nums[i].textContent = String(Math.round(proxy.v));
        },
      });
    });
  }, [fighter]);

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

            {/* attribute bars — they re-animate for whichever fighter is selected */}
            <div className="mt-10 max-w-md space-y-5">
              {STAT_LABELS.map((label, i) => (
                <div key={label} data-reveal className="cs-stat">
                  <div className="mb-2 flex items-baseline justify-between font-mono text-[0.62rem] uppercase tracking-[0.22em]">
                    <span className="text-[var(--muted)]">{label}</span>
                    <span className="cs-stat-num text-[var(--accent-primary)]">
                      {FIGHTERS[0].stats[i]}
                    </span>
                  </div>
                  <div className="statbar">
                    <div className="statbar-fill" />
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
              {/* portrait swaps with a slam whenever a fighter is picked */}
              <div key={fighter.tag} className="fighter-swap absolute inset-0">
                <div className="absolute inset-0 flex items-center justify-center pb-20">
                  <span
                    style={{
                      filter: `drop-shadow(0 0 34px rgba(${FIGHTER_COLORS[fighter.tag].rgb}, 0.45))`,
                    }}
                  >
                    <FighterIcon id={fighter.tag} size={230} />
                  </span>
                </div>
                {/* fighter tag watermark behind the name */}
                <span className="absolute right-4 top-12 font-display text-5xl text-transparent [-webkit-text-stroke:1.5px_rgba(var(--accent-primary-rgb),0.35)]">
                  {fighter.tag}
                </span>
                {/* Tekken-style name banner */}
                <div className="absolute inset-x-0 bottom-[4.6rem] px-5">
                  <p className="fighter-name">{fighter.name}</p>
                  <p className="mt-1 font-mono text-[0.56rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                    {fighter.style}
                  </p>
                </div>
              </div>

              <span className="absolute left-4 top-4 tag tag--2">P1</span>
              <span className="absolute right-4 top-4 font-mono text-[0.56rem] uppercase tracking-[0.24em] text-[var(--faint)]">
                EST. {runner.est}
              </span>
              {/* record plate — Edwin's real numbers, whatever the stance */}
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

            {/* roster grid — pick a fighter */}
            <div data-reveal className="mt-4">
              <div className="grid grid-cols-8 gap-2" role="group" aria-label="Choose a fighter form">
                {FIGHTERS.map((f, i) => (
                  <button
                    key={f.tag}
                    type="button"
                    onClick={() => setSelected(i)}
                    className={`roster-slot ${selected === i ? "roster-slot--active" : ""} ${
                      f.locked ? "roster-slot--locked" : ""
                    }`}
                    style={{
                      background: f.locked
                        ? undefined
                        : `radial-gradient(85% 70% at 50% 28%, rgba(${FIGHTER_COLORS[f.tag].rgb}, 0.22), transparent 75%), rgba(var(--ink-rgb), 0.03)`,
                    }}
                    aria-pressed={selected === i}
                    aria-label={f.locked ? "Locked fighter" : `${f.name} — ${f.style}`}
                    title={f.locked ? "Locked" : f.name}
                    data-cursor-label={f.locked ? "LOCKED" : "SELECT"}
                  >
                    <FighterIcon id={f.tag} size={34} />
                  </button>
                ))}
              </div>
              <p className="mt-3 flex items-center justify-between gap-3 font-mono text-[0.55rem] uppercase tracking-[0.2em] text-[var(--faint)]">
                <span className="sel-caret">Pick a fighter — try my other stances</span>
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

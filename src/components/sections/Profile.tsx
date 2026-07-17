"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import Sector from "@/components/Sector";
import { runner } from "@/constants/profile";
import { skills } from "@/constants/skills";

type Rarity = "legendary" | "epic" | "rare" | "common";

/** equipped gear — rarity tiers drive the slot border colors */
const RARITY: Record<string, Rarity> = {
  React: "legendary",
  "Next.js": "legendary",
  TypeScript: "legendary",
  "Node.js": "epic",
  "Vue.js": "epic",
  "Tailwind CSS": "epic",
  "Angular.js": "rare",
  mongoDB: "rare",
  postgreSQL: "rare",
  git: "common",
  mysql: "common",
};

const RARITY_LABEL: { tier: Rarity; color: string; label: string }[] = [
  { tier: "legendary", color: "rgb(176,127,30)", label: "Legendary" },
  { tier: "epic", color: "rgb(147,68,220)", label: "Epic" },
  { tier: "rare", color: "rgb(58,110,220)", label: "Rare" },
  { tier: "common", color: "rgb(110,118,130)", label: "Common" },
];

/** stat block — the run so far */
const STATS = [
  { label: "Years of experience", value: "6+", level: 82 },
  { label: "Projects shipped", value: "10+", level: 90 },
  { label: "Parties joined", value: "5", level: 68 },
];

/**
 * GAME_02 — EDWIN QUEST. An RPG status menu: character bio panel with
 * level + XP, a stat block with animated meters, and the tech arsenal
 * as an equipment grid with rarity-tier borders.
 */
const Profile = () => {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".rpg-meter-fill[data-level]").forEach((el) => {
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
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        );
      });
    }, scopeRef);
    return () => ctx.revert();
  }, []);

  return (
    <Sector id="profile" zone="profile" zIndex={60} status="[SAVE FILE 01]">
      <div ref={scopeRef}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-[clamp(2.6rem,7vw,5.6rem)] text-[var(--ink)]">
            <span data-glitch data-text="CHARACTER" className="glitch glitch--block">
              CHARACTER
            </span>
            <span
              data-glitch
              data-glitch-delay="0.14"
              data-text="STATUS"
              className="glitch glitch--block md:ml-[6vw]"
            >
              <span className="accent-1">STATUS</span>
            </span>
          </h2>
          <p data-reveal className="hud-label hud-label--bare">
            MENU <span className="mx-2 opacity-40">▸</span> STATUS <span className="mx-2 opacity-40">▸</span> P1
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* ---- bio + stats ---- */}
          <div className="space-y-8 lg:col-span-5">
            <div data-reveal data-tilt="2.5" className="rpg-panel">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="slot-glyph !h-12 !w-12"
                    style={{ "--rarity": "176, 127, 30" } as React.CSSProperties}
                  >
                    <span className="!text-base">E</span>
                  </div>
                  <div>
                    <p className="font-display text-xl text-[var(--ink)]">{runner.name}</p>
                    <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                      {runner.role}
                    </p>
                  </div>
                </div>
                <span className="tag">LV {new Date().getFullYear() - runner.est}</span>
              </div>

              <div className="mt-5">
                <div className="mb-1.5 flex justify-between font-mono text-[0.55rem] uppercase tracking-[0.2em] text-[var(--muted)]">
                  <span>XP — next class: Principal Dev</span>
                  <span className="text-[var(--accent-primary)]">7400 / 9999</span>
                </div>
                <div className="rpg-meter">
                  <div className="rpg-meter-fill" data-level="74" />
                </div>
              </div>

              {/* dialog-box bio */}
              <p className="mt-6 border-l-2 border-[rgba(var(--accent-primary-rgb),0.4)] pl-4 text-[0.95rem] leading-relaxed text-[var(--muted)]">
                {runner.bio}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="tag tag--dim">ORIGIN: {runner.location}</span>
                <span className="tag tag--dim">GUILD: FREELANCE</span>
              </div>
            </div>

            <div data-reveal data-tilt="2.5" className="rpg-panel">
              <p className="hud-label mb-5">Stat block</p>
              <div className="space-y-4">
                {STATS.map((s) => (
                  <div key={s.label} className="rpg-row !block">
                    <div className="flex items-baseline justify-between">
                      <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[var(--muted)]">
                        {s.label}
                      </span>
                      <span className="font-display text-2xl text-[var(--ink)]">{s.value}</span>
                    </div>
                    <div className="rpg-meter mt-2">
                      <div className="rpg-meter-fill" data-level={s.level} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-5 flex items-center gap-2 font-mono text-[0.56rem] uppercase tracking-[0.2em] text-[var(--faint)]">
                <span className="live-dot text-[var(--accent-secondary)]" />
                Active quest: shipping AI-powered web apps
              </p>
            </div>
          </div>

          {/* ---- equipment grid ---- */}
          <div className="lg:col-span-7">
            <div data-reveal data-tilt="2" className="rpg-panel h-full">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <p className="hud-label">Equipment — tech arsenal</p>
                <span className="tag tag--2">{skills.length}/12 SLOTS</span>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {skills.map((skill) => {
                  const tier = RARITY[skill] ?? "common";
                  return (
                    <div key={skill} className={`slot slot--${tier}`} data-cursor-label={tier.toUpperCase()}>
                      <div className="slot-glyph">
                        <span>{skill.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <span className="slot-name">{skill}</span>
                    </div>
                  );
                })}
                {/* one empty slot — always learning */}
                <div className="slot opacity-70" style={{ borderStyle: "dashed" }}>
                  <span className="slot-name">
                    EMPTY SLOT
                    <br />
                    (always learning)
                  </span>
                </div>
              </div>

              {/* rarity legend */}
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--line-soft)] pt-4">
                {RARITY_LABEL.map((r) => (
                  <span
                    key={r.tier}
                    className="flex items-center gap-2 font-mono text-[0.54rem] uppercase tracking-[0.18em] text-[var(--muted)]"
                  >
                    <span className="h-2 w-2 rotate-45" style={{ background: r.color }} />
                    {r.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Sector>
  );
};

export default Profile;

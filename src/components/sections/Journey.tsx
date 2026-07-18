"use client";

import { useEffect, useRef } from "react";
import { Trophy, Medal, Download } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import Sector from "@/components/Sector";
import { experiences, skillGroups } from "@/constants/profile";
import { certifications } from "@/constants/skills";
import { resumeLink } from "@/constants/links";

/** 3/4-circle speedo arc: pathLength=100, 75 units visible */
const ARC_SPAN = 75;

/**
 * GAME_05 — CAREER DRIVE GT. Bright-white racing UI: speedometer gauges
 * that needle up on entry, the 5 roles as checkpoints down a scrolling
 * road — with a kart that actually drives the track as you scroll —
 * trophies in the case, and the CV as downloadable career stats.
 */
const Journey = () => {
  const scopeRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const kartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      /* speedo gauges tick up */
      gsap.utils.toArray<HTMLElement>(".gauge[data-level]").forEach((el) => {
        const level = parseFloat(el.dataset.level ?? "0");
        const arc = el.querySelector<SVGCircleElement>(".gauge-arc");
        const num = el.querySelector<HTMLElement>(".gauge-num");
        const apply = (v: number) => {
          arc?.setAttribute("stroke-dasharray", `${(v / 100) * ARC_SPAN} 100`);
          if (num) num.textContent = `${Math.round(v)}`;
        };
        if (reduced) {
          apply(level);
          return;
        }
        const proxy = { v: 0 };
        gsap.to(proxy, {
          v: level,
          duration: 1.4,
          ease: "power3.out",
          onUpdate: () => apply(proxy.v),
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      /* the kart drives Season 1 → Season 5 with real scroll progress */
      const track = trackRef.current;
      const kart = kartRef.current;
      if (track && kart && !reduced) {
        gsap.fromTo(
          kart,
          { y: 0 },
          {
            y: () => track.offsetHeight - 80,
            ease: "none",
            scrollTrigger: {
              trigger: track,
              start: "top 72%",
              end: "bottom 45%",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          }
        );
        // gentle steering wobble while driving
        gsap.to(kart.querySelector("svg"), {
          rotation: 3,
          duration: 0.9,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }
    }, scopeRef);
    return () => ctx.revert();
  }, []);

  return (
    <Sector id="journey" zone="journey" zIndex={45} status="[SEASON COMPLETE]">
      <div ref={scopeRef}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-[clamp(2.6rem,7vw,5.6rem)] text-[var(--ink)]">
            <span data-glitch data-text="CAREER" className="glitch glitch--block">
              CAREER
            </span>
            <span
              data-glitch
              data-glitch-delay="0.14"
              data-text="MODE"
              className="glitch glitch--block md:ml-[6vw]"
            >
              <span className="accent-1">MODE</span>
            </span>
          </h2>
          <div data-reveal className="flex items-center gap-3">
            <span className="checker h-4 w-14 opacity-70" aria-hidden />
            <p className="hud-label hud-label--bare">5 SEASONS — ALL PODIUMS</p>
          </div>
        </div>

        {/* checkered flag strip */}
        <div data-reveal className="checker-strip mt-8" aria-hidden />

        {/* ---- speedometer gauges ---- */}
        <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4">
          {skillGroups.map((g, i) => (
            <div
              key={g.category}
              data-reveal
              data-reveal-delay={String(i * 0.08)}
              className="gauge flex flex-col items-center"
              data-level={g.level}
            >
              <div className="relative h-28 w-28 md:h-32 md:w-32">
                <svg className="h-full w-full rotate-[135deg]" viewBox="0 0 100 100" fill="none">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    pathLength={100}
                    strokeWidth="6"
                    strokeDasharray={`${ARC_SPAN} 100`}
                    strokeLinecap="round"
                    style={{ stroke: "rgba(var(--ink-rgb), 0.14)" }}
                  />
                  <circle
                    className="gauge-arc"
                    cx="50"
                    cy="50"
                    r="42"
                    pathLength={100}
                    strokeWidth="6"
                    strokeDasharray="0 100"
                    strokeLinecap="round"
                    style={{
                      stroke: "var(--accent-primary)",
                      filter: "drop-shadow(0 0 6px rgba(var(--accent-primary-rgb),0.45))",
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="gauge-num font-display text-3xl text-[var(--ink)]">0</span>
                  <span className="font-mono text-[0.5rem] uppercase tracking-[0.2em] text-[var(--faint)]">
                    / 100
                  </span>
                </div>
              </div>
              <p className="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.24em] text-[var(--muted)]">
                {g.category}
              </p>
              <p className="mt-1 max-w-[180px] text-center font-mono text-[0.5rem] leading-relaxed tracking-[0.06em] text-[var(--faint)]">
                {g.items.join(" · ")}
              </p>
            </div>
          ))}
        </div>

        {/* ---- the career track ---- */}
        <div ref={trackRef} className="relative mt-20">
          {/* scrolling road */}
          <div className="road-strip" aria-hidden />
          {/* the kart — scroll drives it from Season 1 to Season 5 */}
          <div ref={kartRef} className="kart" aria-hidden>
            <svg width="30" height="46" viewBox="0 0 30 46" fill="none">
              <rect x="7" y="6" width="16" height="32" rx="6" fill="var(--accent-primary)" />
              <rect x="10" y="14" width="10" height="9" rx="2" fill="#16181d" />
              <rect x="2" y="8" width="5" height="10" rx="2" fill="#16181d" />
              <rect x="23" y="8" width="5" height="10" rx="2" fill="#16181d" />
              <rect x="2" y="28" width="5" height="10" rx="2" fill="#16181d" />
              <rect x="23" y="28" width="5" height="10" rx="2" fill="#16181d" />
              <rect x="9" y="2" width="12" height="4" rx="2" fill="#16181d" />
            </svg>
          </div>

          <div className="space-y-10">
            {experiences.map((exp, i) => {
              const left = i % 2 === 0;
              return (
                <div
                  key={exp.company}
                  className={`relative flex md:w-1/2 ${left ? "md:pr-14" : "md:ml-auto md:pl-14"} pl-20 md:pl-0 ${left ? "" : "md:pr-0"}`}
                >
                  {/* checkpoint marker */}
                  <span
                    className={`absolute top-6 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-2 border-[var(--accent-primary)] font-mono text-[0.58rem] font-semibold text-[var(--accent-primary)] ${
                      left ? "left-[3.6rem] md:left-full" : "left-[3.6rem] md:left-0"
                    }`}
                    style={{
                      background: "rgb(var(--surface-hi))",
                      boxShadow: "0 4px 12px rgba(20,22,27,0.25)",
                    }}
                    aria-hidden
                  >
                    {experiences.length - i}
                  </span>

                  <article data-reveal className="race-card w-full p-6 md:p-7">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="race-flag">
                        <span className="checker h-2.5 w-6" aria-hidden />
                        RACE COMPLETE
                      </span>
                      <span className="font-mono text-[0.56rem] uppercase tracking-[0.18em] text-[var(--faint)]">
                        {exp.period}
                      </span>
                    </div>
                    <h3 className="font-display mt-3 text-2xl text-[var(--ink)]">{exp.company}</h3>
                    <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[var(--accent-primary)]">
                      {exp.position}
                    </p>
                    <p className="mt-3 text-[0.9rem] leading-relaxed text-[var(--muted)]">
                      {exp.description}
                    </p>
                  </article>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---- trophy case + career stats ---- */}
        <div className="mt-20 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div data-reveal className="panel p-7 lg:col-span-7">
            <p className="hud-label mb-6">Trophy case</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {certifications.map((cert, i) => (
                <div
                  key={cert}
                  className="flex items-center gap-4 border border-[var(--line-soft)] bg-[rgba(var(--ink-rgb),0.03)] p-4"
                >
                  <span
                    className="flex h-11 w-11 flex-none items-center justify-center rounded-full border"
                    style={{
                      color: i === 0 ? "#b07f1e" : "#6e7a87",
                      borderColor: i === 0 ? "rgba(176,127,30,0.5)" : "rgba(110,122,135,0.45)",
                      background: i === 0 ? "rgba(240,180,60,0.14)" : "rgba(110,122,135,0.1)",
                    }}
                  >
                    {i === 0 ? <Trophy className="h-5 w-5" strokeWidth={1.5} /> : <Medal className="h-5 w-5" strokeWidth={1.5} />}
                  </span>
                  <div>
                    <p className="text-[0.95rem] font-semibold text-[var(--ink)]">{cert}</p>
                    <p className="font-mono text-[0.54rem] uppercase tracking-[0.2em] text-[var(--faint)]">
                      {i === 0 ? "Gold trophy — certified" : "Silver trophy — certified"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div data-reveal className="panel flex flex-col justify-between gap-6 p-7 lg:col-span-5">
            <div>
              <p className="hud-label mb-3">Resume</p>
              <p className="text-[0.92rem] leading-relaxed text-[var(--muted)]">
                Want the full record? Every role, skill, and certification in one document.
              </p>
            </div>
            <a
              href={resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-game w-fit"
              data-cursor-label="RESUME"
              aria-label="Download my resume (CV)"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={2} />
              Download Resume (CV)
            </a>
          </div>
        </div>
      </div>
    </Sector>
  );
};

export default Journey;

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
 * GAME_05 — CAREER DRIVE GT. A racing career mode: skill readouts as
 * speedometer gauges that tick up on entry, the 5 roles as completed
 * checkpoints down a center racing line, certifications in the trophy
 * case, and the CV as downloadable career stats.
 */
const Journey = () => {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
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
            <span className="checker h-4 w-14 opacity-40" aria-hidden />
            <p className="hud-label hud-label--bare">5 SEASONS — ALL PODIUMS</p>
          </div>
        </div>

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
                    stroke="rgba(238,242,247,0.08)"
                    strokeWidth="6"
                    strokeDasharray={`${ARC_SPAN} 100`}
                    strokeLinecap="round"
                  />
                  <circle
                    className="gauge-arc"
                    cx="50"
                    cy="50"
                    r="42"
                    pathLength={100}
                    stroke="var(--accent-primary)"
                    strokeWidth="6"
                    strokeDasharray="0 100"
                    strokeLinecap="round"
                    style={{ filter: "drop-shadow(0 0 6px rgba(var(--accent-primary-rgb),0.6))" }}
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
        <div className="relative mt-20">
          {/* center racing line */}
          <div
            className="absolute bottom-0 left-4 top-0 w-px md:left-1/2"
            style={{
              background:
                "repeating-linear-gradient(180deg, rgba(var(--accent-primary-rgb),0.5) 0 14px, transparent 14px 26px)",
            }}
            aria-hidden
          />
          <div className="space-y-10">
            {experiences.map((exp, i) => {
              const left = i % 2 === 0;
              return (
                <div
                  key={exp.company}
                  className={`relative flex md:w-1/2 ${left ? "md:pr-10" : "md:ml-auto md:pl-10"} pl-12 md:pl-0 ${left ? "" : "md:pr-0"}`}
                >
                  {/* checkpoint marker */}
                  <span
                    className={`absolute top-6 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-[rgba(var(--accent-primary-rgb),0.6)] bg-[#0c0a0d] font-mono text-[0.58rem] text-[var(--accent-primary)] ${
                      left ? "left-4 md:left-full" : "left-4 md:left-0"
                    }`}
                    style={{ boxShadow: "0 0 14px rgba(var(--accent-primary-rgb),0.35)" }}
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
                    <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[var(--accent-secondary)]">
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
                  className="flex items-center gap-4 border border-[var(--line-soft)] bg-[rgba(238,242,247,0.02)] p-4"
                >
                  <span
                    className="flex h-11 w-11 flex-none items-center justify-center rounded-full border"
                    style={{
                      color: i === 0 ? "#e2b155" : "#c7cfd9",
                      borderColor: i === 0 ? "rgba(226,177,85,0.5)" : "rgba(199,207,217,0.4)",
                      background: i === 0 ? "rgba(226,177,85,0.08)" : "rgba(199,207,217,0.06)",
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
              <p className="hud-label mb-3">Career stats</p>
              <p className="text-[0.92rem] leading-relaxed text-[var(--muted)]">
                Full telemetry — every season, every finish, every lap time. Grab the complete
                record sheet.
              </p>
            </div>
            <a
              href={resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-game w-fit"
              data-cursor-label="CV"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={2} />
              Download Career Stats
            </a>
          </div>
        </div>
      </div>
    </Sector>
  );
};

export default Journey;

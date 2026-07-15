"use client";

import { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { gsap, EASE_OUT, prefersReducedMotion } from "@/lib/gsap";
import Sector from "@/components/Sector";
import GlitchText from "@/components/fx/GlitchText";
import { experiences, skillGroups } from "@/constants/profile";
import { certifications } from "@/constants/skills";
import { resumeLink } from "@/constants/links";

const RapSheet = () => {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      if (!reduced) {
        gsap.fromTo(
          ".log-spine",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top",
            scrollTrigger: {
              trigger: ".log-list",
              start: "top 75%",
              end: "bottom 60%",
              scrub: true,
            },
          }
        );
      }

      // neon meters: fill with a glowing head, flicker on arrival
      gsap.utils.toArray<HTMLElement>(".meter-fill").forEach((el) => {
        const level = parseInt(el.dataset.level!, 10) / 100;
        if (reduced) {
          gsap.set(el, { scaleX: level });
          return;
        }
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: level,
            duration: 1.4,
            ease: EASE_OUT,
            scrollTrigger: { trigger: el, start: "top 90%" },
            onComplete: () => el.classList.add("meter-hot"),
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".meter-val").forEach((el) => {
        const level = parseInt(el.dataset.level!, 10);
        if (reduced) {
          el.textContent = `${level}%`;
          return;
        }
        const obj = { v: 0 };
        gsap.to(obj, {
          v: level,
          duration: 1.4,
          ease: EASE_OUT,
          scrollTrigger: { trigger: el, start: "top 90%" },
          onUpdate: () => {
            el.textContent = `${Math.round(obj.v)}%`;
          },
        });
      });
    }, innerRef);

    return () => ctx.revert();
  }, []);

  return (
    <Sector id="log" index="04" name="RAP SHEET" jp="記録" status="[RECORD RETRIEVED]" zIndex={40}>
      <div ref={innerRef}>
        <h2 className="font-display text-[clamp(2.4rem,6vw,4.8rem)] text-[var(--ink)]">
          <GlitchText as="span" className="glitch--block" text="MISSION" />
          <GlitchText as="span" className="glitch--block md:ml-[6vw]" text="LOG." delay={0.14} />
        </h2>

        <div className="mt-16 grid grid-cols-1 gap-20 lg:grid-cols-2 lg:gap-14">
          {/* ---- experience log ---- */}
          <div>
            <p data-reveal className="hud-label mb-10">
              Field record — 5 crews
            </p>

            <div className="log-list relative pl-8">
              <div className="absolute bottom-1 left-0 top-1 w-px bg-[rgba(232,238,245,0.1)]">
                <div
                  className="log-spine h-full w-px"
                  style={{
                    background: "linear-gradient(180deg, var(--cyan), var(--magenta))",
                    boxShadow: "0 0 8px rgba(0,229,255,0.4)",
                  }}
                />
              </div>

              <div className="space-y-14">
                {experiences.map((exp, i) => (
                  <div key={exp.company} data-reveal className="relative">
                    <span
                      className="absolute -left-[2.28rem] top-1.5 h-2 w-2 rotate-45 bg-[var(--cyan)]"
                      style={{ boxShadow: "0 0 8px rgba(0,229,255,0.7)" }}
                      aria-hidden
                    />
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-[var(--faint)]">
                      LOG_{String(experiences.length - i).padStart(2, "0")}
                      <span className="mx-2 opacity-40">{"//"}</span>
                      <span className="text-[var(--cyan)]">{exp.period}</span>
                    </p>
                    <h4 className="font-display mt-2.5 text-xl text-[var(--ink)] md:text-2xl">
                      {exp.position}
                    </h4>
                    <p className="mt-1 font-mono text-xs tracking-[0.06em] text-[var(--magenta)]">
                      @ {exp.company}
                    </p>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--muted)]">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div data-reveal className="mt-14 flex flex-wrap items-center gap-4">
              <a
                href={resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-neon btn-chrome"
              >
                Download dossier <ArrowDown size={14} />
              </a>
              <span className="tag tag--dim">[ENCRYPTED PDF]</span>
            </div>
          </div>

          {/* ---- proficiency meters + clearance ---- */}
          <div>
            <p data-reveal className="hud-label mb-10">
              System proficiency
            </p>

            <div className="space-y-10">
              {skillGroups.map((group) => (
                <div key={group.category} data-reveal>
                  <div className="mb-3 flex items-baseline justify-between">
                    <h4 className="font-display text-lg text-[var(--ink)]">{group.category}</h4>
                    <span className="meter-val font-mono text-xs text-[var(--cyan)]" data-level={String(group.level)}>
                      0%
                    </span>
                  </div>

                  <div className="meter">
                    <div className="meter-fill" data-level={String(group.level)}>
                      <span className="meter-head" />
                    </div>
                  </div>

                  <div className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1.5">
                    {group.items.map((skill) => (
                      <span
                        key={skill}
                        className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-[var(--faint)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div data-reveal className="tgt mt-16 border border-[var(--line)] bg-[rgba(14,14,24,0.6)] p-8">
              <p className="hud-label mb-6">Clearance levels</p>
              <ul className="space-y-4">
                {certifications.map((certificate, i) => (
                  <li key={certificate} className="flex items-center justify-between gap-4">
                    <span className="flex items-baseline gap-3">
                      <span className="font-mono text-[0.6rem] tracking-[0.2em] text-[var(--magenta)]">
                        LV.{String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm text-[var(--ink)] md:text-base">{certificate}</span>
                    </span>
                    <span className="tag">Unlocked</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Sector>
  );
};

export default RapSheet;

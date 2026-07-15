"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import Sector from "@/components/Sector";
import GlitchText from "@/components/fx/GlitchText";
import { runner } from "@/constants/profile";
import { skills } from "@/constants/skills";
import { projects } from "@/constants/projects";

const Profile = () => {
  const innerRef = useRef<HTMLDivElement>(null);
  const years = new Date().getFullYear() - runner.est;

  const stats = [
    { value: years, suffix: "+", label: "Years in the field" },
    { value: projects.length, suffix: "+", label: "Runs completed" },
    { value: 5, suffix: "", label: "Crews served" },
  ];

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      // HUD stat readouts count up when scanned
      gsap.utils.toArray<HTMLElement>(".stat-num").forEach((el) => {
        const target = parseInt(el.dataset.value!, 10);
        const render = (v: number) => {
          el.textContent = String(Math.round(v)).padStart(2, "0");
        };
        if (reduced) {
          render(target);
          return;
        }
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.3,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
          onUpdate: () => render(obj.v),
        });
      });

      if (!reduced) {
        gsap.fromTo(
          ".chip",
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
            ease: "power3.out",
            stagger: 0.035,
            scrollTrigger: { trigger: ".arsenal-grid", start: "top 88%" },
          }
        );
      }
    }, innerRef);

    return () => ctx.revert();
  }, []);

  return (
    <Sector
      id="profile"
      index="01"
      name="PROFILE // ID"
      jp="身元"
      status="[DOSSIER DECRYPTED]"
      alt
      zIndex={55}
    >
      <div ref={innerRef}>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* headline + bio + stats */}
          <div className="lg:col-span-7">
            <h2 className="font-display text-[clamp(2.4rem,6vw,4.8rem)] text-[var(--ink)]">
              <GlitchText as="span" className="glitch--block" text="A DEVELOPER" />
              <GlitchText as="span" className="glitch--block md:ml-[7vw]" text="WIRED DIFFERENT." delay={0.14} />
            </h2>

            <p data-reveal className="mt-10 max-w-md leading-relaxed text-[var(--muted)]">
              {runner.bio}
            </p>

            <div className="mt-12 flex flex-wrap gap-x-14 gap-y-8">
              {stats.map((stat) => (
                <div key={stat.label} data-reveal className="flex flex-col gap-2">
                  <span className="font-display text-5xl text-[var(--ink)] md:text-6xl">
                    <span className="stat-num" data-value={String(stat.value)}>
                      00
                    </span>
                    {stat.suffix && <span className="neon-cyan">{stat.suffix}</span>}
                  </span>
                  <span className="hud-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* dossier readout */}
          <div className="lg:col-span-5">
            <div data-reveal className="tgt border border-[var(--line)] bg-[rgba(14,14,24,0.6)] p-7 md:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <p className="hud-label">Dossier — E.S.Y</p>
                <span className="tag tag--m">
                  <span className="live-dot" />
                  Open for runs
                </span>
              </div>

              <dl className="flex flex-col gap-4 font-mono text-[0.68rem] uppercase tracking-[0.16em]">
                {[
                  ["Handle", "Edwin"],
                  ["Full name", runner.name],
                  ["Class", runner.role],
                  ["Base", runner.location],
                  ["Active since", String(runner.est)],
                ].map(([key, value]) => (
                  <div key={key} className="flex items-baseline justify-between gap-6 border-b border-[var(--line)] pb-3">
                    <dt className="text-[var(--faint)]">{key}</dt>
                    <dd className="text-right text-[var(--ink)]">{value}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-6 font-mono text-[0.6rem] leading-relaxed tracking-[0.08em] text-[var(--faint)]">
                {"// pixel-perfect interfaces to scalable back-end systems."}
                <br />
                {"// no job too deep in the stack."}
              </p>
            </div>
          </div>
        </div>

        {/* arsenal — installed programs */}
        <div className="mt-24">
          <div data-reveal className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <p className="hud-label">Arsenal // installed programs</p>
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-[var(--faint)]">
              {String(skills.length).padStart(2, "0")} modules loaded
            </span>
          </div>
          <div className="arsenal-grid flex max-w-4xl flex-wrap gap-2.5">
            {skills.map((skill) => (
              <span key={skill} className="chip">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Sector>
  );
};

export default Profile;

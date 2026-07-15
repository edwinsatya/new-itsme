"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger, countUp, EASE_IMPACT, prefersReducedMotion } from "@/lib/gsap";
import { useRevealScope } from "@/hooks/useRevealScope";
import { skills } from "@/constants/skills";
import { projects } from "@/constants/projects";
import ChapterHeader from "./fx/ChapterHeader";
import SfxPop from "./fx/SfxPop";

const Origin = () => {
  const scope = useRevealScope<HTMLElement>();
  const experienceYears = new Date().getFullYear() - 2020;

  const stats = [
    { value: experienceYears, suffix: "+", label: "Experience Lv." },
    { value: projects.length, suffix: "+", label: "Missions cleared" },
    { value: 5, suffix: "", label: "Guilds joined" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const nums = gsap.utils.toArray<HTMLElement>(".stat-num");

      if (prefersReducedMotion()) {
        nums.forEach((el) => {
          el.textContent = `${el.dataset.value}${el.dataset.suffix ?? ""}`;
        });
        gsap.set(".arsenal-chip", { opacity: 1 });
        return;
      }

      // power-level readouts count up fast when they enter
      nums.forEach((el) => {
        const to = parseFloat(el.dataset.value!);
        const suffix = el.dataset.suffix ?? "";
        el.textContent = `0${suffix}`;
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => countUp(el, to, { duration: 0.9, suffix }),
        });
      });

      // equipped techniques snap in one after another
      gsap.fromTo(
        ".arsenal-chip",
        { scale: 0.4, rotation: -8, opacity: 0 },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.45,
          ease: EASE_IMPACT,
          stagger: 0.045,
          scrollTrigger: { trigger: ".arsenal-grid", start: "top 88%" },
        }
      );
    }, scope);

    return () => ctx.revert();
  }, [scope]);

  return (
    <section id="origin" ref={scope} className="theme-paper section-shell overflow-hidden">
      {/* backdrop texture */}
      <div
        className="halftone-fade pointer-events-none absolute left-[-6%] top-[6%] h-96 w-[34rem] text-[var(--ink)] opacity-20"
        aria-hidden
      />
      <p
        className="font-jp pointer-events-none absolute bottom-[2%] right-[-2%] select-none text-[clamp(6rem,20vw,16rem)] leading-none opacity-[0.06]"
        aria-hidden
      >
        起源
      </p>

      <div className="relative z-10 mx-auto max-w-6xl">
        <ChapterHeader
          chapter={1}
          sub="Profile — The Protagonist"
          lines={["Origin", "Story"]}
        />

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Backstory panel */}
          <div data-wipe className="lg:col-span-7">
            <div className="panel h-full p-8 md:p-10">
              <div
                className="halftone pointer-events-none absolute right-0 top-0 h-24 w-40 text-[var(--ink)] opacity-15"
                aria-hidden
              />
              <p className="hud-label mb-5 text-[var(--red)]">Narration</p>
              <p className="max-w-xl text-lg leading-relaxed">
                You can call me <strong>Edwin</strong>. A developer from a small town in
                Indonesia who chose the long road — crafting high-quality digital
                experiences, from pixel-perfect interfaces to scalable back-end systems.
                Every project since 2020 has been another episode in the grind.
              </p>
              <p className="mt-6 font-mono text-[0.68rem] uppercase tracking-[0.2em] opacity-60">
                &ldquo;A developer... set on a different path.&rdquo;
              </p>
            </div>
          </div>

          {/* Power stats */}
          <div className="relative lg:col-span-5">
            <SfxPop text="POWER UP!" className="-top-8 right-2 text-2xl md:text-3xl" />
            <div className="flex h-full flex-col justify-center gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  data-reveal
                  className="flex items-baseline justify-between gap-6 border-b-[3px] border-[var(--ink)] pb-4"
                >
                  <span
                    className="stat-num font-display text-5xl text-[var(--red)] md:text-6xl"
                    data-value={stat.value}
                    data-suffix={stat.suffix}
                  >
                    {stat.value}
                    {stat.suffix}
                  </span>
                  <span className="hud-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Arsenal */}
        <div className="relative z-10 mt-20">
          <p data-reveal className="hud-label mb-6">
            Arsenal — Equipped techniques
          </p>
          <div className="arsenal-grid flex max-w-4xl flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="arsenal-chip chip cursor-default border-[var(--ink)] bg-[var(--paper)] px-4 py-2 !text-[0.68rem] opacity-0 shadow-[3px_3px_0_var(--ink)] transition-colors duration-200 hover:bg-[var(--ink)] hover:text-[var(--paper)]"
                data-cursor
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Origin;

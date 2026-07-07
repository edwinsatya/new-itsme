"use client";

import { useEffect } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { useRevealScope } from "@/hooks/useRevealScope";
import { skills } from "@/constants/skills";
import { projects } from "@/constants/projects";
import {
  useSectionParallax,
  SunOutline,
  Cloud,
  Ridge,
  DotMesh,
  CrossMarks,
  SectionGrid,
} from "./scenes";

const About = () => {
  const scope = useRevealScope<HTMLElement>();
  const currentExperience = new Date().getFullYear() - 2020;

  const stats = [
    { value: `${currentExperience}+`, label: "Years of experience" },
    { value: `${projects.length}+`, label: "Projects shipped" },
    { value: "5", label: "Companies worked with" },
  ];

  useSectionParallax(scope);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".skill-chip",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.03,
          scrollTrigger: { trigger: ".skills-grid", start: "top 88%" },
        }
      );
    }, scope);

    return () => ctx.revert();
  }, [scope]);

  return (
    <section id="about" ref={scope} data-theme="offwhite" className="section-shell overflow-hidden">
      {/* Daytime scenery */}
      <SectionGrid />
      <SunOutline className="right-[8%] top-[6%] h-64 w-64 text-[#0e4347] opacity-20 md:h-96 md:w-96" speed={-0.3} />
      <Cloud className="left-[6%] top-[14%] h-16 w-56 text-[#0e4347] opacity-[0.06]" speed={-0.4} />
      <Cloud className="left-[55%] top-[42%] h-12 w-44 text-[#0e4347] opacity-[0.05]" speed={-0.22} />
      <DotMesh className="left-[4%] top-[58%] hidden h-40 w-80 text-[#0e4347] opacity-25 md:block" speed={-0.3} />
      <CrossMarks className="text-[#0e4347] opacity-30" speed={-0.22} />
      <Ridge className="h-40 text-[#0e4347] opacity-[0.05] md:h-56" speed={0.2} />

      <div data-enter className="relative mx-auto min-h-[120vh] max-w-6xl">
        {/* Headline block — KPR statement style */}
        <div data-reveal className="mb-10 flex flex-wrap items-center justify-between gap-3">
          <p className="hud-label">001 — Profile</p>
          <p className="hud-label">WX // Sunny — 28°C</p>
        </div>

        <h2
          data-scroll-speed="-0.2"
          className="font-display relative z-10 text-[clamp(2.2rem,6vw,4.8rem)] text-[var(--ink)]"
        >
          <span className="line-mask md:ml-[14vw]">
            <span>A developer... set</span>
          </span>
          <span className="line-mask">
            <span>on a different path.</span>
          </span>
        </h2>

        {/* Floating folder cards */}
        <div
          data-scroll-speed="-0.4"
          className="absolute right-0 top-[24rem] z-0 hidden w-72 md:block lg:w-80"
        >
          <div className="folder-card folder-card--right aspect-[3/4] shadow-xl">
            <span className="folder-label hud-label !text-[#0e4347]">Happy Farm</span>
            <Image
              src="/ssproject6.svg"
              alt="Happy Farm dashboard"
              fill
              sizes="320px"
              className="object-cover"
            />
          </div>
        </div>
        <div
          data-scroll-speed="-0.22"
          className="absolute left-[38%] top-[30rem] z-0 hidden w-52 md:block"
        >
          <div className="folder-card aspect-[4/3] shadow-lg">
            <span className="folder-label hud-label !text-[#0e4347]">Bountie Hunter</span>
            <Image
              src="/ssproject9.svg"
              alt="Bountie hunter project"
              fill
              sizes="208px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Body copy — bottom-left like KPR */}
        <div className="relative z-10 mt-24 max-w-sm md:mt-56">
          <p data-reveal className="text-base leading-relaxed text-[var(--ink)]">
            You can call me Edwin. I&apos;m a passionate web developer based in Indonesia, dedicated
            to crafting high-quality digital experiences — from pixel-perfect interfaces to
            scalable back-end systems.
          </p>

          <div data-reveal className="mt-10 flex flex-col gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-4 border-b border-[var(--line)] pb-3">
                <span className="font-display text-3xl text-[var(--ink)]">{stat.value}</span>
                <span className="hud-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="relative z-10 mt-24">
          <p data-reveal className="hud-label mb-6">
            Arsenal
          </p>
          <div className="skills-grid flex max-w-3xl flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="skill-chip border border-[var(--line)] px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] text-[var(--ink)] transition-colors duration-300 hover:bg-[var(--ink)] hover:text-[var(--bg)]"
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

export default About;

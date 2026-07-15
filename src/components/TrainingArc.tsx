"use client";

import { useEffect } from "react";
import { ArrowDown } from "lucide-react";
import { gsap, ScrollTrigger, countUp, prefersReducedMotion } from "@/lib/gsap";
import { useRevealScope } from "@/hooks/useRevealScope";
import { resumeLink } from "@/constants/links";
import { certifications } from "@/constants/skills";
import ChapterHeader from "./fx/ChapterHeader";
import ChargeButton from "./fx/ChargeButton";
import SfxPop from "./fx/SfxPop";

const arcs = [
  {
    arc: "Arc 05",
    name: "The Harvest Arc",
    period: "Nov 2025 — Mar 2026",
    company: "Tola Solution — Happy Farm Project",
    position: "Full Stack Developer",
    description:
      "Played a key role in the development of the Happy Farm project, contributing to both frontend and backend development to create an engaging and efficient platform for users.",
  },
  {
    arc: "Arc 04",
    name: "The Publishing Arc",
    period: "Jun 2023 — Feb 2025",
    company: "Magloft",
    position: "Full Stack Developer",
    description:
      "Contributed to the development of Magloft's digital publishing platform, enhancing features and optimizing performance for a seamless user experience.",
  },
  {
    arc: "Arc 03",
    name: "The Bounty Arc",
    period: "May 2022 — Jun 2023",
    company: "Bountie",
    position: "Software Engineer",
    description:
      "Worked on developing and optimizing web applications, collaborating with cross-functional teams to deliver high-quality software solutions.",
  },
  {
    arc: "Arc 02",
    name: "The Healing Arc",
    period: "Mar 2020 — May 2022",
    company: "homecare24.id",
    position: "Front-end Developer",
    description:
      "Developed and maintained the front-end of the homecare24.id platform, focusing on user experience and performance optimization.",
  },
  {
    arc: "Arc 01",
    name: "Prologue — First Spark",
    period: "Sep 2013 — Jan 2014",
    company: "Telkom Indonesia",
    position: "Network Fiber Optic Internship",
    description:
      "Assisted in the installation and maintenance of fiber optic networks, ensuring optimal connectivity and performance.",
  },
];

const powerLevels = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "Vue.js", "Angular.js", "TypeScript", "Tailwind CSS"],
    level: 90,
  },
  { category: "Backend", items: ["Node.js", "Express", "RestAPI", "Graphql"], level: 80 },
  { category: "Database", items: ["MongoDB", "PostgreSQL", "MySQL"], level: 80 },
  { category: "Tools", items: ["Git", "Docker", "AWS", "Figma", "VS Code"], level: 88 },
];

const TrainingArc = () => {
  const scope = useRevealScope<HTMLElement>();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const meters = gsap.utils.toArray<HTMLElement>(".power-meter");

      if (prefersReducedMotion()) {
        meters.forEach((el) => {
          const level = parseFloat(el.dataset.level!);
          gsap.set(el.querySelector(".power-fill"), { scaleX: level / 100 });
          const num = el.querySelector<HTMLElement>(".power-num");
          if (num) num.textContent = `${level}%`;
        });
        gsap.set(".arc-spine-fill", { scaleY: 1 });
        return;
      }

      // spine draws itself as the training arcs scroll past
      gsap.fromTo(
        ".arc-spine-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: {
            trigger: ".arc-list",
            start: "top 75%",
            end: "bottom 60%",
            scrub: true,
          },
        }
      );

      // power meters slam full with overshoot, numbers race up
      meters.forEach((el) => {
        const level = parseFloat(el.dataset.level!);
        const fill = el.querySelector(".power-fill");
        const num = el.querySelector<HTMLElement>(".power-num");

        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.fromTo(
              fill,
              { scaleX: 0 },
              {
                scaleX: level / 100,
                duration: 1.1,
                ease: "back.out(1.6)",
                transformOrigin: "left",
              }
            );
            if (num) countUp(num, level, { duration: 1, suffix: "%" });
          },
        });
      });
    }, scope);

    return () => ctx.revert();
  }, [scope]);

  return (
    <section id="training" ref={scope} className="theme-ink section-shell overflow-hidden">
      <div
        className="halftone-fade pointer-events-none absolute left-[-6%] top-[4%] h-96 w-[32rem] text-[var(--paper)] opacity-10"
        aria-hidden
      />
      <p
        className="font-jp pointer-events-none absolute right-[-2%] top-[30%] select-none text-[clamp(6rem,18vw,15rem)] leading-none opacity-[0.05]"
        aria-hidden
      >
        修行
      </p>

      <div className="relative z-10 mx-auto max-w-6xl">
        <ChapterHeader
          chapter={4}
          sub="Journey — Five arcs, one grind"
          lines={["Training", "Arc"]}
        />

        <div className="mt-16 grid grid-cols-1 gap-20 lg:grid-cols-2">
          {/* Story arcs timeline */}
          <div>
            <p data-reveal className="hud-label mb-10 text-[var(--red)]">
              Story arcs
            </p>

            <div className="arc-list relative pl-10">
              <div className="absolute left-0 top-0 h-full w-[3px] bg-[rgba(242,239,230,0.18)]">
                <div className="arc-spine-fill h-full w-full bg-[var(--red)]" />
              </div>

              <div className="space-y-14">
                {arcs.map((arc) => (
                  <div key={arc.company} data-reveal className="relative">
                    {/* diamond node */}
                    <span className="absolute -left-[2.85rem] top-1.5 h-3 w-3 rotate-45 border-2 border-[var(--paper)] bg-[var(--red)]" />
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <span className="brush-chip font-display bg-[var(--red)] px-2 py-0.5 text-[0.6rem] tracking-[0.16em] text-[var(--paper)]">
                        {arc.arc}
                      </span>
                      <span className="font-mono text-[0.62rem] uppercase tracking-[0.25em] opacity-60">
                        {arc.period}
                      </span>
                    </div>
                    <h4 className="font-display mt-3 text-xl uppercase md:text-2xl">
                      {arc.name}
                    </h4>
                    <p className="mt-1 font-mono text-sm text-[var(--red)]">
                      {arc.position} @ {arc.company}
                    </p>
                    <p className="mt-3 max-w-lg leading-relaxed opacity-75">
                      {arc.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div data-reveal className="mt-14">
              <ChargeButton
                href={resumeLink}
                target="_blank"
                className="btn-charge--ghost"
                cursorLabel="DOWNLOAD"
              >
                Full Character Sheet <ArrowDown size={15} />
              </ChargeButton>
            </div>
          </div>

          {/* Power levels + licenses */}
          <div>
            <div className="relative">
              <SfxPop text="LEVEL UP!" className="-top-3 right-0 text-2xl md:text-3xl" rotate={7} />
              <p data-reveal className="hud-label mb-10 text-[var(--red)]">
                Power levels
              </p>
            </div>

            <div className="space-y-10">
              {powerLevels.map((group) => (
                <div key={group.category} data-reveal className="power-meter" data-level={group.level}>
                  <div className="mb-3 flex items-baseline justify-between">
                    <h4 className="font-display text-lg uppercase">{group.category}</h4>
                    <span className="power-num font-display text-2xl text-[var(--red)]">
                      0%
                    </span>
                  </div>

                  <div className="h-5 w-full overflow-hidden border-2 border-[var(--paper)] p-[3px]">
                    <div
                      className="power-fill h-full w-full origin-left bg-[var(--red)]"
                      style={{
                        transform: "scaleX(0)",
                        backgroundImage:
                          "repeating-linear-gradient(-45deg, transparent 0 7px, rgba(242,239,230,0.35) 7px 14px)",
                      }}
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                    {group.items.map((skill) => (
                      <span
                        key={skill}
                        className="font-mono text-[0.62rem] uppercase tracking-[0.15em] opacity-65"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Licenses */}
            <div data-wipe className="mt-16">
              <div className="panel panel--red p-8 text-[var(--ink)]">
                <p className="hud-label mb-6 text-[var(--red)]">Licenses earned</p>
                <ul className="space-y-4">
                  {certifications.map((certificate) => (
                    <li key={certificate} className="flex items-start gap-3">
                      <span className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rotate-45 bg-[var(--red)]" />
                      <span className="font-mono text-sm uppercase tracking-[0.08em]">
                        {certificate}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrainingArc;

"use client";

import { useEffect } from "react";
import { ArrowDown } from "lucide-react";
import { gsap, EASE_OUT } from "@/lib/gsap";
import { useRevealScope } from "@/hooks/useRevealScope";
import { resumeLink } from "@/constants/links";
import { certifications } from "@/constants/skills";
import {
  useSectionParallax,
  SunOutline,
  Stars,
  Ridge,
  DotMesh,
  Snow,
  SectionGrid,
} from "./scenes";

const experiences = [
  {
    period: "Nov 2025 — Mar 2026",
    company: "Tola Solution — Happy Farm Project",
    position: "Full Stack Developer",
    description:
      "Played a key role in the development of the Happy Farm project, contributing to both frontend and backend development to create an engaging and efficient platform for users.",
  },
  {
    period: "Jun 2023 — Feb 2025",
    company: "Magloft",
    position: "Full Stack Developer",
    description:
      "Contributed to the development of Magloft's digital publishing platform, enhancing features and optimizing performance for a seamless user experience.",
  },
  {
    period: "May 2022 — Jun 2023",
    company: "Bountie",
    position: "Software Engineer",
    description:
      "Worked on developing and optimizing web applications, collaborating with cross-functional teams to deliver high-quality software solutions.",
  },
  {
    period: "Mar 2020 — May 2022",
    company: "homecare24.id",
    position: "Front-end Developer",
    description:
      "Developed and maintained the front-end of the homecare24.id platform, focusing on user experience and performance optimization.",
  },
  {
    period: "Sep 2013 — Jan 2014",
    company: "Telkom Indonesia",
    position: "Network Fiber Optic Internship",
    description:
      "Assisted in the installation and maintenance of fiber optic networks, ensuring optimal connectivity and performance.",
  },
];

const skillGroups = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "Vue.js", "Angular.js", "TypeScript", "Tailwind CSS"],
    level: 90,
  },
  { category: "Backend", items: ["Node.js", "Express", "RestAPI", "Graphql"], level: 80 },
  { category: "Database", items: ["MongoDB", "PostgreSQL", "MySQL"], level: 80 },
  { category: "Tools", items: ["Git", "Docker", "AWS", "Figma", "VS Code"], level: 88 },
];

const Resume = () => {
  const scope = useRevealScope<HTMLElement>();

  useSectionParallax(scope);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".timeline-spine",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: {
            trigger: ".timeline-list",
            start: "top 75%",
            end: "bottom 60%",
            scrub: true,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(".skill-meter").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.4,
            ease: EASE_OUT,
            transformOrigin: "left",
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        );
      });
    }, scope);

    return () => ctx.revert();
  }, [scope]);

  return (
    <section id="journey" ref={scope} data-theme="teal" className="section-shell overflow-hidden">
      {/* Snowy night scenery */}
      <SectionGrid />
      <Stars className="text-[#efeee8] opacity-60" speed={-0.15} />
      <SunOutline className="right-[10%] top-[4%] h-48 w-48 text-[#c0fb50] opacity-30 md:h-64 md:w-64" speed={-0.32} />
      <DotMesh className="left-[6%] top-[38%] hidden h-40 w-80 text-[#c0fb50] opacity-15 md:block" speed={-0.28} />
      <Ridge jagged className="h-40 text-[#092f33] opacity-80 md:h-64" speed={0.14} />
      <Ridge jagged className="h-24 text-[#062326] opacity-90 md:h-40" speed={0.32} />
      <Snow className="text-[#efeee8]" />

      <div data-enter className="relative z-10 mx-auto max-w-6xl">
        <div data-reveal className="mb-10 flex flex-wrap items-center justify-between gap-3">
          <p className="hud-label">004 — Journey</p>
          <p className="hud-label">WX // Snowfall — -2°C</p>
        </div>

        <h2 data-scroll-speed="-0.2" className="font-display mb-20 text-[clamp(2.2rem,6vw,4.8rem)] text-[var(--ink)]">
          <span className="line-mask md:ml-[12vw]">
            <span>The road</span>
          </span>
          <span className="line-mask">
            <span>so far.</span>
          </span>
        </h2>

        <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">
          {/* Experience timeline */}
          <div>
            <p data-reveal className="hud-label mb-10">
              Experience
            </p>

            <div className="timeline-list relative pl-8">
              <div className="absolute left-0 top-0 h-full w-px bg-[var(--line)]">
                <div className="timeline-spine h-full w-px bg-[var(--accent)]" />
              </div>

              <div className="space-y-14">
                {experiences.map((exp) => (
                  <div key={exp.company} data-reveal className="relative">
                    <span className="absolute -left-[2.3rem] top-2 h-[7px] w-[7px] bg-[var(--accent)]" />
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.25em] text-[var(--ink)] opacity-60">
                      {exp.period}
                    </p>
                    <h4 className="font-display mt-2 text-xl uppercase text-[var(--ink)] md:text-2xl">
                      {exp.position}
                    </h4>
                    <p className="mt-1 font-mono text-sm text-[var(--accent)]">@ {exp.company}</p>
                    <p className="mt-3 leading-relaxed text-[var(--ink)] opacity-75">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div data-reveal className="mt-14">
              <a href={resumeLink} target="_blank" className="btn-hud ghost">
                Download CV <ArrowDown size={14} />
              </a>
            </div>
          </div>

          {/* Skills + certifications */}
          <div>
            <p data-reveal className="hud-label mb-10">
              Technical skills
            </p>

            <div className="space-y-10">
              {skillGroups.map((group) => (
                <div key={group.category} data-reveal>
                  <div className="mb-3 flex items-baseline justify-between">
                    <h4 className="font-display text-lg uppercase text-[var(--ink)]">
                      {group.category}
                    </h4>
                    <span className="font-mono text-xs text-[var(--accent)]">{group.level}%</span>
                  </div>

                  <div className="h-px w-full bg-[var(--line)]">
                    <div
                      className="skill-meter h-px bg-[var(--accent)]"
                      style={{ width: `${group.level}%` }}
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                    {group.items.map((skill) => (
                      <span
                        key={skill}
                        className="font-mono text-[0.62rem] uppercase tracking-[0.15em] text-[var(--ink)] opacity-70"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div data-reveal className="mt-16 border border-[var(--line)] p-8">
              <p className="hud-label mb-6">Certifications</p>
              <ul className="space-y-3">
                {certifications.map((certificate) => (
                  <li key={certificate} className="flex items-start gap-3 text-[var(--ink)]">
                    <span className="mt-1 h-[6px] w-[6px] flex-shrink-0 bg-[var(--accent)]" />
                    <span>{certificate}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;

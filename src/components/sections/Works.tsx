"use client";

import Image from "next/image";
import Sector from "@/components/Sector";
import GlitchText from "@/components/fx/GlitchText";
import { projects } from "@/constants/projects";

const statusFor = (p: (typeof projects)[number]) => {
  if (p.live) return { label: "[DEPLOYED]", cls: "tag" };
  if (p.github) return { label: "[SOURCE ONLY]", cls: "tag tag--dim" };
  return { label: "[CLASSIFIED]", cls: "tag tag--m" };
};

const Works = () => (
  <Sector id="works" index="02" name="JOBS COMPLETED" jp="任務" status="[10 RUNS VERIFIED]" bg="runs" zIndex={50}>
    <div className="flex flex-wrap items-end justify-between gap-8">
      <h2 className="font-display text-[clamp(2.4rem,6vw,4.8rem)] text-[var(--ink)]">
        <GlitchText as="span" className="glitch--block" text="MISSION" />
        <GlitchText as="span" className="glitch--block md:ml-[6vw]" text="FILES." delay={0.14} />
      </h2>
      <p data-reveal className="max-w-sm text-sm leading-relaxed text-[var(--muted)]">
        Ten verified runs — AI tools, dashboards, web3 platforms. Hover a file to
        decrypt the preview; <span className="text-[var(--cyan)]">ACCESS RUN</span> jacks
        you into the live build.
      </p>
    </div>

    <div className="mt-16 grid gap-6 md:grid-cols-2 lg:gap-8">
      {projects.map((project, i) => {
        const status = statusFor(project);
        const href = project.live || project.github;
        const runNo = `RUN_${String(i + 1).padStart(2, "0")}`;

        const shot = (
          <div className="shot aspect-[16/10]">
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 560px"
              className="shot-img object-cover"
            />
            <div
              className="shot-rgb shot-rgb--c"
              style={{
                backgroundImage: `linear-gradient(rgba(0,229,255,0.35), rgba(0,229,255,0.35)), url(${project.image})`,
              }}
            />
            <div
              className="shot-rgb shot-rgb--m"
              style={{
                backgroundImage: `linear-gradient(rgba(255,46,136,0.35), rgba(255,46,136,0.35)), url(${project.image})`,
              }}
            />
            <div className="shot-veil" />
          </div>
        );

        return (
          <article
            key={project.id}
            data-reveal
            data-reveal-delay={i % 2 === 1 ? "0.1" : "0"}
            className={`mission-card tgt group p-3 md:p-4 ${i % 2 === 1 ? "md:mt-12" : ""}`}
          >
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer" data-cursor-label="ACCESS" aria-label={`${project.title} — open run`}>
                {shot}
              </a>
            ) : (
              shot
            )}

            <div className="flex flex-col gap-3 p-3 md:p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[0.6rem] tracking-[0.24em] text-[var(--faint)]">{runNo}</span>
                <span className={status.cls}>{status.label}</span>
              </div>

              <h3 className="font-display text-2xl text-[var(--ink)] transition-colors duration-300 group-hover:text-[var(--cyan)] md:text-3xl">
                {project.title}
              </h3>

              <p className="font-mono text-[0.66rem] leading-relaxed tracking-[0.04em] text-[var(--muted)]">
                {project.description}
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <span className="mr-1 font-mono text-[0.56rem] uppercase tracking-[0.2em] text-[var(--faint)]">
                  Tools:
                </span>
                {project.tech.map((t) => (
                  <span key={t} className="chip chip--xs">
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-3 flex items-center gap-6 border-t border-[var(--line)] pt-4">
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-neon font-mono text-[0.62rem] uppercase tracking-[0.22em] text-[var(--cyan)]"
                  >
                    Access run ↗
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-neon font-mono text-[0.62rem] uppercase tracking-[0.22em] text-[var(--muted)]"
                  >
                    Source_code
                  </a>
                )}
                {!project.live && !project.github && (
                  <span className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-[var(--faint)]">
                    Internal build — access restricted
                  </span>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  </Sector>
);

export default Works;

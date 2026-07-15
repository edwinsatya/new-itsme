"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight, Github } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useRevealScope } from "@/hooks/useRevealScope";
import { projects } from "@/constants/projects";
import ChapterHeader from "./fx/ChapterHeader";
import SfxPop from "./fx/SfxPop";

const marqueeItems = [
  "Battle record",
  `${projects.length} missions cleared`,
  "Zero continues used",
];

const openInNewTab = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

const Battles = () => {
  const scope = useRevealScope<HTMLElement>();

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;

      // subtle parallax drift on each battle thumbnail (transform only)
      gsap.utils.toArray<HTMLElement>(".battle-thumb-par").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    }, scope);

    return () => ctx.revert();
  }, [scope]);

  return (
    <section id="battles" ref={scope} className="theme-ink section-shell overflow-hidden">
      {/* backdrop texture */}
      <div
        className="halftone-fade pointer-events-none absolute right-[-8%] top-[3%] h-[30rem] w-[36rem] text-[var(--paper)] opacity-10"
        aria-hidden
      />
      <p
        className="font-jp pointer-events-none absolute left-[-2%] top-[40%] select-none text-[clamp(6rem,18vw,15rem)] leading-none opacity-[0.05]"
        aria-hidden
      >
        戦闘
      </p>

      <div className="relative z-10 mx-auto max-w-6xl">
        <ChapterHeader
          chapter={2}
          sub={`Works — ${projects.length} missions on record`}
          lines={["Battles", "Won"]}
        />

        <div data-reveal className="mt-8 flex max-w-md flex-col gap-2 md:ml-auto md:text-right">
          <p className="text-sm leading-relaxed opacity-80">
            Every project is a boss fight — AI tools, web3 arenas, dashboards, full
            platforms. All of them cleared and live. Hover a card to inspect the battle.
          </p>
        </div>
      </div>

      {/* Battle record marquee */}
      <div
        data-reveal
        className="marquee relative z-10 -mx-8 mt-14 -rotate-1 border-y-[3px] border-[var(--paper)] bg-[var(--red)] py-2.5"
      >
        {[0, 1].map((track) => (
          <div key={track} className="marquee-track" aria-hidden={track === 1}>
            {Array.from({ length: 3 }).flatMap((_, rep) =>
              marqueeItems.map((item, i) => (
                <span
                  key={`${rep}-${i}`}
                  className="font-display flex items-center gap-10 whitespace-nowrap text-lg text-[var(--paper)]"
                >
                  {item}
                  <span className="font-jp text-sm">★</span>
                </span>
              ))
            )}
          </div>
        ))}
      </div>

      {/* Battle cards */}
      <div className="relative z-10 mx-auto mt-16 max-w-6xl">
        <SfxPop text="FIGHT!!" className="-top-6 right-0 text-2xl md:text-3xl" rotate={6} />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
          {projects.map((project, i) => {
            const href = project.live || project.github;
            const tilt = ((i % 3) - 1) * 1.1;
            const CardTag = href ? "a" : "div";
            const cursorLabel = project.live
              ? "ENTER BATTLE"
              : project.github
                ? "VIEW CODE"
                : undefined;

            return (
              <div
                key={project.id}
                data-reveal-pop
                data-rotate={tilt}
                className={`opacity-0 ${i % 3 === 1 ? "lg:mt-10" : ""}`}
              >
                <CardTag
                  {...(href
                    ? { href, target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  {...(cursorLabel ? { "data-cursor-label": cursorLabel } : {})}
                  className={`battle-card h-full ${href ? "" : "cursor-default"}`}
                >
                  {/* Thumb */}
                  <div className="relative aspect-[16/10] overflow-hidden border-b-[3px] border-[var(--ink)]">
                    <div className="battle-thumb-par absolute inset-[-8%]">
                      <div className="battle-thumb relative h-full w-full">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <span className="brush-chip font-display absolute left-3 top-3 z-[4] bg-[var(--red)] px-2.5 py-1 text-[0.6rem] tracking-[0.18em] text-[var(--paper)]">
                      Mission {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="stamp absolute right-3 top-3 z-[4] bg-[var(--paper)] !text-[0.62rem]">
                      Cleared
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col gap-4 p-5">
                    <h3 className="font-display text-xl leading-none">{project.title}</h3>
                    <p className="min-h-[3.4rem] text-[0.82rem] leading-relaxed opacity-75">
                      {project.description}
                    </p>

                    <div>
                      <p className="hud-label mb-2 !text-[0.52rem] text-[var(--red)]">
                        Techniques used
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.tech.map((tech) => (
                          <span key={tech} className="chip !border-[1.5px] !px-2 !py-1 !text-[0.52rem]">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t-2 border-[rgba(18,18,18,0.15)] pt-3">
                      {project.live ? (
                        <span className="font-display flex items-center gap-1.5 text-[0.72rem] tracking-[0.12em] text-[var(--red)]">
                          Enter the arena <ArrowUpRight size={14} />
                        </span>
                      ) : project.github ? (
                        <span className="font-display flex items-center gap-1.5 text-[0.72rem] tracking-[0.12em] text-[var(--red)]">
                          Read the code <ArrowUpRight size={14} />
                        </span>
                      ) : (
                        <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] opacity-50">
                          Classified — internal
                        </span>
                      )}

                      {/* secondary GitHub link when the card itself opens the live site */}
                      {project.github && project.live && (
                        <span
                          role="link"
                          tabIndex={0}
                          title="View code on GitHub"
                          data-cursor-label="VIEW CODE"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openInNewTab(project.github);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              e.stopPropagation();
                              openInNewTab(project.github);
                            }
                          }}
                          className="opacity-50 transition-opacity duration-200 hover:opacity-100"
                        >
                          <Github size={16} />
                        </span>
                      )}
                    </div>
                  </div>
                </CardTag>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Battles;

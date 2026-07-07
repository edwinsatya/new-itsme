"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight, Github } from "lucide-react";
import { gsap, EASE_OUT } from "@/lib/gsap";
import { useRevealScope } from "@/hooks/useRevealScope";
import { projects } from "@/constants/projects";
import {
  useSectionParallax,
  Cloud,
  Ridge,
  DotMesh,
  Rain,
  Lightning,
  SectionGrid,
} from "./scenes";

const withImages = projects.filter((p) => p.image);

const Portfolio = () => {
  const scope = useRevealScope<HTMLElement>();

  useSectionParallax(scope);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Deck fans out from a stacked pile as it scrolls into view
      const cards = gsap.utils.toArray<HTMLElement>(".fan-card");
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { x: 0, y: 60, rotate: 0, scale: 0.75, opacity: 0 },
          {
            x: parseFloat(card.dataset.fx!),
            y: parseFloat(card.dataset.fy!),
            rotate: parseFloat(card.dataset.fr!),
            scale: parseFloat(card.dataset.fs!),
            opacity: 1,
            duration: 1.1,
            ease: EASE_OUT,
            scrollTrigger: { trigger: ".fan-stage", start: "top 70%" },
          }
        );
      });

      gsap.fromTo(
        ".work-row",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: EASE_OUT,
          stagger: 0.06,
          scrollTrigger: { trigger: ".works-list", start: "top 88%" },
        }
      );
    }, scope);

    return () => ctx.revert();
  }, [scope]);

  const center = (withImages.length - 1) / 2;

  return (
    <section id="works" ref={scope} data-theme="lilac" className="section-shell overflow-hidden">
      {/* Rainstorm scenery */}
      <SectionGrid />
      <Cloud className="left-[4%] top-[3%] h-20 w-72 text-[#6d60bd] opacity-80" speed={-0.35} />
      <Cloud className="right-[8%] top-[8%] h-16 w-60 text-[#7f72cc] opacity-70" speed={-0.2} />
      <Cloud className="left-[38%] top-[16%] h-12 w-44 text-[#6d60bd] opacity-60" speed={-0.45} />
      <Lightning className="left-[12%] top-[10%] h-28 w-14 text-[#f4c04e]" speed={-0.3} delay={0} />
      <Lightning className="right-[18%] top-[20%] h-20 w-10 text-[#f4c04e]" speed={-0.45} delay={3.4} />
      <Rain className="text-[#efeee8]" />
      <DotMesh className="right-[4%] top-[46%] hidden h-40 w-80 text-[#0e4347] opacity-30 md:block" speed={-0.3} />
      <Ridge jagged className="h-48 text-[#7f72cc] opacity-60 md:h-72" speed={0.16} />
      <Ridge jagged className="h-32 text-[#6d60bd] opacity-50 md:h-48" speed={0.35} />

      <div data-enter className="relative z-10 mx-auto max-w-6xl">
        <div data-reveal className="mb-10 flex flex-wrap items-center justify-between gap-3">
          <p className="hud-label">002 — Works</p>
          <p className="hud-label">WX // Rainstorm — 19°C</p>
        </div>

        <h2 data-scroll-speed="-0.2" className="font-display text-[clamp(2.2rem,6vw,4.8rem)] text-[var(--ink)]">
          <span className="line-mask md:ml-[10vw]">
            <span>{withImages.length} real-world</span>
          </span>
          <span className="line-mask">
            <span>projects. shipped.</span>
          </span>
        </h2>

        <div data-reveal className="mt-6 flex max-w-md flex-col gap-2 md:ml-auto">
          <span className="hud-label">Selected collection</span>
          <p className="text-sm leading-relaxed text-[var(--ink)] opacity-80">
            Every project is built with care — from AI-powered tools to web3 platforms. Hover a
            card to inspect, click to visit the live world.
          </p>
        </div>
      </div>

      {/* ------- Card fan (desktop) ------- */}
      <div className="fan-stage relative z-10 mx-auto mt-16 hidden h-[420px] max-w-6xl items-center justify-center md:flex">
        {/* guide line + arrows like KPR */}
        <div className="absolute left-1/2 top-1/2 h-[120%] w-px -translate-x-1/2 -translate-y-1/2 bg-[var(--line)]" />

        {withImages.map((project, i) => {
          const offset = i - center;
          const abs = Math.abs(offset);
          const fx = offset * 128;
          const fy = abs * abs * 7;
          const fr = offset * 2.2;
          const fs = 1 - abs * 0.05;
          const href = project.live || project.github;

          const Card = href ? "a" : "div";

          return (
            <Card
              key={project.id}
              {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
              className="fan-card absolute block w-48 opacity-0 lg:w-52"
              data-fx={fx}
              data-fy={fy}
              data-fr={fr}
              data-fs={fs}
              style={{ zIndex: 50 - Math.round(abs * 2) }}
            >
              <div className="folder-card aspect-[3/4] shadow-2xl transition-transform duration-300 hover:-translate-y-5">
                <span className="folder-label hud-label !text-[0.5rem] !text-[#0e4347]">
                  {project.title}
                </span>
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="208px"
                  className="object-cover"
                />
              </div>
            </Card>
          );
        })}
      </div>

      {/* ------- Mobile: swipeable deck ------- */}
      <div className="relative z-10 -mx-6 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:hidden">
        {withImages.map((project) => {
          const href = project.live || project.github;
          const Card = href ? "a" : "div";
          return (
            <Card
              key={project.id}
              {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
              className="block w-40 flex-shrink-0 snap-center"
            >
              <div className="folder-card aspect-[3/4] shadow-xl">
                <span className="folder-label hud-label !text-[0.5rem] !text-[#0e4347]">
                  {project.title}
                </span>
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </div>
            </Card>
          );
        })}
      </div>

      {/* ------- Index list ------- */}
      <div className="relative z-10 mx-auto mt-24 max-w-6xl">
        <p data-reveal className="hud-label mb-6">
          Project index
        </p>
        <div className="works-list border-t border-[var(--line)]">
          {projects.map((project, i) => {
            const href = project.live || project.github;
            const Row = href ? "a" : "div";
            return (
              <Row
                key={project.id}
                {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`work-row group flex items-center justify-between gap-4 border-b border-[var(--line)] py-4 ${
                  href ? "" : "cursor-default opacity-50"
                }`}
              >
                <div className="flex items-baseline gap-4 md:gap-8">
                  <span className="font-mono text-[0.62rem] text-[var(--ink)] opacity-60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-lg uppercase text-[var(--ink)] transition-transform duration-300 group-hover:translate-x-2 md:text-2xl">
                    {project.title}
                  </h3>
                </div>
                <div className="flex items-center gap-4">
                  <span className="hidden font-mono text-[0.6rem] uppercase tracking-[0.15em] text-[var(--ink)] opacity-60 md:inline">
                    {project.tech.slice(0, 3).join(" / ")}
                  </span>
                  {/* Separate GitHub link — only when the row itself opens the live site */}
                  {project.github && project.live && (
                    <span
                      role="link"
                      tabIndex={0}
                      title="View code on GitHub"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(project.github, "_blank", "noopener,noreferrer");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open(project.github, "_blank", "noopener,noreferrer");
                        }
                      }}
                      className="text-[var(--ink)] opacity-50 transition-opacity duration-300 hover:opacity-100"
                    >
                      <Github size={17} />
                    </span>
                  )}
                  {href && (
                    <ArrowUpRight
                      size={18}
                      className="text-[var(--ink)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                  )}
                </div>
              </Row>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;

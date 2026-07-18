"use client";

import { useRef } from "react";
import clsx from "clsx";
import { gsap, ScrollTrigger, useIsomorphicLayoutEffect } from "@/lib/gsap";
import MediaSlot from "@/components/media/MediaSlot";
import type { FeaturedProject } from "@/data/content";

type ResolvedProject = FeaturedProject & { resolvedImage: string | null };

/**
 * Four nearly full-height panels; each new one scrolls over the pinned
 * previous panel, which scales back, lifts and dims — classic stacked cards.
 */
export default function FeaturedProjects({ projects }: { projects: ResolvedProject[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", wrapRef.current!);
        const last = panels[panels.length - 1];

        panels.forEach((panel, i) => {
          const media = panel.querySelector<HTMLElement>("[data-panel-media]");
          if (media) {
            // gentle settle as the panel rides in
            gsap.fromTo(
              media,
              { yPercent: 10 },
              {
                yPercent: 0,
                ease: "none",
                scrollTrigger: {
                  trigger: panel,
                  start: "top bottom",
                  end: "top top",
                  scrub: 1,
                  invalidateOnRefresh: true,
                },
              }
            );
          }

          if (i === panels.length - 1) return;

          ScrollTrigger.create({
            trigger: panel,
            start: "top top",
            end: () => `+=${last.offsetTop - panel.offsetTop}`,
            pin: true,
            pinSpacing: false,
            invalidateOnRefresh: true,
          });

          gsap.to(panel.querySelector("[data-panel-inner]"), {
            scale: 0.92,
            y: -28,
            filter: "brightness(0.45)",
            ease: "none",
            scrollTrigger: {
              trigger: panels[i + 1],
              start: "top bottom",
              end: "top top",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
        });
      },
      wrapRef
    );
    return () => mm.revert();
  }, []);

  return (
    <section id="work" aria-label="Featured projects" className="relative bg-black">
      <h2 className="sr-only">Featured projects</h2>
      <div ref={wrapRef}>
        {projects.map((project) => (
          <article
            key={project.title}
            data-panel
            className="relative h-[100svh] max-md:h-[78svh]"
          >
            <div
              data-panel-inner
              className="group absolute inset-0 origin-top overflow-hidden rounded-t-[28px] bg-ink text-white will-change-transform"
            >
              {/* media with headroom for the parallax settle */}
              <div data-panel-media className="absolute -inset-y-[6%] inset-x-0">
                <MediaSlot
                  src={project.resolvedImage}
                  alt={`${project.title} — project visual`}
                  variant={project.tint === "ultra" ? "ultra" : "space"}
                  className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  sizes="100vw"
                />
              </div>

              {/* legibility wash */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-[2]"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(5,5,6,0.42) 0%, rgba(5,5,6,0.05) 34%, rgba(5,5,6,0.16) 60%, rgba(5,5,6,0.78) 100%)",
                }}
              />

              <div className="relative z-10 flex h-full flex-col justify-between p-8 max-md:p-5">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-serif italic text-[1.6rem] leading-none text-acid">
                    {project.index}
                  </span>
                  <span className="type-label text-white/70">{project.meta}</span>
                </div>

                <div className="flex items-end justify-between gap-6 max-md:flex-col max-md:items-start">
                  <div className="max-w-[600px]">
                    <h3 className="text-[clamp(2.3rem,5.4vw,4.9rem)] font-medium leading-[0.95] tracking-[-0.04em]">
                      {project.title}
                    </h3>
                    <p className="mt-4 max-w-[480px] text-[0.95rem] leading-relaxed text-white/75">
                      {project.description}
                    </p>
                    {project.repo && (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noreferrer"
                        className="type-label mt-5 inline-block underline underline-offset-4 transition-colors hover:text-acid"
                      >
                        GitHub <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>

                  {project.href ? (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noreferrer"
                      data-magnetic
                      aria-label={`${project.cta.replace("↗", "").trim()} — ${project.title}`}
                      className="paper-sec grid size-[clamp(110px,10vw,150px)] shrink-0 place-items-center rounded-full text-center transition-transform duration-500 hover:scale-105 max-md:self-end"
                    >
                      <span className="type-label max-w-[80%] leading-relaxed">
                        {project.cta}
                      </span>
                    </a>
                  ) : (
                    <span
                      className={clsx(
                        "paper-sec grid size-[clamp(110px,10vw,150px)] shrink-0 place-items-center rounded-full text-center opacity-85 max-md:self-end"
                      )}
                    >
                      <span className="type-label max-w-[80%] leading-relaxed">
                        {project.cta}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

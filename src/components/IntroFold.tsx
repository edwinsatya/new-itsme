"use client";

import { useRef } from "react";
import { gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";
import MediaSlot from "@/components/media/MediaSlot";
import { intro } from "@/data/content";

/**
 * Sticky editorial two-column fold: the statement brightens segment by
 * segment while the portrait drifts and enlarges toward the lower-right.
 */
export default function IntroFold({ portrait }: { portrait: string | null }) {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap.set("[data-seg]", { opacity: 0.12 });
        gsap.set("[data-portrait]", { xPercent: -26, yPercent: -34, scale: 0.72 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          "[data-statement]",
          { y: "6vh" },
          { y: "-4vh", duration: 1 },
          0
        )
          .to(
            "[data-seg]",
            { opacity: 1, duration: 0.16, stagger: 0.15 },
            0.06
          )
          .to(
            "[data-portrait]",
            { xPercent: 8, yPercent: 14, scale: 1.16, duration: 0.94 },
            0.04
          );
      },
      sectionRef
    );
    return () => mm.revert();
  }, []);

  const { statement } = intro;

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About"
      data-theme="paper"
      className="sec-intro tall paper-sec relative h-[290vh] max-md:h-[230vh]"
    >
      <div className="stage sticky top-0 h-[100svh] overflow-hidden">
        <div className="gutter relative flex h-full flex-col pt-28 max-md:pt-24">
          <div className="flex items-baseline justify-between">
            <span className="type-label flex items-center gap-2.5">
              <span aria-hidden="true" className="inline-block size-1.5 rounded-full bg-ultra" />
              {intro.label}
            </span>
            <span className="type-label text-muted">{intro.index}</span>
          </div>

          <div className="grid flex-1 grid-cols-12 items-center gap-4">
            <p
              data-statement
              className="type-display col-span-12 max-w-[1080px] md:col-span-11 md:col-start-2"
            >
              <span data-seg>{statement.before}</span>
              <em data-seg className="font-serif font-normal italic">
                {statement.accent}
              </em>
              <span data-seg>{statement.after}</span>
            </p>
          </div>

          {/* drifting portrait */}
          <div
            data-portrait
            className="absolute right-[8vw] top-[52%] z-[2] w-[clamp(150px,22vw,330px)] max-md:right-[6vw] max-md:top-[58%] max-md:w-[38vw] will-change-transform"
          >
            <MediaSlot
              src={portrait}
              alt={`Portrait of Edwin Satya Yudistira`}
              variant="monogram"
              className="aspect-[3/4] w-full"
              sizes="(max-width: 760px) 38vw, 22vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

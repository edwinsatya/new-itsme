"use client";

import { useRef } from "react";
import { gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";
import MediaSlot from "@/components/media/MediaSlot";
import { portal } from "@/data/content";

/**
 * Expanding media portal: corner words part ways while a small frame grows
 * to full viewport, revealing the name typography over the media.
 */
export default function Portal({ image }: { image: string | null }) {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      {
        ok: "(prefers-reduced-motion: no-preference)",
        mobile: "(max-width: 760px)",
      },
      (ctx) => {
        if (!ctx.conditions?.ok) return;
        const mobile = !!ctx.conditions?.mobile;

        const frameW = mobile ? ["36vw", "64vw", "100vw"] : ["12vw", "34vw", "100vw"];
        const frameH = mobile ? ["27vw", "48vw", "100svh"] : ["9vw", "25vw", "100svh"];

        gsap.set("[data-frame]", { width: frameW[0], height: frameH[0] });
        gsap.set("[data-frame-media]", { scale: 1.35 });
        gsap.set("[data-ov]", { yPercent: 112 });

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

        tl.to("[data-word-left]", { xPercent: -170, x: "-6vw", duration: 0.4 }, 0)
          .to("[data-word-right]", { xPercent: 170, x: "6vw", duration: 0.4 }, 0)
          .to("[data-dot-a]", { x: mobile ? "-34vw" : "-26vw", autoAlpha: 0, duration: 0.4 }, 0)
          .to("[data-dot-b]", { x: mobile ? "34vw" : "26vw", autoAlpha: 0, duration: 0.4 }, 0)
          .to("[data-frame]", { width: frameW[1], height: frameH[1], duration: 0.42 }, 0)
          .to(
            "[data-frame]",
            { width: frameW[2], height: frameH[2], duration: 0.36, ease: "power1.inOut" },
            0.52
          )
          .to("[data-frame-media]", { scale: 1, duration: 0.95 }, 0)
          .to("[data-labels]", { color: "#ffffff", duration: 0.14 }, 0.62)
          .to(
            "[data-ov]",
            { yPercent: 0, duration: 0.16, stagger: 0.05, ease: "power2.out" },
            0.7
          );
      },
      sectionRef
    );
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Selected work portal"
      data-theme="paper"
      className="sec-portal tall paper-sec relative h-[430vh] max-md:h-[300vh]"
    >
      <div className="stage sticky top-0 h-[100svh] overflow-hidden">
        {/* corner words */}
        <div
          data-word-left
          className="absolute left-[1.25rem] top-[10vh] text-[clamp(3.5rem,8vw,9rem)] font-semibold leading-none tracking-[-0.05em]"
        >
          {portal.wordLeft}
        </div>
        <div
          data-word-right
          className="absolute right-[1.25rem] top-[10vh] font-serif italic text-[clamp(3.5rem,8vw,9rem)] leading-none"
        >
          {portal.wordRight}
        </div>

        {/* drifting dots */}
        <span
          data-dot-a
          aria-hidden="true"
          className="absolute left-[16vw] top-[54%] size-2.5 rounded-full bg-ink"
        />
        <span
          data-dot-b
          aria-hidden="true"
          className="absolute right-[20vw] top-[36%] size-2.5 rounded-full bg-ink"
        />

        {/* expanding frame */}
        <div
          data-frame
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden"
          style={{ width: "12vw", height: "9vw" }}
        >
          <div data-frame-media className="absolute inset-0 will-change-transform">
            <MediaSlot
              src={image}
              alt="Portal frame — selected work"
              variant="portal"
              className="h-full w-full"
              sizes="100vw"
            />
            {/* ultramarine multiply tint */}
            <div
              aria-hidden="true"
              className="absolute inset-0 z-[2] bg-ultra/35 mix-blend-multiply"
            />
          </div>

          {/* revealed typography */}
          <div className="absolute inset-0 z-[4] grid place-items-center">
            <div className="type-title text-center leading-[0.9] text-white">
              <span className="block overflow-hidden pb-[0.06em]">
                <span data-ov className="block will-change-transform">
                  Edwin<span className="font-serif italic text-acid">/</span>
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.06em]">
                <span data-ov className="block will-change-transform">
                  Satya
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* bottom labels */}
        <div
          data-labels
          className="type-label absolute inset-x-0 bottom-6 z-[5] flex justify-between gap-4 px-5 text-ink"
        >
          <span>{portal.labels[0]}</span>
          <span className="hidden md:inline">{portal.labels[1]}</span>
          <span className="text-right">{portal.labels[2]}</span>
        </div>
      </div>
    </section>
  );
}

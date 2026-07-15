"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, PRELOADER_DONE_EVENT, prefersReducedMotion } from "@/lib/gsap";

const bootLines = [
  "INKING PANELS_",
  "DRAWING SPEED LINES_",
  "CHARGING POWER GAUGE_",
  "SUMMONING PROTAGONIST_",
  "EPISODE READY_",
];

/**
 * "Loading next episode" screen: a power gauge charges to 100%, then a red
 * panel wipe slams the loader away and hands off to the hero title card.
 */
const Preloader = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";

    const reduced = prefersReducedMotion();
    const counter = { value: 0 };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflow = "";
          window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
          setDone(true);
        },
      });

      tl.to(counter, {
        value: 100,
        duration: reduced ? 0.5 : 2.3,
        ease: "power2.inOut",
        onUpdate: () => setProgress(Math.round(counter.value)),
      });

      if (!reduced) {
        // impact flash the instant the gauge maxes out
        tl.fromTo(
          ".pre-flash",
          { opacity: 0 },
          { opacity: 1, duration: 0.07, ease: "none" }
        );
        tl.to(".pre-flash", { opacity: 0, duration: 0.18, ease: "power1.out" });
        tl.to(
          ".pre-content",
          { yPercent: -16, opacity: 0, duration: 0.3, ease: "power2.in" },
          "-=0.1"
        );
        // hard-edged panel wipe: red slab sweeps up, then the loader leaves with it
        tl.fromTo(
          ".pre-wipe",
          { yPercent: 112 },
          { yPercent: 0, duration: 0.42, ease: "power4.in" },
          "-=0.25"
        );
        tl.to(rootRef.current, { yPercent: -100, duration: 0.55, ease: "power4.inOut" });
      } else {
        tl.to(rootRef.current, { opacity: 0, duration: 0.25, ease: "none" });
      }
    }, rootRef);

    return () => {
      document.documentElement.style.overflow = "";
      ctx.revert();
    };
  }, []);

  if (done) return null;

  const stageIndex = Math.min(
    Math.floor((progress / 100) * bootLines.length),
    bootLines.length - 1
  );

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200] flex flex-col justify-between overflow-hidden bg-[var(--ink)] px-6 py-8 text-[var(--paper)] md:px-12"
    >
      {/* faint screen-tone texture */}
      <div className="halftone-fade pointer-events-none absolute inset-0 text-[var(--paper)] opacity-[0.07]" aria-hidden />

      {/* Top bar */}
      <div className="pre-content relative flex items-center justify-between gap-4 font-mono text-[0.65rem] font-medium uppercase tracking-[0.25em] opacity-70">
        <span className="hidden sm:inline">■ Edwin Satya Yudistira</span>
        <span className="sm:hidden">■ E.S.Y</span>
        <span className="text-[var(--red)]">Next Episode — EP.001</span>
      </div>

      {/* Center: boot readout + counter */}
      <div className="pre-content relative flex flex-col items-center gap-6">
        <p className="font-jp text-sm tracking-[0.5em] opacity-60">ローディング中</p>
        <p className="font-mono text-xs uppercase tracking-[0.3em] opacity-80">
          {bootLines[stageIndex]}
        </p>
        <span className="font-display text-[clamp(5rem,18vw,11rem)] leading-none">
          {progress}
          <span className="text-[var(--red)]">%</span>
        </span>
      </div>

      {/* Bottom: power gauge */}
      <div className="pre-content relative flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <p className="hud-label opacity-80">Power gauge</p>
          <p className="hud-label opacity-50">Loading next episode</p>
        </div>
        <div className="h-6 w-full border-[3px] border-[var(--paper)] p-[3px]">
          <div
            className="h-full w-full origin-left bg-[var(--red)]"
            style={{
              transform: `scaleX(${progress / 100})`,
              backgroundImage:
                "repeating-linear-gradient(-45deg, transparent 0 8px, rgba(242,239,230,0.35) 8px 16px)",
            }}
          />
        </div>
      </div>

      {/* Exit FX layers */}
      <div className="pre-flash pointer-events-none absolute inset-0 z-10 bg-[var(--paper)] opacity-0" aria-hidden />
      <div
        className="pre-wipe pointer-events-none absolute inset-0 z-20 bg-[var(--red)]"
        style={{ transform: "translateY(112%)" }}
        aria-hidden
      />
    </div>
  );
};

export default Preloader;

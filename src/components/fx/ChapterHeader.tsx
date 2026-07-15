"use client";

import { useEffect, useRef } from "react";
import { gsap, impactShake, prefersReducedMotion } from "@/lib/gsap";
import { SpeedLines } from "./SpeedLines";

type ChapterHeaderProps = {
  /** chapter number → 第00X話 */
  chapter: number;
  /** small mono label next to the kanji chip, e.g. "PROFILE — ORIGIN STORY" */
  sub: string;
  /** big display title, one array entry per line */
  lines: string[];
  className?: string;
};

const kanjiChapter = (n: number) => `第${String(n).padStart(3, "0")}話`;

/**
 * Section opener: the 第00X話 chip wipes in brush-style, then the title slams
 * in oversized with a radial speed-line flash and a screen-shake-lite jolt.
 */
const ChapterHeader = ({ chapter, sub, lines, className = "" }: ChapterHeaderProps) => {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set([".ch-kanji", ".ch-sub", ".ch-title", ".ch-rule"], {
          opacity: 1,
          scale: 1,
          xPercent: 0,
          scaleX: 1,
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: { trigger: rootRef.current, start: "top 80%" },
      });

      tl.fromTo(
        ".ch-kanji",
        { xPercent: -103 },
        { xPercent: 0, opacity: 1, duration: 0.45, ease: "power4.inOut" }
      );
      tl.fromTo(
        ".ch-sub",
        { x: -18, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
        "-=0.15"
      );
      // Title slam: oversized → snap to place…
      tl.fromTo(
        ".ch-title",
        { scale: 1.75, rotation: 3, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.4, ease: "power4.out" },
        "-=0.1"
      );
      // …speed-line flash at the moment of impact…
      tl.fromTo(
        ".ch-burst",
        { opacity: 0, scale: 0.65 },
        { opacity: 0.85, scale: 1, duration: 0.16, ease: "power2.out" },
        "<+=0.22"
      );
      tl.to(".ch-burst", { opacity: 0, scale: 1.18, duration: 0.45, ease: "power2.in" });
      // …and the jolt.
      tl.add(impactShake(rootRef.current, 6), "<-=0.45");
      tl.fromTo(
        ".ch-rule",
        { scaleX: 0 },
        { scaleX: 1, opacity: 1, duration: 0.5, ease: "power4.out", transformOrigin: "left" },
        "-=0.4"
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <header ref={rootRef} className={`relative ${className}`}>
      <SpeedLines
        className="ch-burst pointer-events-none absolute left-1/2 top-1/2 h-[180%] w-[130%] -translate-x-1/2 -translate-y-1/2 text-current opacity-0"
        count={44}
        inner={330}
      />

      <div className="relative flex flex-wrap items-center gap-4">
        <span className="inline-block overflow-hidden align-middle">
          <span className="ch-kanji brush-chip font-jp inline-block bg-[var(--red)] px-4 py-1.5 text-lg text-[var(--paper)] opacity-0 md:text-xl">
            {kanjiChapter(chapter)}
          </span>
        </span>
        <p className="ch-sub hud-label opacity-0">{sub}</p>
      </div>

      <h2 className="ch-title font-display relative mt-6 text-[clamp(2.6rem,7.5vw,5.6rem)] opacity-0">
        {lines.map((line, i) => (
          <span key={line} className={`block ${i % 2 === 1 ? "md:ml-[8vw]" : ""}`}>
            {line}
          </span>
        ))}
      </h2>

      <div className="ch-rule mt-5 h-[5px] w-24 bg-[var(--red)] opacity-0" />
    </header>
  );
};

export default ChapterHeader;

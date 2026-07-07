"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { gsap, EASE_IN_OUT, PRELOADER_DONE_EVENT } from "@/lib/gsap";

/* Tiny weather glyphs, stroke = currentColor */
const icon = {
  night: (
    <path d="M14 3 A8.5 8.5 0 1 0 21 15 A7 7 0 0 1 14 3 Z" />
  ),
  sunny: (
    <>
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
    </>
  ),
  rain: (
    <>
      <path d="M7 13a5 5 0 1 1 1.2-9.9A6 6 0 0 1 19 8a3.5 3.5 0 0 1-1 6.9H7Z" />
      <path d="M8 17.5l-1 3M13 17.5l-1 3M18 17.5l-1 3" />
    </>
  ),
  wind: (
    <path d="M3 8h11a3 3 0 1 0-3-3M3 13h15a3 3 0 1 1-3 3M3 18h8a2.5 2.5 0 1 1-2.5 2.5" />
  ),
  snow: (
    <path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9M12 6l-2-2M12 6l2-2M12 18l-2 2M12 18l2 2" />
  ),
  rainbow: (
    <>
      <path d="M3 20a9 9 0 0 1 18 0" />
      <path d="M7 20a5 5 0 0 1 10 0" opacity="0.6" />
    </>
  ),
};

const stages: { key: keyof typeof icon; boot: string }[] = [
  { key: "night", boot: "scanning night sky_" },
  { key: "sunny", boot: "calibrating sunlight_" },
  { key: "rain", boot: "tracking rainfall_" },
  { key: "wind", boot: "measuring wind speed_" },
  { key: "snow", boot: "detecting snowfall_" },
  { key: "rainbow", boot: "forecast complete_" },
];

const Glyph = ({ children, active }: { children: ReactNode; active: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`h-6 w-6 transition-all duration-300 ${
      active ? "text-[#c0fb50] opacity-100" : "text-[#efeee8] opacity-25"
    }`}
  >
    {children}
  </svg>
);

const Preloader = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";

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
        duration: 2.4,
        ease: "power2.inOut",
        onUpdate: () => setProgress(Math.round(counter.value)),
      });

      tl.to(".preloader-content", {
        yPercent: -30,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
      });

      tl.to(rootRef.current, {
        yPercent: -100,
        duration: 0.9,
        ease: EASE_IN_OUT,
      }, "-=0.15");
    }, rootRef);

    return () => {
      document.documentElement.style.overflow = "";
      ctx.revert();
    };
  }, []);

  if (done) return null;

  const stageIndex = Math.min(
    Math.floor((progress / 100) * stages.length),
    stages.length - 1
  );

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200] flex flex-col justify-between bg-[#0e4347] px-6 py-8 md:px-12"
    >
      {/* Top bar */}
      <div className="preloader-content flex items-center justify-between gap-4 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[rgba(239,238,232,0.6)]">
        <span className="hidden sm:inline">■ Edwin Satya Yudistira</span>
        <span className="sm:hidden">■ E.S.Y</span>
        <span className="text-[#c0fb50]">Weather_OS v3.0</span>
      </div>

      {/* Center: radar + boot readout */}
      <div className="preloader-content flex flex-col items-center gap-10 md:flex-row md:justify-center md:gap-20">
        {/* Weather radar */}
        <div className="relative h-40 w-40 md:h-52 md:w-52">
          <svg viewBox="0 0 100 100" fill="none" stroke="rgba(239,238,232,0.25)" className="h-full w-full">
            <circle cx="50" cy="50" r="49" strokeWidth="0.6" />
            <circle cx="50" cy="50" r="34" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="19" strokeWidth="0.4" />
            <line x1="50" y1="1" x2="50" y2="99" strokeWidth="0.4" />
            <line x1="1" y1="50" x2="99" y2="50" strokeWidth="0.4" />
          </svg>
          <div className="radar-sweep" />
          <span className="radar-blip" style={{ left: "30%", top: "38%" }} />
          <span className="radar-blip" style={{ left: "66%", top: "26%", animationDelay: "0.9s" }} />
          <span className="radar-blip" style={{ left: "58%", top: "68%", animationDelay: "1.7s" }} />
          <span className="absolute left-1/2 top-1/2 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c0fb50]" />
        </div>

        {/* Boot readout + stage icons */}
        <div className="flex flex-col items-center gap-6 md:items-start">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[rgba(239,238,232,0.7)]">
            {stages[stageIndex].boot}
          </p>

          <div className="flex items-center gap-5">
            {stages.map((stage, i) => (
              <Glyph key={stage.key} active={i <= stageIndex}>
                {icon[stage.key]}
              </Glyph>
            ))}
          </div>

          <p className="font-mono text-[0.62rem] uppercase tracking-[0.25em] text-[rgba(239,238,232,0.45)]">
            Syncing weather satellites — Lumajang, ID
          </p>
        </div>
      </div>

      {/* Bottom: progress + counter */}
      <div className="preloader-content flex flex-col gap-6">
        <div className="h-px w-full bg-[rgba(239,238,232,0.15)]">
          <div
            className="h-full bg-[#c0fb50] transition-[width] duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-end justify-between">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[rgba(239,238,232,0.6)]">
            ■ Forecast loading
          </p>
          <span className="font-display text-[clamp(4rem,15vw,9rem)] leading-none text-[#efeee8]">
            {progress}
            <span className="text-[#c0fb50]">%</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;

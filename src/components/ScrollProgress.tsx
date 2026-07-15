"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/** 2px cyan→magenta signal bar tracking scroll position. */
const ScrollProgress = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tween = gsap.fromTo(
      barRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        transformOrigin: "left",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "max",
          scrub: 0.3,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-[250] h-[2px] w-full">
      <div
        ref={barRef}
        className="h-full w-full"
        style={{
          background: "linear-gradient(90deg, var(--cyan), var(--magenta))",
          boxShadow: "0 0 12px rgba(0,229,255,0.45)",
        }}
      />
    </div>
  );
};

export default ScrollProgress;

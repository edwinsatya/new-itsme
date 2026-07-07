"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

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
    <div className="pointer-events-none fixed left-0 top-0 z-[70] h-[2px] w-full">
      <div ref={barRef} className="h-full w-full bg-[var(--accent)]" />
    </div>
  );
};

export default ScrollProgress;

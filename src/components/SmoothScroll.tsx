"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const SmoothScroll = () => {
  useEffect(() => {
    // Respect reduced motion: native scrolling, native anchors.
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.1,
      // clear the fixed navbar when jumping to a chapter anchor
      anchors: { offset: -72 },
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
};

export default SmoothScroll;

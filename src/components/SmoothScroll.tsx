"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const SmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      anchors: { offset: 0 },
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

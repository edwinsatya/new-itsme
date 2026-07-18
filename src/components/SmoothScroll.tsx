"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

const SmoothScroll = () => {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.1,
      anchors: { offset: -56 }, // clear the floating dock
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Lenis turns user wheel/touch input into PROGRAMMATIC scrolling, which
    // ignores CSS overflow:hidden — so the boot gate and the mobile menu
    // couldn't actually lock the page. Honor the shared `lenis-stopped`
    // class (toggled by Preloader + HUDFrame) by pausing Lenis itself.
    const html = document.documentElement;
    const sync = () => {
      if (html.classList.contains("lenis-stopped")) lenis.stop();
      else lenis.start();
    };
    const mo = new MutationObserver(sync);
    mo.observe(html, { attributes: true, attributeFilter: ["class"] });
    sync();

    return () => {
      mo.disconnect();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
};

export default SmoothScroll;

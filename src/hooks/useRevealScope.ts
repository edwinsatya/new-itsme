"use client";

import { useEffect, useRef } from "react";
import { gsap, EASE_OUT, EASE_IMPACT, prefersReducedMotion } from "@/lib/gsap";

/**
 * Wires up the standard manga reveal grammar inside the returned scope ref:
 * - `[data-reveal]`      — rises in from below (optional `data-reveal-delay`, seconds)
 * - `[data-reveal-pop]`  — impact pop: snaps in with scale + rotation overshoot
 * - `[data-wipe]`        — hard-edged diagonal clip-path wipe, like a panel being drawn
 * - `.line-mask > span`  — text lines slide up out of their mask
 *
 * Under prefers-reduced-motion everything is simply made visible.
 */
export function useRevealScope<T extends HTMLElement>() {
  const scope = useRef<T>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.set("[data-reveal], [data-reveal-pop], [data-wipe]", { opacity: 1 });
        return;
      }

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 44, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: EASE_OUT,
            delay: parseFloat(el.dataset.revealDelay ?? "0"),
            scrollTrigger: { trigger: el, start: "top 88%" },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-pop]").forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 0.4, rotation: -6, opacity: 0 },
          {
            scale: 1,
            rotation: parseFloat(el.dataset.rotate ?? "0"),
            opacity: 1,
            duration: 0.55,
            ease: EASE_IMPACT,
            delay: parseFloat(el.dataset.revealDelay ?? "0"),
            scrollTrigger: { trigger: el, start: "top 90%" },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-wipe]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 1, clipPath: "polygon(0% 0%, 0% 0%, -18% 100%, -18% 100%)" },
          {
            clipPath: "polygon(0% 0%, 118% 0%, 100% 100%, -18% 100%)",
            duration: 0.6,
            ease: "power4.inOut",
            delay: parseFloat(el.dataset.revealDelay ?? "0"),
            scrollTrigger: { trigger: el, start: "top 88%" },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".line-mask > span").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 1,
            ease: EASE_OUT,
            scrollTrigger: { trigger: el.parentElement, start: "top 88%" },
          }
        );
      });
    }, scope);

    return () => ctx.revert();
  }, []);

  return scope;
}

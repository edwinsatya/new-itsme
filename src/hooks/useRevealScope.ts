"use client";

import { useEffect, useRef } from "react";
import { gsap, EASE_OUT } from "@/lib/gsap";

/**
 * Wires up standard scroll-reveal animations inside the returned scope ref:
 * - `[data-reveal]` elements fade/slide up when scrolled into view
 *   (optional `data-reveal-delay` in seconds)
 * - `.line-mask > span` lines slide up from their mask
 */
export function useRevealScope<T extends HTMLElement>() {
  const scope = useRef<T>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: EASE_OUT,
            delay: parseFloat(el.dataset.revealDelay ?? "0"),
            scrollTrigger: { trigger: el, start: "top 88%" },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".line-mask > span").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1.2,
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

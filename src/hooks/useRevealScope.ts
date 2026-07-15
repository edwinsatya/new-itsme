"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, EASE_OUT, prefersReducedMotion } from "@/lib/gsap";

/**
 * Wires the shared reveal grammar inside the returned scope ref:
 * - `[data-reveal]`        fades/slides up on entry (`data-reveal-delay` in s)
 * - `[data-glitch]`        gets `.glitched` on entry → CSS RGB-split slice reveal
 *                          (`data-glitch-delay` in s); pairs with `.glitch` + `data-text`
 * - `.seam-band`           gets `.banded` on entry → signal-cut flash
 * - `.blink-out`           gets `.blinked` on entry → one-shot glitch blink
 */
export function useRevealScope<T extends HTMLElement>() {
  const scope = useRef<T>(null);

  useEffect(() => {
    // guard class: CSS only pre-hides glitch text when JS is actually running
    document.documentElement.classList.add("js-fx");
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        if (reduced) return;
        gsap.fromTo(
          el,
          { y: 42, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: EASE_OUT,
            delay: parseFloat(el.dataset.revealDelay ?? "0"),
            scrollTrigger: { trigger: el, start: "top 88%" },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-glitch]").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => {
            const delay = parseFloat(el.dataset.glitchDelay ?? "0");
            if (delay > 0 && !reduced) {
              gsap.delayedCall(delay, () => el.classList.add("glitched"));
            } else {
              el.classList.add("glitched");
            }
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".seam-band, .blink-out, [data-ping]").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 94%",
          once: true,
          onEnter: () => {
            if (el.classList.contains("seam-band")) el.classList.add("banded");
            else if (el.classList.contains("blink-out")) el.classList.add("blinked");
            else el.classList.add("pinged");
          },
        });
      });
    }, scope);

    return () => ctx.revert();
  }, []);

  return scope;
}

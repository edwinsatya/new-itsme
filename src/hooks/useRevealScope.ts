"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, EASE_OUT, prefersReducedMotion } from "@/lib/gsap";

/**
 * Wires the shared reveal + depth grammar inside the returned scope ref:
 *
 * Reveals
 * - `[data-reveal]`        fades/slides up on entry (`data-reveal-delay` in s)
 * - `[data-glitch]`        gets `.glitched` on entry → menu-slam wipe
 *                          (`data-glitch-delay` in s); pairs with `.glitch` + `data-text`
 * - `.seam-band`           gets `.banded` on entry → boot band sweep
 * - `.blink-out`           gets `.blinked` on entry → stamp-in pop
 * - `[data-ping]`          gets `.pinged` on entry → divider wipes etc.
 *
 * Depth (all transform-based; flattened under prefers-reduced-motion)
 * - `[data-scroll-speed]`  scroll parallax — layer drifts at its own speed
 *                          while its host `[data-zone]` section is in view
 * - `[data-depth]`         mouse drift — a few px of x-shift toward cursor
 * - `[data-tilt]`          3D tilt-toward-cursor on hover (≤4°); only put
 *                          this on elements without CSS hover transforms
 */
export function useRevealScope<T extends HTMLElement>() {
  const scope = useRef<T>(null);

  useEffect(() => {
    // guard class: CSS only pre-hides slam text when JS is actually running
    document.documentElement.classList.add("js-fx");
    const reduced = prefersReducedMotion();
    const cleanups: (() => void)[] = [];

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

      if (reduced) return;

      /* ---- scroll parallax layers ---- */
      gsap.utils.toArray<HTMLElement>("[data-scroll-speed]").forEach((el) => {
        const host = el.closest<HTMLElement>("[data-zone]") ?? el;
        gsap.to(el, {
          y: parseFloat(el.dataset.scrollSpeed!) * 420,
          ease: "none",
          scrollTrigger: {
            trigger: host,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      /* ---- mouse drift + card tilt (fine pointers only) ---- */
      if (window.matchMedia("(pointer: fine)").matches) {
        const drifters = gsap.utils.toArray<HTMLElement>("[data-depth]").map((el) => ({
          depth: parseFloat(el.dataset.depth!),
          x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power2.out" }),
        }));
        if (drifters.length) {
          const onMove = (e: MouseEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            drifters.forEach((l) => l.x(nx * l.depth * 60));
          };
          window.addEventListener("mousemove", onMove);
          cleanups.push(() => window.removeEventListener("mousemove", onMove));
        }

        gsap.utils.toArray<HTMLElement>("[data-tilt]").forEach((el) => {
          const max = parseFloat(el.dataset.tilt || "4");
          const rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power2.out" });
          const ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power2.out" });
          gsap.set(el, { transformPerspective: 800 });
          const onMove = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            rx(-py * max);
            ry(px * max);
          };
          const onLeave = () => {
            rx(0);
            ry(0);
          };
          el.addEventListener("pointermove", onMove);
          el.addEventListener("pointerleave", onLeave);
          cleanups.push(() => {
            el.removeEventListener("pointermove", onMove);
            el.removeEventListener("pointerleave", onLeave);
          });
        });
      }
    }, scope);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return scope;
}

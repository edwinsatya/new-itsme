"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { LOADER_DONE_EVENT } from "@/components/Loader";

/**
 * Site-wide micro behaviour: IntersectionObserver fade-and-rise reveals for
 * [data-reveal], magnetic hover for [data-magnetic], and ScrollTrigger
 * refreshes once fonts / the loader settle layout.
 */
export default function Interactions() {
  useEffect(() => {
    const reduced = prefersReducedMotion();
    const cleanups: Array<() => void> = [];

    // -- reveals -----------------------------------------------------------
    const revealEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    if (reduced) {
      revealEls.forEach((el) => el.classList.add("is-inview"));
    } else if (revealEls.length) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-inview");
              io.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      revealEls.forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    }

    // -- magnetic hover ----------------------------------------------------
    if (window.matchMedia("(pointer: fine)").matches && !reduced) {
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        const strength = parseFloat(el.dataset.magnetic || "") || 0.32;
        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          gsap.to(el, {
            x: dx * strength,
            y: dy * strength,
            duration: 0.4,
            ease: "power3.out",
          });
        };
        const onLeave = () => {
          gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.45)" });
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
          gsap.killTweensOf(el);
          gsap.set(el, { clearProps: "x,y" });
        });
      });
    }

    // -- keep ScrollTrigger honest once layout settles ---------------------
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener(LOADER_DONE_EVENT, refresh);
    cleanups.push(() => window.removeEventListener(LOADER_DONE_EVENT, refresh));

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}

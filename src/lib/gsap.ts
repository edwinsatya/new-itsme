import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

export const EASE_OUT = "power4.out";
export const EASE_IN_OUT = "power3.inOut";

/** Fired by the Preloader when its exit cut completes. */
export const PRELOADER_DONE_EVENT = "preloader:done";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

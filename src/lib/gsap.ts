import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

export const EASE_OUT = "power4.out";
export const EASE_IN_OUT = "power3.inOut";

/** Fired by the Preloader when its exit animation completes. */
export const PRELOADER_DONE_EVENT = "preloader:done";

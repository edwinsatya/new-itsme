import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

export const EASE_OUT = "power4.out";
export const EASE_IN_OUT = "power3.inOut";
/** Snappy overshoot for impact pops and power meters. */
export const EASE_IMPACT = "back.out(2.2)";

/** Fired by the Preloader when its exit animation completes. */
export const PRELOADER_DONE_EVENT = "preloader:done";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Screen-shake-lite: a few frames of jitter after a title slams in. */
export const impactShake = (target: gsap.TweenTarget, intensity = 7) => {
  const tl = gsap.timeline();
  tl.to(target, { x: -intensity, y: intensity * 0.45, duration: 0.05, ease: "none" })
    .to(target, { x: intensity * 0.8, y: -intensity * 0.35, duration: 0.05, ease: "none" })
    .to(target, { x: -intensity * 0.5, y: intensity * 0.2, duration: 0.05, ease: "none" })
    .to(target, { x: intensity * 0.25, y: 0, duration: 0.04, ease: "none" })
    .to(target, { x: 0, y: 0, duration: 0.08, ease: "power2.out" });
  return tl;
};

/** Power-level readout: counts an element's text up to `to`, fast. */
export const countUp = (
  el: HTMLElement,
  to: number,
  { duration = 1, suffix = "" }: { duration?: number; suffix?: string } = {}
) => {
  const counter = { value: 0 };
  return gsap.to(counter, {
    value: to,
    duration,
    ease: "power2.out",
    onUpdate: () => {
      el.textContent = `${Math.round(counter.value)}${suffix}`;
    },
  });
};

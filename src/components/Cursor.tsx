"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { gsap } from "@/lib/gsap";

const INTERACTIVE =
  "a, button, [data-cursor], input, textarea, select, summary, [role='button']";

const SIZE = 18;
const SIZE_HOVER = 54;

const CAPABLE_QUERY =
  "(pointer: fine) and (prefers-reduced-motion: no-preference)";

function subscribeCapability(callback: () => void) {
  const mq = window.matchMedia(CAPABLE_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

/**
 * Custom circular cursor with mix-blend difference, fine pointers only.
 * The native cursor stays; this ring trails it and swells over interactives.
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const active = useSyncExternalStore(
    subscribeCapability,
    () => window.matchMedia(CAPABLE_QUERY).matches,
    () => false
  );

  useEffect(() => {
    const el = ref.current;
    if (!active || !el) return;

    gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.18, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.18, ease: "power3.out" });
    let shown = false;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!shown) {
        shown = true;
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { autoAlpha: 1, duration: 0.25 });
      }
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const onOver = (e: PointerEvent) => {
      if ((e.target as Element | null)?.closest?.(INTERACTIVE)) {
        gsap.to(el, { width: SIZE_HOVER, height: SIZE_HOVER, duration: 0.28, ease: "power3.out" });
      }
    };
    const onOut = (e: PointerEvent) => {
      if ((e.target as Element | null)?.closest?.(INTERACTIVE)) {
        gsap.to(el, { width: SIZE, height: SIZE, duration: 0.28, ease: "power3.out" });
      }
    };
    const onLeaveWindow = () => {
      shown = false;
      gsap.to(el, { autoAlpha: 0, duration: 0.2 });
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9990] rounded-full border-[1.5px] border-white opacity-0 mix-blend-difference"
      style={{ width: SIZE, height: SIZE }}
    />
  );
}

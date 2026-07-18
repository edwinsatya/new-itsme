"use client";

import { useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// dev-only handles for driving/inspecting animations from the console
if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  (window as unknown as Record<string, unknown>).__gsap = gsap;
  (window as unknown as Record<string, unknown>).__ST = ScrollTrigger;
}

/** useLayoutEffect on the client, useEffect during SSR (avoids the warning). */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const EASE_OUT = "power3.out";

export { gsap, ScrollTrigger };

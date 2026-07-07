"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * KPR-style theme morphing: every section carries a data-theme attribute;
 * as it reaches mid-viewport, the global --bg / --ink / --accent variables
 * tween to that section's palette, recoloring the whole HUD.
 */
const THEMES: Record<string, { bg: string; ink: string; accent: string }> = {
  teal: { bg: "#0e4347", ink: "#efeee8", accent: "#c0fb50" },
  offwhite: { bg: "#efeee8", ink: "#0e4347", accent: "#d9622e" },
  lilac: { bg: "#968adf", ink: "#0e4347", accent: "#efeee8" },
  banana: { bg: "#f4c04e", ink: "#0e4347", accent: "#efeee8" },
  aqua: { bg: "#bee6de", ink: "#0e4347", accent: "#d9622e" },
};

const ThemeManager = () => {
  useEffect(() => {
    const sections = gsap.utils.toArray<HTMLElement>("[data-theme]");
    const triggers: ScrollTrigger[] = [];

    const apply = (name: string) => {
      const theme = THEMES[name];
      if (!theme) return;
      gsap.to("html", {
        "--bg": theme.bg,
        "--ink": theme.ink,
        "--accent": theme.accent,
        duration: 0.7,
        ease: "power2.inOut",
        overwrite: "auto",
      });
    };

    sections.forEach((section) => {
      const name = section.dataset.theme!;
      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          end: "bottom 55%",
          onEnter: () => apply(name),
          onEnterBack: () => apply(name),
        })
      );
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return null;
};

export default ThemeManager;

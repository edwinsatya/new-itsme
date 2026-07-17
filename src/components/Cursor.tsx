"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { zoneBus } from "@/lib/zoneBus";
import type { ZoneId } from "@/config/zones";

/** which cursor glyph each game uses — the optional per-genre polish layer */
const VARIANT: Partial<Record<ZoneId, string>> = {
  services: "reticle", // FPS: crosshair
  works: "dpad", // platformer: d-pad
};

/**
 * Custom cursor tinted by the live game (via --live-accent) that swaps
 * glyphs per genre: ring by default, a crosshair reticle in the FPS
 * loadout, a d-pad in the platformer map. Snaps larger over interactive
 * elements; shows a mono label over anything carrying data-cursor-label.
 */
const Cursor = () => {
  const retRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.body.classList.add("custom-cursor-active");

    const ret = retRef.current!;
    const label = labelRef.current!;

    gsap.set(ret, { xPercent: -50, yPercent: -50, opacity: 0 });
    gsap.set(label, { opacity: 0 });

    const retX = gsap.quickTo(ret, "x", { duration: 0.13, ease: "power3.out" });
    const retY = gsap.quickTo(ret, "y", { duration: 0.13, ease: "power3.out" });
    const lbX = gsap.quickTo(label, "x", { duration: 0.2, ease: "power3.out" });
    const lbY = gsap.quickTo(label, "y", { duration: 0.2, ease: "power3.out" });

    let hot = false;

    const onMove = (e: MouseEvent) => {
      gsap.to(ret, { opacity: 1, duration: 0.25, overwrite: "auto" });
      retX(e.clientX);
      retY(e.clientY);
      lbX(e.clientX + 20);
      lbY(e.clientY + 22);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, input, textarea, [role='link'], [data-cursor]");
      const labelled = target.closest<HTMLElement>("[data-cursor-label]");

      if (!!interactive !== hot) {
        hot = !!interactive;
        gsap.to(ret, {
          scale: hot ? 1.4 : 1,
          rotation: hot ? 45 : 0,
          duration: 0.3,
          ease: "power3.out",
          overwrite: "auto",
        });
      }

      if (labelled) {
        label.textContent = labelled.dataset.cursorLabel || "SELECT";
        gsap.to(label, { opacity: 1, duration: 0.2, overwrite: "auto" });
      } else {
        gsap.to(label, { opacity: 0, duration: 0.2, overwrite: "auto" });
      }
    };

    const onLeave = () => {
      gsap.to([ret, label], { opacity: 0, duration: 0.3, overwrite: "auto" });
    };

    // glyph follows the live game
    const applyZone = (zone: ZoneId) => {
      ret.dataset.variant = VARIANT[zone] ?? "default";
    };
    applyZone(zoneBus.current);
    const offSet = zoneBus.on("set", ({ zone }) => applyZone(zone));
    const offJump = zoneBus.on("jump", ({ to }) => applyZone(to));

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      offSet();
      offJump();
    };
  }, []);

  return (
    <>
      <div ref={retRef} className="cursor-ret" data-variant="default">
        {/* default — console ring + dot */}
        <svg className="cur-default" width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="15" cy="15" r="9" opacity="0.85" />
          <circle cx="15" cy="15" r="1.8" fill="currentColor" stroke="none" />
        </svg>
        {/* FPS — crosshair reticle */}
        <svg className="cur-reticle" width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.1">
          <circle cx="18" cy="18" r="10" opacity="0.5" />
          <line x1="18" y1="2" x2="18" y2="10" />
          <line x1="18" y1="26" x2="18" y2="34" />
          <line x1="2" y1="18" x2="10" y2="18" />
          <line x1="26" y1="18" x2="34" y2="18" />
          <circle cx="18" cy="18" r="1.6" fill="currentColor" stroke="none" />
        </svg>
        {/* platformer — d-pad */}
        <svg className="cur-dpad" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M12 4h8v8h8v8h-8v8h-8v-8H4v-8h8z" opacity="0.9" />
          <circle cx="16" cy="16" r="1.6" fill="currentColor" stroke="none" />
        </svg>
      </div>
      <div ref={labelRef} className="cursor-label">
        SELECT
      </div>
    </>
  );
};

export default Cursor;

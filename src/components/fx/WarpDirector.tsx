"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { ZONES, type ZoneId } from "@/config/zones";
import { zoneBus } from "@/lib/zoneBus";

const SLICE_COUNT = 6;
/** how close (in viewport heights) to a seam before the companion alerts */
const ALERT_BAND = 0.38;
/** ms window that collapses boundary crossings during a fast fling */
const COALESCE_MS = 90;

/**
 * The dimension-jump conductor. Watches scroll against every
 * `[data-zone]` seam and, on a real boundary crossing, fires one sharp
 * 300–500ms warp: flash-frame + glitch slices + chromatic fringe + screen
 * shake, with the zone accent snapping at the flash peak. The same tick
 * drives the companion (via zoneBus), so drone and overlay never drift.
 *
 * prefers-reduced-motion: the jump becomes a same-duration plain dark cut
 * (no brightness spike, no tears, no shake).
 */
const WarpDirector = () => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const fringeARef = useRef<HTMLDivElement>(null);
  const fringeBRef = useRef<HTMLDivElement>(null);
  const slicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const veil = veilRef.current;
    const flash = flashRef.current;
    const fringes = [fringeARef.current, fringeBRef.current];
    const sliceHost = slicesRef.current;
    if (!overlay || !veil || !flash || !sliceHost || fringes.some((f) => !f)) return;
    const slices = Array.from(sliceHost.children) as HTMLElement[];
    const reduced = prefersReducedMotion();

    let zonesInDoc: ZoneId[] = [];
    let bounds: number[] = []; // document-Y of each seam midpoint
    let activeIdx = -1;
    let alertOn = false;
    let tl: gsap.core.Timeline | null = null;
    let warpFrom: number | null = null;
    let pendingTo = 0;
    let pendingTimer = 0;

    const measure = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-zone]"));
      zonesInDoc = els.map((el) => el.dataset.zone as ZoneId);
      // seam midpoint: each section tucks -4rem under the previous one
      bounds = els
        .slice(1)
        .map((el) => el.getBoundingClientRect().top + window.scrollY + 32);
    };

    const setLive = (zone: ZoneId) => {
      const z = ZONES[zone];
      const root = document.documentElement;
      root.style.setProperty("--live-accent", z.primary);
      root.style.setProperty("--live-accent-rgb", z.primaryRgb);
      // NOT data-zone — that selector is how measure() finds the sections
      root.dataset.liveZone = zone;
    };

    const idxAt = (focusY: number) => {
      let i = 0;
      for (const b of bounds) if (focusY >= b) i++;
      return Math.min(i, Math.max(zonesInDoc.length - 1, 0));
    };

    /* ---------------- the jump itself ---------------- */

    const buildWarp = (fromId: ZoneId, toId: ZoneId, dir: 1 | -1) => {
      const to = ZONES[toId];
      tl?.kill();
      tl = gsap.timeline({
        onComplete: () => {
          gsap.set(overlay, { autoAlpha: 0 });
          tl = null;
        },
      });
      tl.set(overlay, { autoAlpha: 1 }, 0);

      if (reduced) {
        // plain cut: brief dark dip, state swaps mid-dip, nothing flashes
        tl.fromTo(veil, { opacity: 0 }, { opacity: 0.92, duration: 0.12, ease: "power1.in" }, 0);
        tl.call(
          () => {
            setLive(toId);
            zoneBus.emit("jump", { from: fromId, to: toId });
          },
          [],
          0.14
        );
        tl.to(veil, { opacity: 0, duration: 0.2, ease: "power1.out" }, 0.2);
        tl.call(() => zoneBus.emit("arrive", { zone: toId }), [], 0.24);
        return;
      }

      // per-jump dressing: flash tinted by the incoming district,
      // tear-slices alternating outgoing/incoming accents
      flash.style.background = `radial-gradient(circle at 50% 44%, rgba(255,255,255,0.95) 0%, rgba(${to.primaryRgb},0.55) 30%, rgba(${to.primaryRgb},0) 72%)`;
      const from = ZONES[fromId];
      slices.forEach((s, i) => {
        const col = i % 3 === 0 ? from.primaryRgb : to.primaryRgb;
        s.style.top = `${6 + Math.random() * 88}%`;
        s.style.height = `${2 + Math.pow(Math.random(), 2) * 22}px`;
        s.style.background = `rgba(${col},${0.5 + Math.random() * 0.35})`;
      });

      tl.fromTo(veil, { opacity: 0 }, { opacity: 0.45, duration: 0.05, ease: "power1.in" }, 0);
      tl.fromTo(flash, { opacity: 0 }, { opacity: 1, duration: 0.06, ease: "power3.in" }, 0);
      tl.fromTo(
        slices,
        { opacity: 0, xPercent: () => gsap.utils.random(-7, 7) },
        { opacity: 1, duration: 0.04, stagger: 0.012, ease: "steps(1)" },
        0.02
      );

      // ---- flash peak: the world swaps here ----
      tl.call(
        () => {
          setLive(toId);
          zoneBus.emit("jump", { from: fromId, to: toId });
        },
        [],
        0.07
      );

      // decay with a two-step flicker (power surge, not a fade)
      tl.to(
        flash,
        {
          keyframes: [
            { opacity: 0.28, duration: 0.05, ease: "steps(1)" },
            { opacity: 0.6, duration: 0.04, ease: "steps(1)" },
            { opacity: 0, duration: 0.24, ease: "power3.out" },
          ],
        },
        0.07
      );
      tl.to(
        slices,
        {
          xPercent: () => gsap.utils.random(10, 18) * dir * (Math.random() < 0.5 ? -1 : 1),
          opacity: 0,
          duration: 0.2,
          stagger: 0.012,
          ease: "power3.out",
        },
        0.08
      );
      tl.fromTo(
        fringes,
        { opacity: 0.85, x: (i: number) => (i === 0 ? 9 : -9) },
        { opacity: 0, x: 0, duration: 0.18, ease: "power2.out" },
        0.06
      );
      tl.to(veil, { opacity: 0, duration: 0.28, ease: "power2.out" }, 0.12);

      // decaying screen shake on the stage (fixed chrome sits outside it)
      const stage = document.getElementById("zone-stage");
      if (stage) {
        tl.fromTo(
          stage,
          { x: 0, y: 0 },
          {
            keyframes: [
              { x: -9 * dir, y: 5, duration: 0.045 },
              { x: 7 * dir, y: -4, duration: 0.05 },
              { x: -4 * dir, y: 2, duration: 0.055 },
              { x: 2 * dir, y: -1, duration: 0.06 },
              { x: 0, y: 0, duration: 0.05 },
            ],
            ease: "power2.out",
          },
          0.07
        );
        // GSAP leaves inline transforms behind — clear so nothing else fights it
        tl.set(stage, { clearProps: "transform" });
      }

      tl.call(() => zoneBus.emit("arrive", { zone: toId }), [], 0.26);
    };

    const scheduleWarp = (from: number, to: number) => {
      if (warpFrom === null) warpFrom = from;
      pendingTo = to;
      if (pendingTimer) return;
      pendingTimer = window.setTimeout(() => {
        pendingTimer = 0;
        const f = warpFrom ?? pendingTo;
        warpFrom = null;
        if (f === pendingTo) return; // scrolled there and back within the window
        buildWarp(zonesInDoc[f], zonesInDoc[pendingTo], pendingTo > f ? 1 : -1);
      }, COALESCE_MS);
    };

    /* ---------------- scroll → state ---------------- */

    const tick = (scrollY: number, silent = false) => {
      if (!zonesInDoc.length) return;
      const focus = scrollY + window.innerHeight * 0.5;

      let near = false;
      for (const b of bounds) {
        if (Math.abs(b - focus) < window.innerHeight * ALERT_BAND) {
          near = true;
          break;
        }
      }
      if (near !== alertOn) {
        alertOn = near;
        zoneBus.emit("alert", { on: near });
      }

      const idx = idxAt(focus);
      if (idx === activeIdx) return;
      const fromIdx = activeIdx;
      activeIdx = idx;
      if (silent || fromIdx < 0) {
        setLive(zonesInDoc[idx]);
        zoneBus.emit("set", { zone: zonesInDoc[idx] });
      } else {
        scheduleWarp(fromIdx, idx);
      }
    };

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => tick(self.scroll()),
    });
    const onRefresh = () => {
      measure();
      tick(window.scrollY, tl === null && activeIdx < 0);
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);

    measure();
    tick(window.scrollY, true); // initial sync — no ceremony on load

    return () => {
      st.kill();
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      window.clearTimeout(pendingTimer);
      tl?.kill();
    };
  }, []);

  return (
    <div ref={overlayRef} className="warp-overlay" aria-hidden>
      <div ref={veilRef} className="warp-veil" />
      <div
        ref={fringeARef}
        className="warp-fringe"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,42,60,0.18), transparent 35%, transparent 65%, rgba(255,42,60,0.18))",
        }}
      />
      <div
        ref={fringeBRef}
        className="warp-fringe"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,190,255,0.18), transparent 35%, transparent 65%, rgba(0,190,255,0.18))",
        }}
      />
      <div ref={flashRef} className="warp-flash" />
      <div ref={slicesRef} className="absolute inset-0">
        {Array.from({ length: SLICE_COUNT }, (_, i) => (
          <div key={i} className="warp-slice" />
        ))}
      </div>
    </div>
  );
};

export default WarpDirector;

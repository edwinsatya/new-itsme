"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { ZONES, type ZoneId } from "@/config/zones";
import { zoneBus } from "@/lib/zoneBus";

/** how close (in viewport heights) to a seam before chrome pre-alerts */
const ALERT_BAND = 0.38;
/** ms window that collapses boundary crossings during a fast fling */
const COALESCE_MS = 90;

/**
 * The console's disc drive. Watches scroll against every `[data-zone]`
 * seam and, on a real boundary crossing, plays one ~600ms cartridge-load:
 * two angled shutter panels snap closed, a genre-authentic loading screen
 * (VS flash / save gem / start lights / matchmaking spinner…) plays with
 * a quick progress fill, the world swaps beneath, and the shutters split
 * open on the new game. The same tick drives zoneBus, so the HUD chrome
 * never drifts out of sync.
 *
 * prefers-reduced-motion: the load becomes a same-duration plain dark cut
 * (no panels, no icons, no progress theatre).
 */
const LoadDirector = () => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const btmRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const veil = veilRef.current;
    const top = topRef.current;
    const btm = btmRef.current;
    const core = coreRef.current;
    const kicker = kickerRef.current;
    const title = titleRef.current;
    const bar = barRef.current;
    const pct = pctRef.current;
    if (!overlay || !veil || !top || !btm || !core || !kicker || !title || !bar || !pct) return;
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

    /* ---------------- the cartridge load itself ---------------- */

    const buildLoad = (fromId: ZoneId, toId: ZoneId) => {
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

      // dress the loading screen for the incoming game
      // (accent var lives on the overlay so the shutter edges inherit it too)
      core.dataset.loader = to.loader.kind;
      overlay.style.setProperty("--load-accent", to.primary);
      kicker.textContent = to.loader.kicker;
      title.textContent = to.game;
      const tint = `linear-gradient(180deg, rgba(${to.primaryRgb},0.06), rgba(4,5,8,0) 45%), #0a0b10`;
      top.style.background = tint;
      btm.style.background = tint;

      // restart the icon's CSS animation (nodes keep their classes)
      core.querySelectorAll<HTMLElement>(".load-ic *").forEach((el) => {
        el.style.animation = "none";
        void el.offsetWidth;
        el.style.animation = "";
      });

      // ---- shutters close ----
      tl.fromTo(veil, { opacity: 0 }, { opacity: 0.75, duration: 0.1, ease: "power2.in" }, 0);
      tl.fromTo(top, { yPercent: -104 }, { yPercent: 0, duration: 0.16, ease: "power3.in" }, 0);
      tl.fromTo(btm, { yPercent: 104 }, { yPercent: 0, duration: 0.16, ease: "power3.in" }, 0);

      // ---- covered: the world swaps here ----
      tl.call(
        () => {
          setLive(toId);
          zoneBus.emit("jump", { from: fromId, to: toId });
        },
        [],
        0.17
      );

      // ---- loading screen beat ----
      tl.fromTo(
        core,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" },
        0.14
      );
      const prog = { v: 0 };
      tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: "power1.inOut" }, 0.17);
      tl.to(
        prog,
        {
          v: 100,
          duration: 0.3,
          ease: "power1.inOut",
          onUpdate: () => {
            pct.textContent = `${Math.round(prog.v)}%`;
          },
        },
        0.17
      );

      // ---- shutters open onto the new game ----
      tl.to(core, { opacity: 0, y: -8, duration: 0.09, ease: "power1.in" }, 0.5);
      tl.to(top, { yPercent: -104, duration: 0.2, ease: "power3.inOut" }, 0.55);
      tl.to(btm, { yPercent: 104, duration: 0.2, ease: "power3.inOut" }, 0.55);
      tl.to(veil, { opacity: 0, duration: 0.18, ease: "power2.out" }, 0.56);

      tl.call(() => zoneBus.emit("arrive", { zone: toId }), [], 0.62);
    };

    const scheduleLoad = (from: number, to: number) => {
      if (warpFrom === null) warpFrom = from;
      pendingTo = to;
      if (pendingTimer) return;
      pendingTimer = window.setTimeout(() => {
        pendingTimer = 0;
        const f = warpFrom ?? pendingTo;
        warpFrom = null;
        if (f === pendingTo) return; // scrolled there and back within the window
        buildLoad(zonesInDoc[f], zonesInDoc[pendingTo]);
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
        scheduleLoad(fromIdx, idx);
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
    <div ref={overlayRef} className="load-overlay" aria-hidden>
      <div ref={veilRef} className="load-veil" />
      <div ref={topRef} className="load-panel load-panel--top" />
      <div ref={btmRef} className="load-panel load-panel--btm" />
      <div ref={coreRef} className="load-core" data-loader="sys">
        {/* one icon per genre — CSS shows only the incoming game's */}
        <div className="load-ic load-ic--sys"><i /><i /><i /><i /></div>
        <div className="load-ic load-ic--vs"><span>VS</span></div>
        <div className="load-ic load-ic--save"><i /></div>
        <div className="load-ic load-ic--level"><i /></div>
        <div className="load-ic load-ic--ops">
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="1.4">
            <circle cx="17" cy="17" r="12" opacity="0.5" />
            <line x1="17" y1="1" x2="17" y2="9" />
            <line x1="17" y1="25" x2="17" y2="33" />
            <line x1="1" y1="17" x2="9" y2="17" />
            <line x1="25" y1="17" x2="33" y2="17" />
            <circle cx="17" cy="17" r="1.6" fill="currentColor" stroke="none" />
          </svg>
        </div>
        <div className="load-ic load-ic--race"><i /><i /><i /></div>
        <div className="load-ic load-ic--match"><i /></div>
        <div className="load-ic load-ic--coin"><i /></div>

        <p ref={kickerRef} className="load-kicker">SYSTEM MENU</p>
        <p ref={titleRef} className="load-title">EDWIN.SYS</p>
        <div className="load-bar">
          <div ref={barRef} className="load-bar-fill" />
        </div>
        <span ref={pctRef} className="load-pct">0%</span>
      </div>
    </div>
  );
};

export default LoadDirector;

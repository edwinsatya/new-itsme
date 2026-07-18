"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, PRELOADER_DONE_EVENT, prefersReducedMotion } from "@/lib/gsap";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

const STATUS_LINES = ["POWERING ON", "READING LIBRARY…", "7 GAMES FOUND", "SAVE DATA OK"];

/** confetti in the library's colors — one dot per game */
const CONFETTI = [
  "#ff3d33",
  "#f0b43c",
  "#f97316",
  "#1fa84f",
  "#8be2ff",
  "#7ea8ff",
  "#c9a8ff",
  "#ff8ae0",
  "#ffd23f",
  "#e10600",
  "#3dff7c",
  "#ffffff",
];

/**
 * Console power-on with a real gate: the ring of game colors fills as
 * the system boots, pops into confetti — then STOPS on a focusable
 * PRESS START button (with a plain "click or tap to enter" hint for
 * non-gamers). Nothing continues until the visitor presses it. On
 * activation, the splash collapses like a CRT switching over and the
 * screen irises open onto the site. Reduced motion: the theatrics are
 * skipped and activation is a simple fade. Scroll stays locked until
 * the gate is passed.
 */
const Preloader = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const confettiRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<HTMLButtonElement>(null);
  const launchedRef = useRef(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);

  const finish = useCallback(() => {
    unlockScroll();
    window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
    setDone(true);
  }, []);

  /* the gate: user pressed start → CRT switch-over, then reveal */
  const launch = useCallback(() => {
    if (launchedRef.current) return;
    launchedRef.current = true;

    if (prefersReducedMotion()) {
      gsap.to(rootRef.current, { opacity: 0, duration: 0.25, onComplete: finish });
      return;
    }

    const tl = gsap.timeline({ onComplete: finish });
    // button acknowledges the press
    tl.to(startRef.current, { scale: 0.92, duration: 0.08, ease: "power2.in" }, 0);
    tl.to(startRef.current, { scale: 1, duration: 0.1 }, ">");
    // CRT switch-over: the splash collapses to a line, then a dot
    tl.to(stageRef.current, { scaleY: 0.006, scaleX: 1.04, duration: 0.3, ease: "power3.in" }, 0.1);
    tl.to(stageRef.current, { scaleX: 0.002, duration: 0.14, ease: "power2.in" }, ">");
    tl.set(stageRef.current, { opacity: 0 });
    // soft power-on glow where the dot vanished (small, not a screen flash)
    tl.fromTo(
      ".boot-burst",
      { opacity: 0.8, scale: 0.4 },
      { opacity: 0, scale: 1.6, duration: 0.4, ease: "power2.out" },
      "<"
    );
    // iris open onto the console
    tl.to(
      rootRef.current,
      { clipPath: "circle(0% at 50% 50%)", duration: 0.55, ease: "power3.inOut" },
      ">-0.15"
    );
  }, [finish]);

  useEffect(() => {
    lockScroll();

    if (prefersReducedMotion()) {
      setProgress(100);
      dimRef.current?.style.setProperty("--deg", "360deg");
      setReady(true);
      return unlockScroll;
    }

    const counter = { value: 0 };
    const update = () => {
      const v = Math.round(counter.value);
      setProgress(v);
      dimRef.current?.style.setProperty("--deg", `${v * 3.6}deg`);
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        ".boot-ring-wrap",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.6)" },
        0.1
      );
      tl.fromTo(
        ".boot-brand",
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        0.3
      );

      STATUS_LINES.forEach((line, i) => {
        tl.call(
          () => {
            if (statusRef.current) statusRef.current.textContent = line;
          },
          [],
          0.3 + i * 0.42
        );
      });

      tl.to(counter, { value: 46, duration: 0.6, ease: "power1.inOut", onUpdate: update }, 0.4);
      tl.to(counter, { value: 82, duration: 0.55, ease: "power2.out", onUpdate: update }, ">+0.08");
      tl.to(counter, { value: 100, duration: 0.4, ease: "power2.inOut", onUpdate: update }, ">");

      // 100%: the ring pops into confetti…
      tl.to(".boot-ring-wrap", { scale: 1.08, duration: 0.12, ease: "power2.in" }, ">");
      tl.to(".boot-ring-wrap", { scale: 0, opacity: 0, duration: 0.28, ease: "back.in(2)" }, ">");
      tl.addLabel("popped", ">");
      tl.call(() => {
        const host = confettiRef.current;
        if (!host) return;
        Array.from(host.children).forEach((el, i) => {
          const ang = (i / host.children.length) * Math.PI * 2 + Math.random() * 0.5;
          const dist = 70 + Math.random() * 110;
          gsap.fromTo(
            el,
            { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0 },
            {
              x: Math.cos(ang) * dist,
              y: Math.sin(ang) * dist,
              rotation: gsap.utils.random(-220, 220),
              opacity: 0,
              scale: 0.5,
              duration: 0.8,
              ease: "power2.out",
            }
          );
        });
      }, [], "popped-=0.08");

      // …and STOPS. The visitor has to press start.
      tl.call(() => setReady(true), [], "popped+=0.12");
    }, rootRef);

    return () => {
      unlockScroll();
      ctx.revert();
    };
  }, []);

  // hand keyboard users the button as soon as the gate appears
  useEffect(() => {
    if (ready) startRef.current?.focus({ preventScroll: true });
  }, [ready]);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[500] bg-[#05060d]"
      style={{
        clipPath: "circle(141% at 50% 50%)",
        background:
          "radial-gradient(120% 90% at 50% 40%, #0b0e1e 0%, #070812 55%, #04050c 100%)",
      }}
    >
      {/* small power-on glow used by the launch transition */}
      <div
        className="boot-burst pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0"
        style={{ background: "radial-gradient(circle, rgba(190,214,255,0.8), rgba(126,168,255,0.25) 45%, transparent 70%)" }}
        aria-hidden
      />

      <div ref={stageRef} className="flex h-full flex-col items-center justify-center gap-8">
        {/* the ring — every game's color, filling as the console boots */}
        <div className="relative flex items-center justify-center">
          <div className="boot-ring-wrap">
            <div className="boot-ring" />
            <div ref={dimRef} className="boot-ring-dim" />
            <div className="boot-center">
              <span className="font-display text-4xl text-[#eef2f7]">
                E<span style={{ color: "var(--live-accent)" }}>S</span>Y
              </span>
              <span className="font-mono text-[0.6rem] tracking-[0.2em] text-[rgba(238,242,247,0.5)]" suppressHydrationWarning>
                {progress}%
              </span>
            </div>
          </div>
          {/* confetti burst host */}
          <div ref={confettiRef} className="boot-confetti" aria-hidden>
            {CONFETTI.map((c, i) => (
              <i key={i} style={{ background: c }} />
            ))}
          </div>

          {/* THE GATE — a real button; the site waits for this press */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center gap-4 transition-opacity duration-300 ${
              ready ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <button
              ref={startRef}
              type="button"
              onClick={launch}
              disabled={!ready}
              aria-label="Enter the site — view Edwin's portfolio"
              className="boot-start"
            >
              <span className="press-start">▶ PRESS START</span>
            </button>
            <p className="boot-hint" aria-hidden>
              Click or tap to enter
            </p>
          </div>
        </div>

        <div className="boot-brand flex flex-col items-center gap-2 opacity-0">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.42em] text-[rgba(238,242,247,0.75)]">
            Game Entertainment System
          </p>
          <p
            ref={statusRef}
            className="font-mono text-[0.54rem] uppercase tracking-[0.3em] text-[rgba(238,242,247,0.38)]"
          >
            POWERING ON
          </p>
        </div>
      </div>
    </div>
  );
};

export default Preloader;

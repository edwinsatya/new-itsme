"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, PRELOADER_DONE_EVENT, prefersReducedMotion } from "@/lib/gsap";
import SectionBackground from "@/components/fx/SectionBackground";

const BOOT_LINES = [
  { text: "CHECKING SYSTEM MEMORY", status: "OK" },
  { text: "READING CARTRIDGE LIBRARY", status: "7 GAMES" },
  { text: "LOADING PLAYER PROFILE [E.S.YUDISTIRA]", status: "OK" },
];

/**
 * Console boot splash: the system mark powers on, boot checks stamp in,
 * the progress readout stutters, "PRESS START" slams in, then a hard cut
 * into the home screen. Scroll is locked while booting.
 */
const Preloader = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";

    const finish = () => {
      document.documentElement.style.overflow = "";
      window.dispatchEvent(new Event(PRELOADER_DONE_EVENT));
      setDone(true);
    };

    if (prefersReducedMotion()) {
      document
        .querySelectorAll<HTMLElement>(".boot-text")
        .forEach((el) => (el.textContent = el.dataset.full ?? ""));
      setProgress(100);
      const t = setTimeout(finish, 300);
      return () => {
        clearTimeout(t);
        document.documentElement.style.overflow = "";
      };
    }

    const counter = { value: 0 };
    const update = () => setProgress(Math.round(counter.value));

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: finish });

      // system mark powers on
      tl.fromTo(
        ".boot-mark",
        { opacity: 0, scale: 0.82 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" },
        0.1
      );
      tl.fromTo(
        ".boot-brand",
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        0.35
      );

      // boot checks type in
      tl.set(".boot-line", { autoAlpha: 0 }, 0);
      tl.set(".boot-status", { autoAlpha: 0 }, 0);
      gsap.utils.toArray<HTMLElement>(".boot-line").forEach((lineEl, i) => {
        const textEl = lineEl.querySelector<HTMLElement>(".boot-text");
        const full = textEl?.dataset.full ?? "";
        const proxy = { p: 0 };
        const at = 0.55 + i * 0.36;
        tl.set(lineEl, { autoAlpha: 1 }, at);
        tl.to(
          proxy,
          {
            p: 1,
            duration: 0.26,
            ease: "none",
            onUpdate: () => {
              if (textEl) textEl.textContent = full.slice(0, Math.round(proxy.p * full.length));
            },
          },
          at
        );
        tl.set(lineEl.querySelector(".boot-status"), { autoAlpha: 1 }, at + 0.3);
      });

      // progress: uneven, with a stall — a real console checking a disc
      tl.to(counter, { value: 34, duration: 0.45, ease: "power1.inOut", onUpdate: update }, 0.6);
      tl.to(counter, { value: 71, duration: 0.55, ease: "power2.out", onUpdate: update }, ">+0.1");
      tl.to(counter, { value: 100, duration: 0.45, ease: "power2.inOut", onUpdate: update }, ">+0.12");

      // PRESS START
      tl.call(() => startRef.current?.classList.add("glitched", "press-start"), [], ">-0.05");
      tl.to({}, { duration: 0.85 });

      // hard cut: flash frame, gone
      tl.set(".boot-flash", { opacity: 1 });
      tl.set(".boot-flash", { opacity: 0 }, "+=0.07");
      tl.set(rootRef.current, { autoAlpha: 0 }, "+=0.02");
    }, rootRef);

    return () => {
      document.documentElement.style.overflow = "";
      ctx.revert();
    };
  }, []);

  if (done) return null;

  return (
    <div ref={rootRef} className="fixed inset-0 z-[500] bg-[#05060a]">
      <SectionBackground variant="home" className="opacity-40" />
      <div
        className="boot-flash pointer-events-none absolute inset-0 z-10 opacity-0"
        style={{ background: "rgba(126,168,255,0.14)" }}
      />

      <div className="flex h-full flex-col justify-between px-6 py-8 md:px-12 md:py-10">
        {/* top strip */}
        <div className="flex items-center justify-between font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[var(--muted)]">
          <span>EDWIN.SYS — SYSTEM BOOT</span>
          <span className="text-[var(--accent-primary)]">v5.0_CONSOLE</span>
        </div>

        {/* system mark + boot log */}
        <div className="flex flex-col items-center gap-10 text-center">
          <div className="boot-mark flex flex-col items-center gap-5 opacity-0">
            <div
              className="tgt tgt-hot flex h-24 w-24 items-center justify-center"
              style={{ "--tgt-w": "18px" } as React.CSSProperties}
            >
              <span className="font-display text-4xl text-[var(--ink)]">
                E<span className="accent-1">S</span>Y
              </span>
            </div>
            <p className="boot-brand font-mono text-[0.62rem] uppercase tracking-[0.42em] text-[var(--muted)] opacity-0">
              Edwin Entertainment System
            </p>
          </div>

          <div className="flex min-h-[4.5rem] flex-col items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[var(--muted)]">
            {BOOT_LINES.map((line) => (
              <p key={line.text} className="boot-line">
                <span className="mr-2 text-[var(--accent-primary)]">&gt;</span>
                <span className="boot-text" data-full={line.text} />
                <span className="boot-status">
                  <span className="mx-2 opacity-40">....</span>
                  <span className="text-[var(--accent-primary)]">[{line.status}]</span>
                </span>
              </p>
            ))}
          </div>

          <p
            ref={startRef}
            data-text="PRESS START"
            className="glitch font-display text-[clamp(2rem,7vw,4.2rem)] text-[var(--ink)] opacity-0"
          >
            PRESS START
          </p>
        </div>

        {/* progress */}
        <div className="flex flex-col gap-4">
          <div className="h-[3px] w-full bg-[rgba(238,242,247,0.08)]">
            <div
              className="h-full w-full origin-left"
              style={{
                transform: `scaleX(${progress / 100})`,
                background: "linear-gradient(90deg, var(--accent-primary), #b7ccff)",
                boxShadow: "0 0 14px rgba(126,168,255,0.4)",
              }}
            />
          </div>
          <div className="flex items-end justify-between font-mono text-[0.6rem] uppercase tracking-[0.24em] text-[var(--muted)]">
            <span>Booting console — Lumajang, ID</span>
            <span suppressHydrationWarning>{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;

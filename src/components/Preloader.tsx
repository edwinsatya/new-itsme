"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, PRELOADER_DONE_EVENT, prefersReducedMotion } from "@/lib/gsap";
import SectionBackground from "@/components/fx/SectionBackground";

const BOOT_LINES = [
  { text: "INITIALIZING NEURAL LINK", status: "OK" },
  { text: "LOCATING RUNNER [E.S. YUDISTIRA]", status: "FOUND" },
  { text: "DECRYPTING PORTFOLIO DATA", status: "OK" },
  { text: "BYPASSING ICE — 接続完了", status: "CLEAN" },
];

/**
 * Terminal boot sequence: log lines stamp in, the progress readout
 * stutters (including one glitch backwards), "ACCESS GRANTED" slams in,
 * then a hard signal-cut into the hero. Scroll is locked while booting.
 */
const Preloader = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const accessRef = useRef<HTMLParagraphElement>(null);
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

      // log lines type in over the moving backdrop
      tl.set(".boot-line", { autoAlpha: 0 });
      tl.set(".boot-status", { autoAlpha: 0 });
      gsap.utils.toArray<HTMLElement>(".boot-line").forEach((lineEl, i) => {
        const textEl = lineEl.querySelector<HTMLElement>(".boot-text");
        const full = textEl?.dataset.full ?? "";
        const proxy = { p: 0 };
        const at = 0.15 + i * 0.42;
        tl.set(lineEl, { autoAlpha: 1 }, at);
        tl.to(
          proxy,
          {
            p: 1,
            duration: 0.32,
            ease: "none",
            onUpdate: () => {
              if (textEl) textEl.textContent = full.slice(0, Math.round(proxy.p * full.length));
            },
          },
          at
        );
        tl.set(lineEl.querySelector(".boot-status"), { autoAlpha: 1 }, at + 0.36);
      });

      // progress: uneven, with a stall and one glitch backwards
      tl.to(counter, { value: 31, duration: 0.5, ease: "power1.inOut", onUpdate: update }, 0.3);
      tl.to(".boot-bar", { x: 3, duration: 0.04, repeat: 3, yoyo: true }, ">");
      tl.to(counter, { value: 72, duration: 0.65, ease: "power2.out", onUpdate: update }, ">-0.02");
      tl.to(counter, { value: 67, duration: 0.07, ease: "none", onUpdate: update }, ">+0.14");
      tl.to(counter, { value: 100, duration: 0.5, ease: "power2.inOut", onUpdate: update }, ">");

      // ACCESS GRANTED
      tl.call(() => accessRef.current?.classList.add("glitched"), [], ">-0.05");
      tl.to({}, { duration: 0.6 });

      // hard cut: two-frame jerk, flash frame, gone
      tl.to(".boot-wrap", { x: -8, duration: 0.045, ease: "none" });
      tl.to(".boot-wrap", { x: 6, skewX: 1.5, duration: 0.045, ease: "none" });
      tl.set(".boot-wrap", { x: 0, skewX: 0 });
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
    <div ref={rootRef} className="fixed inset-0 z-[500] bg-[#06060b]">
      <SectionBackground variant="hero" className="opacity-50" />
      <div
        className="boot-flash pointer-events-none absolute inset-0 z-10 opacity-0"
        style={{ background: "rgba(0,229,255,0.16)" }}
      />

      <div className="boot-wrap flex h-full flex-col justify-between px-6 py-8 md:px-12 md:py-10">
        {/* top strip */}
        <div className="flex items-center justify-between font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[var(--muted)]">
          <span>E.S.Y // NIGHT CITY UPLINK</span>
          <span className="text-[var(--cyan)]">v4.0_CYB</span>
        </div>

        {/* boot log */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2.5 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-[var(--muted)] md:text-xs">
            {BOOT_LINES.map((line) => (
              <p key={line.text} className="boot-line">
                <span className="mr-2 text-[var(--magenta)]">&gt;</span>
                <span className="boot-text" data-full={line.text} />
                <span className="boot-status">
                  <span className="mx-2 opacity-40">......</span>
                  <span className="text-[var(--cyan)]">[{line.status}]</span>
                </span>
              </p>
            ))}
          </div>

          <p
            ref={accessRef}
            data-text="ACCESS GRANTED"
            className="glitch font-display text-[clamp(2.6rem,9vw,6.5rem)] text-[var(--ink)] opacity-0"
          >
            ACCESS GRANTED
          </p>
        </div>

        {/* progress */}
        <div className="flex flex-col gap-5">
          <div className="boot-bar h-[3px] w-full bg-[rgba(232,238,245,0.08)]">
            <div
              className="h-full w-full origin-left"
              style={{
                transform: `scaleX(${progress / 100})`,
                background: "linear-gradient(90deg, var(--cyan), var(--magenta))",
                boxShadow: "0 0 14px rgba(0,229,255,0.4)",
              }}
            />
          </div>
          <div className="flex items-end justify-between">
            <p className="hud-label">Jacking into the network — Lumajang, ID</p>
            <span className="font-display text-[clamp(3rem,11vw,7rem)] leading-none text-[var(--ink)]">
              {progress}
              <span className="neon-cyan">%</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;

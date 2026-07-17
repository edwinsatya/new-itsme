"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, PRELOADER_DONE_EVENT, prefersReducedMotion } from "@/lib/gsap";

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
 * Console power-on, v3: a ring holding every game's color fills up as
 * the system boots, status lines tick by, then the ring pops into a
 * confetti burst, PRESS START slams in, and the whole splash irises
 * open onto the home screen. No boot-log terminal — this is a toy,
 * not a server room. Scroll is locked while booting.
 */
const Preloader = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const confettiRef = useRef<HTMLDivElement>(null);
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
      setProgress(100);
      dimRef.current?.style.setProperty("--deg", "360deg");
      const t = setTimeout(finish, 300);
      return () => {
        clearTimeout(t);
        document.documentElement.style.overflow = "";
      };
    }

    const counter = { value: 0 };
    const update = () => {
      const v = Math.round(counter.value);
      setProgress(v);
      dimRef.current?.style.setProperty("--deg", `${v * 3.6}deg`);
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: finish });

      // power on: ring scales in
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

      // status ticker
      STATUS_LINES.forEach((line, i) => {
        tl.call(
          () => {
            if (statusRef.current) statusRef.current.textContent = line;
          },
          [],
          0.3 + i * 0.42
        );
      });

      // the ring fills with the library's colors
      tl.to(counter, { value: 46, duration: 0.6, ease: "power1.inOut", onUpdate: update }, 0.4);
      tl.to(counter, { value: 82, duration: 0.55, ease: "power2.out", onUpdate: update }, ">+0.08");
      tl.to(counter, { value: 100, duration: 0.4, ease: "power2.inOut", onUpdate: update }, ">");

      // 100%: the ring pops into confetti
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

      // PRESS START — only once the ring has fully popped
      tl.call(() => startRef.current?.classList.add("glitched", "press-start"), [], "popped+=0.12");
      tl.to({}, { duration: 0.9 });

      // iris open onto the console
      tl.to(rootRef.current, {
        clipPath: "circle(0% at 50% 50%)",
        duration: 0.55,
        ease: "power3.inOut",
      });
    }, rootRef);

    return () => {
      document.documentElement.style.overflow = "";
      ctx.revert();
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[500] flex flex-col items-center justify-center gap-8 bg-[#05060d]"
      style={{
        clipPath: "circle(141% at 50% 50%)",
        background:
          "radial-gradient(120% 90% at 50% 40%, #0b0e1e 0%, #070812 55%, #04050c 100%)",
      }}
    >
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
        {/* PRESS START slams over the popped ring */}
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p
            ref={startRef}
            data-text="PRESS START"
            className="glitch font-display text-[clamp(1.8rem,6vw,3.2rem)] text-[#eef2f7] opacity-0"
          >
            PRESS START
          </p>
        </span>
      </div>

      <div className="boot-brand flex flex-col items-center gap-2 opacity-0">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.42em] text-[rgba(238,242,247,0.75)]">
          Edwin Entertainment System
        </p>
        <p
          ref={statusRef}
          className="font-mono text-[0.54rem] uppercase tracking-[0.3em] text-[rgba(238,242,247,0.38)]"
        >
          POWERING ON
        </p>
      </div>
    </div>
  );
};

export default Preloader;

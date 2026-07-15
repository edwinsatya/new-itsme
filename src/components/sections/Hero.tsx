"use client";

import { useEffect, useRef } from "react";
import { gsap, EASE_OUT, PRELOADER_DONE_EVENT, prefersReducedMotion } from "@/lib/gsap";
import NeonRain from "@/components/fx/NeonRain";
import { runner } from "@/constants/profile";

/* deterministic skyline geometry: [x, width, height] — SSR-stable */
const BACK_TOWERS: [number, number, number][] = [
  [0, 70, 120], [80, 50, 180], [140, 90, 90], [240, 60, 150], [310, 80, 205],
  [400, 55, 110], [465, 70, 165], [545, 95, 82], [650, 60, 190], [720, 80, 130],
  [810, 65, 172], [885, 90, 100], [985, 55, 215], [1050, 75, 140], [1135, 60, 92],
  [1205, 85, 182], [1300, 70, 122], [1380, 60, 160],
];
const FRONT_TOWERS: [number, number, number][] = [
  [0, 90, 72], [100, 70, 132], [180, 110, 60], [300, 80, 104], [390, 120, 52],
  [520, 90, 112], [620, 140, 70], [770, 100, 92], [880, 130, 56], [1020, 90, 122],
  [1120, 110, 66], [1240, 100, 96], [1350, 90, 78],
];
/* lit windows: [x, y, cyan?] with a few that blink */
const WINDOWS: [number, number, boolean, boolean][] = [
  [96, 168, true, false], [104, 182, false, false], [330, 138, true, true],
  [338, 152, true, false], [668, 152, false, false], [676, 166, true, false],
  [1002, 122, true, true], [1010, 136, true, false], [1222, 158, false, false],
  [1230, 172, true, false], [740, 210, true, false], [438, 250, false, true],
  [1068, 208, true, false], [548, 262, true, false], [906, 268, false, false],
];

const TITLE_LINES = [
  { text: "EDWIN", indent: "md:ml-[6vw]" },
  { text: "SATYA YUDISTIRA", indent: "md:ml-[16vw]" },
];

/**
 * Boot-in hero: rain-slicked skyline, glitch-in name reveal, neon-sign
 * tagline, runner ID card readout. Plays once the preloader signs off.
 */
const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let play: (() => void) | undefined;
    let onMove: ((e: MouseEvent) => void) | undefined;
    let fallback: ReturnType<typeof setTimeout>;
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const glitchLines = gsap.utils.toArray<HTMLElement>(".hero-glitch");
      const sign = sectionRef.current?.querySelector(".hero-sign");

      const intro = gsap.timeline({ paused: true });
      glitchLines.forEach((el, i) => {
        intro.call(() => el.classList.add("glitched"), [], i * 0.16);
      });
      intro.call(() => sign?.classList.add("sign-on"), [], 0.55);
      intro.fromTo(
        ".hero-fade",
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: EASE_OUT, stagger: 0.09 },
        reduced ? 0 : 0.95
      );

      play = () => intro.play();
      window.addEventListener(PRELOADER_DONE_EVENT, play, { once: true });
      fallback = setTimeout(play, 4600);

      if (!reduced) {
        // scroll parallax — each layer drifts at its own speed
        gsap.utils.toArray<HTMLElement>("[data-scroll-speed]").forEach((el) => {
          gsap.to(el, {
            y: parseFloat(el.dataset.scrollSpeed!) * 500,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        });

        // mouse parallax — x only, scroll owns y
        if (window.matchMedia("(pointer: fine)").matches) {
          const layers = gsap.utils.toArray<HTMLElement>("[data-depth]").map((el) => ({
            depth: parseFloat(el.dataset.depth!),
            x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power2.out" }),
          }));
          onMove = (e: MouseEvent) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            layers.forEach((l) => l.x(nx * l.depth * 90));
          };
          window.addEventListener("mousemove", onMove);
        }
      }
    }, sectionRef);

    return () => {
      if (play) window.removeEventListener(PRELOADER_DONE_EVENT, play);
      if (onMove) window.removeEventListener("mousemove", onMove);
      clearTimeout(fallback);
      ctx.revert();
    };
  }, []);

  const est = String(runner.est);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="sector relative flex min-h-screen flex-col justify-center overflow-hidden"
      style={{ zIndex: 60, paddingTop: "5.5rem" }}
    >
      {/* diagonal-cut background w/ neon seam (same grammar as sectors) */}
      <div className="sector-bg-edge" aria-hidden />
      <div className="sector-bg" aria-hidden style={{ background: "var(--bg)" }} />

      {/* ------- night city backdrop ------- */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {/* haze glows behind the skyline */}
        <div
          data-depth="0.12"
          className="absolute bottom-[8%] left-[8%] h-64 w-[42%] rounded-full opacity-60 blur-[90px]"
          style={{ background: "rgba(255,46,136,0.14)" }}
        />
        <div
          data-depth="0.18"
          className="absolute bottom-[4%] right-[4%] h-72 w-[46%] rounded-full opacity-60 blur-[100px]"
          style={{ background: "rgba(0,229,255,0.12)" }}
        />

        {/* skyline — back layer */}
        <svg
          data-depth="0.1"
          data-scroll-speed="0.1"
          className="absolute bottom-0 left-[-4%] h-[46%] w-[108%]"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          {BACK_TOWERS.map(([x, w, h]) => (
            <rect key={`b${x}`} x={x} y={320 - h} width={w} height={h} fill="#0d0d18" />
          ))}
          {/* antenna masts */}
          <rect x="336" y="88" width="2" height="28" fill="#0d0d18" />
          <rect x="1008" y="78" width="2" height="28" fill="#0d0d18" />
          <circle cx="337" cy="86" r="2.5" fill="var(--magenta)" opacity="0.8" className="window-blink" />
          <circle cx="1009" cy="76" r="2.5" fill="var(--cyan)" opacity="0.8" className="window-blink" style={{ animationDelay: "2.4s" }} />
          {WINDOWS.map(([x, y, cyan, blinks], i) => (
            <rect
              key={`w${x}-${y}`}
              x={x}
              y={y}
              width="4"
              height="6"
              fill={cyan ? "var(--cyan)" : "var(--magenta)"}
              opacity="0.55"
              className={blinks ? "window-blink" : undefined}
              style={blinks ? { animationDelay: `${(i % 5) * 1.3}s` } : undefined}
            />
          ))}
        </svg>

        {/* skyline — front layer */}
        <svg
          data-depth="0.22"
          data-scroll-speed="0.22"
          className="absolute bottom-0 left-[-4%] h-[30%] w-[108%]"
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
        >
          {FRONT_TOWERS.map(([x, w, h]) => (
            <rect key={`f${x}`} x={x} y={160 - h} width={w} height={h} fill="#060609" />
          ))}
        </svg>

        {/* street-level glow line */}
        <div
          className="absolute bottom-0 h-px w-full"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(0,229,255,0.5) 30%, rgba(255,46,136,0.5) 70%, transparent)",
            boxShadow: "0 0 24px rgba(0,229,255,0.25)",
          }}
        />

        {/* neon rain, above skyline */}
        <NeonRain className="absolute inset-0 h-full w-full" />

        {/* vertical JP neon sign */}
        <div data-depth="0.32" className="drift absolute right-[6%] top-[22%] hidden lg:block">
          <p
            className="sign-jp text-2xl text-[rgba(255,46,136,0.75)]"
            style={{ textShadow: "0 0 12px rgba(255,46,136,0.6), 0 0 40px rgba(255,46,136,0.3)" }}
          >
            ランナー
          </p>
        </div>
      </div>

      {/* ------- runner ID card ------- */}
      <div className="hero-fade relative z-10 mx-auto w-full max-w-6xl opacity-0">
        <div className="tgt inline-block bg-[rgba(10,10,15,0.55)] p-5 backdrop-blur-[2px]">
          <p className="hud-label mb-3">Runner ID — verified</p>
          <div className="flex flex-col gap-1.5 font-mono text-[0.64rem] uppercase tracking-[0.18em] text-[var(--muted)]">
            <p>
              NAME<span className="mx-2 opacity-40">::</span>
              <span className="text-[var(--ink)]">{runner.name}</span>
            </p>
            <p>
              CLASS<span className="mx-2 opacity-40">::</span>
              <span className="text-[var(--ink)]">{runner.role}</span>
            </p>
            <p>
              EST<span className="mx-2 opacity-40">::</span>
              <span className="text-[var(--ink)]">{est}</span>
              <span className="mx-3 opacity-40">{"//"}</span>LOC
              <span className="mx-2 opacity-40">::</span>
              <span className="text-[var(--ink)]">Indonesia</span>
            </p>
            <p className="mt-1.5">
              <span className="tag">
                <span className="live-dot" />
                Online
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ------- name + neon tagline ------- */}
      <div data-scroll-speed="-0.28" className="relative z-10 mx-auto mt-10 w-full max-w-6xl md:mt-14">
        <h1 className="font-display text-[clamp(3.4rem,11vw,9.5rem)] text-[var(--ink)]">
          {TITLE_LINES.map((line) => (
            <span key={line.text} className={`block ${line.indent}`}>
              <span className="hero-glitch glitch opacity-0" data-text={line.text}>
                {line.text}
              </span>
            </span>
          ))}
        </h1>

        <p
          className="hero-sign sign font-display mt-6 text-[clamp(1.15rem,3vw,2.1rem)] text-[var(--magenta)] md:ml-[6vw]"
          aria-label="Code. Create. Reimagine."
        >
          ~ CODE. CREATE. REIMAGINE. ~
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4 md:ml-[6vw]">
          <a href="#works" className="hero-fade btn-neon opacity-0">
            Jack In ↴
          </a>
          <a href="#comm" className="hero-fade btn-neon btn-neon--m opacity-0">
            Hire Me
          </a>
          <span className="hero-fade tag tag--dim opacity-0">[Encrypted Channel]</span>
        </div>
      </div>

      {/* ------- bottom HUD cues ------- */}
      <div className="hero-fade absolute bottom-16 left-1/2 z-10 -translate-x-1/2 opacity-0 md:bottom-20">
        <div className="flex flex-col items-center gap-2">
          <span className="hud-label hud-label--bare">Scroll to descend</span>
          <span
            className="block h-8 w-px"
            style={{ background: "linear-gradient(180deg, var(--cyan), transparent)" }}
          />
        </div>
      </div>
      <p className="hero-fade absolute bottom-16 right-6 z-10 hidden font-mono text-[0.56rem] uppercase tracking-[0.24em] text-[var(--faint)] opacity-0 md:right-10 md:block">
        {runner.role} — EST. {est} — {runner.coords}
      </p>
    </section>
  );
};

export default Hero;

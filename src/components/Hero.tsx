"use client";

import { useEffect, useRef } from "react";
import {
  gsap,
  EASE_OUT,
  PRELOADER_DONE_EVENT,
  impactShake,
  prefersReducedMotion,
} from "@/lib/gsap";
import { SpeedLines, ImpactStar } from "./fx/SpeedLines";
import ChargeButton from "./fx/ChargeButton";

const nameLines = [
  { text: "Edwin", indent: "", stroke: false },
  { text: "Satya", indent: "md:ml-[10vw]", stroke: true },
  { text: "Yudistira", indent: "md:ml-[3vw]", stroke: false },
];

const characterFile = [
  ["Age", "—"],
  ["Class", "Full-Stack Developer"],
  ["Origin", "Indonesia"],
  ["Est.", "2020"],
];

/**
 * Cold open: anime-opening title card. The protagonist's name slams in line by
 * line over a radial speed-line field, with a red impact star at the focal point.
 */
const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let play: (() => void) | undefined;
    let onMouse: ((e: MouseEvent) => void) | undefined;
    let fallback: ReturnType<typeof setTimeout>;

    const ctx = gsap.context(() => {
      const showAll = () =>
        gsap.set(
          [".hero-lines", ".hero-star", ".hero-file", ".hero-phrase", ".hero-fade", ".hero-title-line", ".hero-sfx"],
          { opacity: 1, yPercent: 0, scale: 1, rotation: 0, clearProps: "visibility" }
        );

      if (prefersReducedMotion()) {
        showAll();
        gsap.set(".hero-lines", { opacity: 0.12 });
        return;
      }

      /* ---- Intro: plays once the preloader finishes ---- */
      const intro = gsap.timeline({ paused: true });

      intro.fromTo(
        ".hero-lines",
        { opacity: 0, scale: 1.18 },
        { opacity: 0.12, scale: 1, duration: 0.9, ease: "power2.out" }
      );
      intro.fromTo(
        ".hero-star",
        { opacity: 0, scale: 0.3, rotation: -14 },
        { opacity: 1, scale: 1, rotation: 0, duration: 0.5, ease: "back.out(2)" },
        "-=0.55"
      );
      intro.fromTo(
        ".hero-title-line",
        { yPercent: 120 },
        { yPercent: 0, opacity: 1, duration: 0.55, ease: EASE_OUT, stagger: 0.09 },
        "-=0.35"
      );
      // the jolt lands with the last name line
      intro.add(impactShake(".hero-shake", 8), "-=0.25");
      intro.fromTo(
        ".hero-phrase",
        { xPercent: -104 },
        { xPercent: 0, opacity: 1, duration: 0.4, ease: "power4.inOut" },
        "-=0.4"
      );
      intro.fromTo(
        ".hero-file",
        { scale: 0.5, rotation: -8, opacity: 0 },
        { scale: 1, rotation: -2, opacity: 1, duration: 0.5, ease: "back.out(2)" },
        "-=0.25"
      );
      intro.fromTo(
        ".hero-fade",
        { y: 26, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: EASE_OUT, stagger: 0.07 },
        "-=0.3"
      );
      intro.fromTo(
        ".hero-sfx",
        { scale: 0.3, rotation: -20, opacity: 0 },
        { scale: 1, rotation: -8, opacity: 1, duration: 0.45, ease: "back.out(2.4)" },
        "-=0.35"
      );

      play = () => intro.play();
      window.addEventListener(PRELOADER_DONE_EVENT, play, { once: true });
      fallback = setTimeout(play, 4500);

      /* ---- Scroll parallax: layers drift at their own speed ---- */
      gsap.utils.toArray<HTMLElement>("[data-scroll-speed]").forEach((el) => {
        gsap.to(el, {
          y: parseFloat(el.dataset.scrollSpeed!) * 600,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      /* ---- Mouse parallax, x-only so scroll owns y ---- */
      if (window.matchMedia("(pointer: fine)").matches) {
        const layers = gsap.utils.toArray<HTMLElement>("[data-depth]").map((el) => ({
          depth: parseFloat(el.dataset.depth!),
          x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power2.out" }),
        }));

        onMouse = (e: MouseEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          layers.forEach((l) => l.x(nx * l.depth * 120));
        };
        window.addEventListener("mousemove", onMouse);
      }
    }, sectionRef);

    return () => {
      if (play) window.removeEventListener(PRELOADER_DONE_EVENT, play);
      if (onMouse) window.removeEventListener("mousemove", onMouse);
      clearTimeout(fallback);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="theme-ink relative flex min-h-screen flex-col justify-center overflow-hidden px-6 pb-24 pt-28 md:px-12"
    >
      {/* ---- Backdrop layers ---- */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div data-depth="0.12" className="absolute inset-[-6%]">
          <SpeedLines
            className="hero-lines h-full w-full text-[var(--paper)] opacity-0"
            count={64}
            inner={240}
          />
        </div>
        <div
          data-depth="0.3"
          data-scroll-speed="-0.18"
          className="absolute left-[8%] top-[16%] h-[75vmin] w-[75vmin] md:left-[16%]"
        >
          <ImpactStar className="hero-star h-full w-full text-[var(--red)] opacity-0" />
        </div>
        <div
          data-depth="0.2"
          className="halftone-fade absolute right-[-4%] top-[8%] h-80 w-96 text-[var(--paper)] opacity-[0.14]"
        />
      </div>

      {/* ---- Character file panel ---- */}
      <div
        data-scroll-speed="-0.45"
        className="hero-file absolute right-6 top-24 z-10 hidden w-64 rotate-[-2deg] opacity-0 md:top-28 lg:block"
      >
        <div className="panel p-5 text-[var(--ink)]">
          <p className="hud-label mb-3 text-[var(--red)]">Character file</p>
          <dl className="space-y-1.5 font-mono text-[0.7rem] uppercase tracking-[0.12em]">
            {characterFile.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3 border-b border-[rgba(18,18,18,0.15)] pb-1.5">
                <dt className="opacity-60">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* ---- Title block ---- */}
      <div className="hero-shake relative z-10 mx-auto w-full max-w-6xl">
        <p className="hero-fade hud-label mb-4 !flex w-fit bg-[var(--ink)] py-1 pr-2 text-[var(--red)] opacity-0">
          第000話 — Cold Open
        </p>

        <span className="mb-6 inline-block overflow-hidden">
          <span className="hero-phrase brush-chip font-display inline-block bg-[var(--red)] px-4 py-1.5 text-sm tracking-[0.14em] text-[var(--paper)] opacity-0 md:text-base">
            Code. Create. Reimagine.
          </span>
        </span>

        <h1
          data-scroll-speed="-0.3"
          className="font-display relative text-[clamp(3.2rem,10.5vw,8.8rem)] leading-[0.88]"
        >
          {nameLines.map((line) => (
            <span key={line.text} className={`line-mask relative ${line.indent}`}>
              <span
                className={`hero-title-line inline-block opacity-0 ${
                  line.stroke ? "text-stroke-paper" : ""
                }`}
              >
                {line.text}
              </span>
            </span>
          ))}
          <span
            className="hero-sfx sfx-text absolute -right-2 top-[38%] hidden text-3xl opacity-0 md:block lg:text-4xl"
            aria-hidden
          >
            ドン!!
          </span>
        </h1>

        {/* CTAs */}
        <div className="relative mt-10 flex flex-wrap items-center gap-5">
          <span className="hero-fade relative inline-block opacity-0">
            <ChargeButton href="#contact" cursorLabel="GO!">
              Recruit Me
            </ChargeButton>
          </span>
          <span className="hero-fade inline-block opacity-0">
            <ChargeButton
              href="#battles"
              className="btn-charge--ghost"
              cursorLabel="CH.002"
            >
              View Battle Record
            </ChargeButton>
          </span>
        </div>
      </div>

      {/* ---- Margin captions ---- */}
      <p
        className="hero-fade v-text font-jp absolute right-7 top-1/2 hidden -translate-y-1/2 text-xs tracking-[0.5em] opacity-0 xl:block"
        aria-hidden
      >
        主人公 — エドウィン
      </p>

      <p className="hero-fade absolute bottom-8 left-6 max-w-[60%] font-mono text-[0.62rem] uppercase tracking-[0.25em] opacity-0 md:left-12">
        Full-Stack Developer — Est. 2020 — Indonesia
      </p>
      <p className="hero-fade absolute bottom-8 right-6 hidden font-mono text-[0.62rem] uppercase tracking-[0.25em] opacity-0 sm:block md:right-12">
        Scroll — Chapter 001 ↓
      </p>
    </section>
  );
};

export default Hero;

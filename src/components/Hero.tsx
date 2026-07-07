"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, EASE_OUT, PRELOADER_DONE_EVENT } from "@/lib/gsap";

const titleLines = [
  { text: "Code.", label: "01C", indent: "md:ml-[16vw]" },
  { text: "Create.", label: "02C", indent: "md:ml-[34vw]" },
  { text: "Reimagine.", label: "03R", indent: "md:ml-[2vw]" },
];

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let play: (() => void) | undefined;
    let onMove: ((e: MouseEvent) => void) | undefined;
    let fallback: ReturnType<typeof setTimeout>;

    const ctx = gsap.context(() => {
      // Intro — plays once the preloader finishes
      const intro = gsap.timeline({ paused: true });
      intro.fromTo(
        ".hero-title-line",
        { yPercent: 115 },
        { yPercent: 0, duration: 1.1, ease: EASE_OUT, stagger: 0.14 }
      );
      intro.fromTo(
        ".hero-fade",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: EASE_OUT, stagger: 0.08 },
        "-=0.5"
      );

      play = () => intro.play();
      window.addEventListener(PRELOADER_DONE_EVENT, play, { once: true });
      fallback = setTimeout(play, 4200);

      // Scroll parallax — every layer drifts at its own speed.
      // Layers are wrapped so mouse parallax (inner) never fights scroll (outer).
      gsap.utils.toArray<HTMLElement>("[data-scroll-speed]").forEach((el) => {
        gsap.to(el, {
          y: parseFloat(el.dataset.scrollSpeed!) * 700,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Floating cards bob gently (on the inner card, so it never fights
      // the mouse-parallax tween on the wrapper)
      gsap.utils.toArray<HTMLElement>(".hero-float .folder-card").forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 === 0 ? 14 : -14,
          duration: 3 + i,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      // Mouse parallax on layered scene — x only, scroll owns y
      if (window.matchMedia("(pointer: fine)").matches) {
        const layers = gsap.utils.toArray<HTMLElement>("[data-depth]").map((el) => ({
          depth: parseFloat(el.dataset.depth!),
          x: gsap.quickTo(el, "x", { duration: 0.8, ease: "power2.out" }),
        }));

        onMove = (e: MouseEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          layers.forEach((l) => {
            l.x(nx * l.depth * 140);
          });
        };
        window.addEventListener("mousemove", onMove);
      }
    }, sectionRef);

    return () => {
      if (play) window.removeEventListener(PRELOADER_DONE_EVENT, play);
      if (onMove) window.removeEventListener("mousemove", onMove);
      clearTimeout(fallback);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="home"
      ref={sectionRef}
      data-theme="teal"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden"
    >
      {/* ------- Layered parallax world ------- */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {/* Sky glow / moon */}
        <div data-depth="0.15" data-scroll-speed="-0.3" className="absolute right-[12%] top-[12%]">
          <div className="h-40 w-40 rounded-full bg-[#c0fb50] opacity-70 blur-[6px] md:h-56 md:w-56" />
          {/* shadow disc carves the crescent */}
          <div className="absolute left-[22%] top-[-10%] h-40 w-40 rounded-full bg-[#10474b] blur-[5px] md:h-56 md:w-56" />
          <div className="absolute -inset-10 rounded-full bg-[#c0fb50] opacity-20 blur-[60px]" />
        </div>

        {/* Stars */}
        <svg
          data-depth="0.08"
          className="absolute inset-0 h-full w-full opacity-50"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          fill="#efeee8"
        >
          {[
            [120, 130], [340, 80], [520, 210], [760, 120], [980, 60],
            [1150, 190], [1330, 90], [220, 320], [660, 300], [1240, 320],
            [80, 480], [420, 420], [1390, 460], [900, 260], [1060, 420],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2 : 1.2} />
          ))}
        </svg>

        {/* Dotted terrain mesh (right side) */}
        <svg
          data-depth="0.25"
          data-scroll-speed="-0.25"
          className="absolute right-[4%] top-[30%] hidden opacity-40 md:block"
          width="360"
          height="160"
          viewBox="0 0 360 160"
          fill="#c0fb50"
        >
          {Array.from({ length: 12 }).map((_, row) =>
            Array.from({ length: 30 }).map((_, col) => {
              // rounded so SSR and client render byte-identical coordinates
              const wave = Math.round(Math.sin(col * 0.5 + row * 0.8) * 100) / 10;
              return (
                <circle
                  key={`${row}-${col}`}
                  cx={col * 12 + row * 2}
                  cy={row * 12 + wave}
                  r="1"
                />
              );
            })
          )}
        </svg>

        {/* Mountains — back / mid / front */}
        <svg
          data-depth="0.1"
          data-scroll-speed="0.12"
          className="absolute bottom-0 left-[-5%] h-[55%] w-[110%]"
          viewBox="0 0 1440 500"
          preserveAspectRatio="none"
          fill="#0b393d"
        >
          <path d="M0,500 L0,280 L180,160 L340,260 L520,90 L700,240 L880,140 L1080,280 L1260,180 L1440,260 L1440,500 Z" />
        </svg>
        <svg
          data-depth="0.22"
          data-scroll-speed="0.25"
          className="absolute bottom-0 left-[-5%] h-[42%] w-[110%]"
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
          fill="#092f33"
        >
          <path d="M0,400 L0,240 L220,120 L420,230 L620,100 L840,250 L1040,130 L1240,240 L1440,150 L1440,400 Z" />
        </svg>
        <svg
          data-depth="0.38"
          data-scroll-speed="0.45"
          className="absolute bottom-0 left-[-5%] h-[30%] w-[110%]"
          viewBox="0 0 1440 300"
          preserveAspectRatio="none"
          fill="#062326"
        >
          <path d="M0,300 L0,190 L260,90 L500,200 L760,80 L1020,210 L1260,110 L1440,190 L1440,300 Z" />
        </svg>

        {/* Floating project cards */}
        <div
          data-depth="0.5"
          data-scroll-speed="-0.5"
          className="hero-float absolute right-[7%] top-[46%] hidden w-56 lg:block"
        >
          <div className="folder-card folder-card--right aspect-[4/5]">
            <span className="folder-label hud-label !text-[#0e4347]">Food Analyzer</span>
            <Image
              src="/ssproject1.svg"
              alt="Food analyzer project"
              fill
              sizes="224px"
              className="object-cover"
            />
          </div>
        </div>
        <div
          data-depth="0.6"
          data-scroll-speed="-0.65"
          className="hero-float absolute left-[6%] top-[56%] hidden w-44 lg:block"
        >
          <div className="folder-card aspect-[4/5]">
            <span className="folder-label hud-label !text-[#0e4347]">DeskLab</span>
            <Image
              src="/ssproject2.svg"
              alt="DeskLab project"
              fill
              sizes="176px"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* ------- Copy ------- */}
      <div
        className="hero-fade absolute max-w-[17rem] text-[0.8rem] leading-relaxed text-[var(--ink)] opacity-90 md:max-w-xs"
        style={{
          left: "calc(var(--frame-pad) + var(--frame-rail) + 2rem)",
          top: "calc(var(--frame-pad) + var(--frame-top) + 2.5rem)",
        }}
      >
        Edwin Satya is a full-stack developer crafting digital experiences. This portfolio is a
        living story — an uncharted world of code, waiting to be explored.
        <span className="hud-label mt-4 !flex">WX // Clear night — 22°C</span>
      </div>

      {/* Staircase title */}
      <h1 data-scroll-speed="-0.35" className="font-display relative z-10 mt-24 px-6 text-[clamp(3.2rem,10vw,8.5rem)] text-[var(--ink)] md:px-0">
        {titleLines.map((line) => (
          <span key={line.label} className={`line-mask relative ${line.indent}`}>
            <span className="hero-title-line flex items-start gap-3">
              <span className="mt-[1.2em] hidden font-mono text-[0.11em] font-normal tracking-[0.2em] opacity-70 md:inline">
                {line.label}
              </span>
              {line.text}
            </span>
          </span>
        ))}
      </h1>

      {/* Bottom caption */}
      <p
        className="hero-fade absolute max-w-[55%] font-mono text-[0.62rem] uppercase tracking-[0.25em] text-[var(--ink)] opacity-70 md:max-w-none"
        style={{
          left: "calc(var(--frame-pad) + var(--frame-rail) + 2rem)",
          bottom: "calc(var(--frame-pad) + 18px)",
        }}
      >
        Full-Stack Developer — Est. 2020 — Indonesia
      </p>
    </section>
  );
};

export default Hero;

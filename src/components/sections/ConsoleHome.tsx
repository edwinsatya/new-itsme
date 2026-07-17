"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, EASE_OUT, PRELOADER_DONE_EVENT, prefersReducedMotion } from "@/lib/gsap";
import SectionScene from "@/components/fx/SectionScene";
import GenreGlyph from "@/components/fx/GenreGlyph";
import { GAME_ORDER, ZONES } from "@/config/zones";
import { runner } from "@/constants/profile";

/**
 * The console home screen — the library rail. One tile per game
 * (= per section), each wearing its genre's cover-art palette.
 * Clicking a tile boots straight to that game; scrolling boots the
 * library in sequence. Plays its intro once the boot splash signs off.
 */
const ConsoleHome = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [greeting, setGreeting] = useState("WELCOME BACK");

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 5 ? "UP LATE" : h < 12 ? "GOOD MORNING" : h < 18 ? "GOOD AFTERNOON" : "GOOD EVENING");
  }, []);

  useEffect(() => {
    let play: (() => void) | undefined;
    let fallback: ReturnType<typeof setTimeout>;
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ paused: true });
      intro.call(() => {
        sectionRef.current
          ?.querySelectorAll<HTMLElement>(".home-slam")
          .forEach((el, i) => setTimeout(() => el.classList.add("glitched"), i * 140));
      });
      intro.fromTo(
        ".home-tile",
        { y: 34, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: EASE_OUT, stagger: 0.07, clearProps: "transform" },
        reduced ? 0 : 0.4
      );
      intro.fromTo(
        ".home-fade",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: EASE_OUT, stagger: 0.08 },
        reduced ? 0 : 0.55
      );

      play = () => intro.play();
      window.addEventListener(PRELOADER_DONE_EVENT, play, { once: true });
      fallback = setTimeout(play, 4600);
    }, sectionRef);

    return () => {
      if (play) window.removeEventListener(PRELOADER_DONE_EVENT, play);
      clearTimeout(fallback);
      ctx.revert();
    };
  }, []);

  return (
    <SectionScene
      zone="home"
      id="home"
      ref={sectionRef}
      zIndex={70}
      className="flex min-h-screen flex-col justify-center overflow-hidden"
      style={{ paddingTop: "5.5rem", paddingBottom: "5rem" }}
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        {/* system row */}
        <div className="home-fade flex flex-wrap items-center justify-between gap-3 opacity-0">
          <p className="hud-label">
            {greeting}, PLAYER 1 <span className="mx-1 opacity-50">{"//"}</span> {runner.name}
          </p>
          <p className="hud-label hud-label--bare">{GAME_ORDER.length} GAMES INSTALLED</p>
        </div>

        {/* greeting */}
        <h1 className="mt-8 font-display text-[clamp(2.8rem,7.5vw,6.2rem)] text-[var(--ink)]">
          <span className="home-slam glitch glitch--block opacity-0" data-text="EVERY SECTION">
            EVERY SECTION
          </span>
          <span
            className="home-slam glitch glitch--block opacity-0 md:ml-[8vw]"
            data-text="IS A DIFFERENT GAME."
          >
            IS A DIFFERENT <span className="accent-1">GAME.</span>
          </span>
        </h1>
        <p className="home-fade mt-6 max-w-xl text-[0.98rem] leading-relaxed text-[var(--muted)] opacity-0 md:ml-[8vw]">
          I&apos;m Edwin — a full-stack developer, and this portfolio is my console. Pick a
          cartridge from the library, or just scroll: the system boots each game in order.
        </p>

        {/* ---- the library rail ---- */}
        <div
          className="tile-rail -mx-6 mt-12 flex snap-x gap-4 overflow-x-auto px-6 pb-6 pt-4 md:mx-0 md:px-1"
          role="list"
          aria-label="Game library"
        >
          {GAME_ORDER.map((id, i) => {
            const g = ZONES[id];
            return (
              <a
                key={id}
                href={`#${id}`}
                role="listitem"
                className="gtile home-tile group opacity-0"
                data-cursor-label="BOOT"
                style={
                  {
                    "--tile-rgb": g.primaryRgb,
                    "--tile-bg": `radial-gradient(120% 90% at 50% 0%, rgba(${g.primaryRgb},0.2), transparent 62%), linear-gradient(165deg, rgba(${g.secondaryRgb},0.12), rgba(6,7,10,0.9) 55%), #090a10`,
                  } as React.CSSProperties
                }
              >
                <div className="gtile-art" style={{ color: g.primary }}>
                  <GenreGlyph zone={id} size={72} />
                </div>
                {/* cartridge index watermark */}
                <span className="absolute right-2.5 top-2 font-display text-2xl text-[rgba(238,242,247,0.16)]">
                  {g.index}
                </span>
                <div className="gtile-meta">
                  <p className="font-mono text-[0.5rem] uppercase tracking-[0.24em]" style={{ color: g.primary }}>
                    {g.genre}
                  </p>
                  <p className="font-display mt-1 text-[0.95rem] leading-tight text-[var(--ink)]">{g.game}</p>
                  <p className="mt-1 font-mono text-[0.52rem] uppercase tracking-[0.12em] text-[var(--faint)]">
                    {g.blurb}
                  </p>
                </div>
                <div className="gtile-boot">
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-[var(--ink)]">
                    ▶ Boot
                  </span>
                </div>
                {/* subtle keyboard hint: tile number */}
                <span className="sr-only">Game {i + 1}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* scroll-to-boot hint */}
      <div className="home-fade absolute bottom-14 left-1/2 z-10 -translate-x-1/2 opacity-0 md:bottom-16">
        <div className="flex flex-col items-center gap-2.5">
          <span className="hud-label hud-label--bare">Scroll to insert cartridge</span>
          <span className="chev" aria-hidden>
            <i />
            <i />
          </span>
        </div>
      </div>
    </SectionScene>
  );
};

export default ConsoleHome;

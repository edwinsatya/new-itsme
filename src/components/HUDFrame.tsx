"use client";

import { useEffect, useState } from "react";
import { gsap } from "@/lib/gsap";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import { runner } from "@/constants/profile";
import { GAME_ORDER, ZONES, type ZoneId } from "@/config/zones";
import GenreGlyph from "@/components/fx/GenreGlyph";
import { zoneBus } from "@/lib/zoneBus";

const NAV: { id: ZoneId; label: string }[] = [
  { id: "hero", label: "FIGHTER" },
  { id: "profile", label: "QUEST" },
  { id: "works", label: "WORLDS" },
  { id: "services", label: "LOADOUT" },
  { id: "journey", label: "CAREER" },
  { id: "contact", label: "LOBBY" },
];

/**
 * Console chrome, v3: a floating pill DOCK up top — every game is a
 * colored chip, and the game currently on screen shows as the inserted
 * cartridge (filled in its own color). Mobile menu is a game-library
 * grid of mini covers. Down below, two floating chips: the controller
 * legend and a NOW PLAYING readout fed by zoneBus.
 */
const HUDFrame = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [playing, setPlaying] = useState<ZoneId>("home");

  useEffect(() => {
    const offSet = zoneBus.on("set", ({ zone }) => setPlaying(zone));
    const offJump = zoneBus.on("jump", ({ to }) => setPlaying(to));
    return () => {
      offSet();
      offJump();
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    // hard lock (body-fixed) — Lenis and iOS touch both ignore plain
    // overflow:hidden; position is preserved so open/close never jumps
    lockScroll();
    gsap.fromTo(
      ".lib-card",
      { y: 24, opacity: 0, scale: 0.94 },
      { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: "power3.out" }
    );
    return unlockScroll;
  }, [menuOpen]);

  const nowPlaying = ZONES[playing];

  return (
    <>
      {/* ---- the dock ---- */}
      <nav className="dock" aria-label="Games">
        <a href="#home" className="dock-logo">
          <span
            className="live-dot"
            style={{ color: "var(--live-accent)", width: 6, height: 6 }}
            aria-hidden
          />
          EDWIN<b>.SYS</b>
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => {
            const z = ZONES[item.id];
            const active = playing === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`dock-item ${active ? "dock-item--active" : ""}`}
                style={
                  {
                    "--dock-c": z.primary,
                    "--dock-rgb": z.primaryRgb,
                  } as React.CSSProperties
                }
                aria-current={active ? "true" : undefined}
                aria-label={z.plain}
                title={z.plain}
              >
                <i aria-hidden />
                {item.label}
              </a>
            );
          })}
        </div>

        <a href="#contact" className="dock-cta hidden sm:inline-flex" aria-label="Contact me" title="Contact me">
          ▶ Press Start
        </a>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="dock-item lg:hidden"
          style={{ "--dock-c": "var(--live-accent)" } as React.CSSProperties}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close game library" : "Open game library"}
        >
          <span className="flex flex-col gap-[3px]" aria-hidden>
            <span className="block h-[2px] w-4 rounded bg-current" />
            <span className="block h-[2px] w-4 rounded bg-current" />
          </span>
          {menuOpen ? "CLOSE" : "GAMES"}
        </button>
      </nav>

      {/* ---- game library (mobile / tablet menu) ---- */}
      {menuOpen && (
        <div className="fixed inset-0 z-[210] flex flex-col justify-between overflow-y-auto bg-[rgba(5,6,12,0.96)] px-5 pb-8 pt-24 backdrop-blur-md lg:hidden">
          <div>
            <p className="hud-label hud-label--bare mb-4">Game library — pick a cartridge</p>
            <div className="grid grid-cols-2 gap-3">
              {GAME_ORDER.map((id) => {
                const z = ZONES[id];
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    onClick={(e) => {
                      // navigate AFTER the scroll lock releases — while the
                      // body is fixed the page has no height to scroll
                      e.preventDefault();
                      setMenuOpen(false);
                      window.setTimeout(() => {
                        document.getElementById(id)?.scrollIntoView();
                        history.replaceState(null, "", `#${id}`);
                      }, 80);
                    }}
                    className="lib-card"
                    style={{
                      background: `radial-gradient(120% 100% at 20% 0%, rgba(${z.primaryRgb},0.5), transparent 55%), linear-gradient(150deg, rgba(${z.secondaryRgb},0.35), rgba(9,10,18,0.95) 70%)`,
                    }}
                  >
                    <span style={{ color: z.primary }}>
                      <GenreGlyph zone={id} size={30} />
                    </span>
                    <span className="lib-card-genre" style={{ color: z.primary }}>
                      {z.genre}
                    </span>
                    <span className="lib-card-title">{z.game}</span>
                    <span className="font-mono text-[0.55rem] uppercase tracking-[0.12em] text-[rgba(255,255,255,0.72)]">
                      {z.plain}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <a href={`mailto:${runner.email}`} className="font-mono text-xs text-[rgba(238,242,247,0.8)]">
              {runner.email}
            </a>
            <p className="font-mono text-[0.54rem] uppercase tracking-[0.24em] text-[rgba(238,242,247,0.4)]">
              P1: {runner.name} — {runner.location}
            </p>
          </div>
        </div>
      )}

      {/* ---- floating bottom chips ---- */}
      <div className="hud-chip hud-chip--left hidden md:flex" aria-hidden>
        <span className="flex items-center gap-1.5">
          <span className="hud-key">A</span> Select
        </span>
        <span className="flex items-center gap-1.5">
          <span className="hud-key">B</span> Back
        </span>
        <span className="flex items-center gap-1.5">
          <span className="hud-key">▼</span> Next game
        </span>
      </div>
      <div className="hud-chip hud-chip--right">
        <span className="opacity-60">Now playing</span>
        <span style={{ color: "var(--live-accent)", transition: "color 0.4s" }}>
          {nowPlaying.game}
        </span>
        <span className="live-dot" style={{ color: "var(--live-accent)" }} />
      </div>
    </>
  );
};

export default HUDFrame;

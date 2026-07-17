"use client";

import { useEffect, useState } from "react";
import { gsap } from "@/lib/gsap";
import { runner, socials } from "@/constants/profile";
import { ZONES, type ZoneId } from "@/config/zones";
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
 * Persistent console chrome: top system bar (library nav + clock),
 * mobile quick-menu overlay, and the classic game-UI bottom strip —
 * a controller button legend plus a NOW PLAYING readout fed by zoneBus.
 */
const HUDFrame = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [clock, setClock] = useState("--:--:--");
  const [playing, setPlaying] = useState<ZoneId>("home");

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-GB", { hour12: false, timeZone: "Asia/Jakarta" });
    setClock(fmt());
    const t = setInterval(() => setClock(fmt()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const offSet = zoneBus.on("set", ({ zone }) => setPlaying(zone));
    const offJump = zoneBus.on("jump", ({ to }) => setPlaying(to));
    return () => {
      offSet();
      offJump();
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.documentElement.classList.add("lenis-stopped");
      gsap.fromTo(
        ".menu-link",
        { x: -28, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.45, stagger: 0.06, ease: "power3.out" }
      );
    } else {
      document.documentElement.classList.remove("lenis-stopped");
    }
    return () => document.documentElement.classList.remove("lenis-stopped");
  }, [menuOpen]);

  const nowPlaying = ZONES[playing];

  return (
    <>
      {/* ---- top system bar ---- */}
      <header className="fixed inset-x-0 top-0 z-[220] border-b border-[var(--line)] bg-[rgba(7,8,12,0.72)] backdrop-blur-sm">
        <div className="flex h-14 items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-4">
            <a href="#home" className="font-mono text-sm tracking-[0.3em] text-[var(--ink)]">
              EDWIN<span style={{ color: "var(--live-accent)", transition: "color 0.4s" }}>.SYS</span>
            </a>
            <span className="tag hidden sm:inline-flex">
              <span className="live-dot" />
              P1 Online
            </span>
          </div>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Games">
            {NAV.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="link-game font-mono text-[0.62rem] uppercase tracking-[0.25em] text-[var(--muted)]"
              >
                <span
                  className="mr-1 opacity-70"
                  style={{ color: "var(--live-accent)", transition: "color 0.4s" }}
                >
                  0{i + 1}_
                </span>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <span
              suppressHydrationWarning
              className="hidden font-mono text-[0.6rem] tracking-[0.2em] text-[var(--muted)] lg:inline"
            >
              {clock} WIB
            </span>
            <a href="#contact" className="btn-game hidden !px-4 !py-2 !text-[0.58rem] sm:inline-flex">
              Press Start
            </a>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="font-mono text-[0.62rem] uppercase tracking-[0.25em] md:hidden"
              style={{ color: "var(--live-accent)" }}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? "[CLOSE]" : "[MENU]"}
            </button>
          </div>
        </div>
      </header>

      {/* ---- mobile quick menu ---- */}
      {menuOpen && (
        <div className="fixed inset-0 z-[210] flex flex-col justify-between bg-[rgba(5,6,10,0.97)] px-6 pb-10 pt-24 md:hidden">
          <nav className="flex flex-col gap-6" aria-label="Games">
            {NAV.map((item, i) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMenuOpen(false)}
                className="menu-link font-display text-4xl text-[var(--ink)]"
              >
                <span className="mr-3 font-mono text-xs" style={{ color: ZONES[item.id].primary }}>
                  0{i + 1}_
                </span>
                {item.label}
                <span className="ml-3 align-middle font-mono text-[0.55rem] tracking-[0.2em] text-[var(--faint)]">
                  {ZONES[item.id].genre}
                </span>
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-4">
            <p className="hud-label">Direct message</p>
            <a href={`mailto:${runner.email}`} className="menu-link font-mono text-sm text-[var(--ink)]">
              {runner.email}
            </a>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="menu-link tag">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---- bottom strip: button legend + NOW PLAYING ---- */}
      <div className="fixed inset-x-0 bottom-0 z-[220] hidden h-9 items-center justify-between border-t border-[var(--line)] bg-[rgba(7,8,12,0.72)] px-6 font-mono text-[0.56rem] uppercase tracking-[0.24em] text-[var(--muted)] backdrop-blur-sm md:flex">
        <span className="flex items-center gap-5" aria-hidden>
          <span className="flex items-center gap-1.5">
            <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[var(--line)] text-[0.5rem] text-[var(--ink)]">
              A
            </span>
            Select
          </span>
          <span className="flex items-center gap-1.5">
            <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[var(--line)] text-[0.5rem] text-[var(--ink)]">
              B
            </span>
            Back
          </span>
          <span className="hidden items-center gap-1.5 lg:flex">
            <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[var(--line)] text-[0.5rem] text-[var(--ink)]">
              ▼
            </span>
            Scroll to boot next game
          </span>
        </span>
        <span className="flex items-center gap-3">
          <span className="opacity-60">Now playing:</span>
          <span style={{ color: "var(--live-accent)", transition: "color 0.4s" }}>
            {nowPlaying.game}
          </span>
          <span className="live-dot" style={{ color: "var(--live-accent)" }} />
        </span>
      </div>
    </>
  );
};

export default HUDFrame;

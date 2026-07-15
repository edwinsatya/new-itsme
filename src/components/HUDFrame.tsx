"use client";

import { useEffect, useState } from "react";
import { gsap } from "@/lib/gsap";
import { runner, socials } from "@/constants/profile";

const NAV = [
  { id: "profile", index: "01", label: "ID" },
  { id: "works", index: "02", label: "RUNS" },
  { id: "loadout", index: "03", label: "LOADOUT" },
  { id: "log", index: "04", label: "LOG" },
  { id: "comm", index: "05", label: "COMM" },
];

/**
 * Persistent HUD chrome: top nav bar, mobile comm-menu overlay,
 * bottom status strip and side-rail signage.
 */
const HUDFrame = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [clock, setClock] = useState("--:--:--");

  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-GB", { hour12: false, timeZone: "Asia/Jakarta" });
    setClock(fmt());
    const t = setInterval(() => setClock(fmt()), 1000);
    return () => clearInterval(t);
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

  return (
    <>
      {/* ---- top bar ---- */}
      <header className="fixed inset-x-0 top-0 z-[220] border-b border-[var(--line)] bg-[rgba(10,10,15,0.72)] backdrop-blur-sm">
        <div className="flex h-14 items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-4">
            <a href="#home" className="font-mono text-sm tracking-[0.3em] text-[var(--ink)]">
              E.S.Y<span className="neon-magenta">{"//"}</span>
            </a>
            <span className="tag hidden sm:inline-flex">
              <span className="live-dot" />
              Online
            </span>
          </div>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Sectors">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="link-neon font-mono text-[0.62rem] uppercase tracking-[0.25em] text-[var(--muted)]"
              >
                <span className="mr-1 text-[var(--cyan)] opacity-70">{item.index}_</span>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href="#comm" className="btn-neon btn-neon--m hidden !px-4 !py-2 !text-[0.58rem] sm:inline-flex">
              Jack In
            </a>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="font-mono text-[0.62rem] uppercase tracking-[0.25em] text-[var(--cyan)] md:hidden"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? "[CLOSE]" : "[MENU]"}
            </button>
          </div>
        </div>
      </header>

      {/* ---- mobile comm menu ---- */}
      {menuOpen && (
        <div className="fixed inset-0 z-[210] flex flex-col justify-between bg-[rgba(6,6,11,0.97)] px-6 pb-10 pt-24 md:hidden">
          <nav className="flex flex-col gap-6" aria-label="Sectors">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMenuOpen(false)}
                className="menu-link font-display text-4xl text-[var(--ink)]"
              >
                <span className="mr-3 font-mono text-xs text-[var(--cyan)]">{item.index}_</span>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-4">
            <p className="hud-label">Direct line</p>
            <a href={`mailto:${runner.email}`} className="menu-link font-mono text-sm text-[var(--cyan)]">
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

      {/* ---- bottom status strip ---- */}
      <div className="fixed inset-x-0 bottom-0 z-[220] hidden h-9 items-center justify-between border-t border-[var(--line)] bg-[rgba(10,10,15,0.72)] px-6 font-mono text-[0.56rem] uppercase tracking-[0.24em] text-[var(--muted)] backdrop-blur-sm md:flex">
        <span>
          NODE: LMJ-IDN <span className="mx-2 opacity-40">{"//"}</span> {runner.coords}
        </span>
        <span className="flex items-center gap-6">
          <span suppressHydrationWarning>T: {clock} WIB</span>
          <span className="flex items-center gap-2 text-[var(--cyan)]">
            <span className="live-dot" />
            Signal: Stable
          </span>
        </span>
      </div>

      {/* ---- side rails (xl+) ---- */}
      <div className="pointer-events-none fixed left-5 top-1/2 z-[80] hidden -translate-y-1/2 xl:block" aria-hidden>
        <p className="sign-jp font-mono text-[0.56rem] uppercase tracking-[0.4em] text-[var(--faint)]">
          Runner portfolio — est. {runner.est}
        </p>
      </div>
      <div className="pointer-events-none fixed right-5 top-1/2 z-[80] hidden -translate-y-1/2 xl:block" aria-hidden>
        <p className="sign-jp text-sm text-[rgba(255,46,136,0.4)]" style={{ textShadow: "0 0 12px rgba(255,46,136,0.35)" }}>
          電脳都市
        </p>
      </div>
    </>
  );
};

export default HUDFrame;

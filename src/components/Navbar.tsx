"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, EASE_OUT } from "@/lib/gsap";

const navItems = [
  { label: "Profile", href: "#origin", index: "001" },
  { label: "Battles", href: "#battles", index: "002" },
  { label: "Abilities", href: "#abilities", index: "003" },
  { label: "Training", href: "#training", index: "004" },
];

const menuItems = [
  { label: "Cold Open", href: "#home", kanji: "第000話" },
  { label: "Profile", href: "#origin", kanji: "第001話" },
  { label: "Battles", href: "#battles", kanji: "第002話" },
  { label: "Abilities", href: "#abilities", kanji: "第003話" },
  { label: "Training", href: "#training", kanji: "第004話" },
  { label: "Contact", href: "#contact", kanji: "第005話" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      tl.set(overlayRef.current, { pointerEvents: "auto" });
      // hard-edged panel wipe, not a fade
      tl.to(overlayRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.55,
        ease: "power4.inOut",
      });
      tl.fromTo(
        ".menu-link-inner",
        { yPercent: 120 },
        { yPercent: 0, duration: 0.55, ease: EASE_OUT, stagger: 0.05 },
        "-=0.2"
      );
      tl.fromTo(
        ".menu-meta",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: EASE_OUT, stagger: 0.07 },
        "-=0.35"
      );
      tlRef.current = tl;
    }, overlayRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!tlRef.current) return;
    if (isOpen) {
      tlRef.current.timeScale(1).play();
    } else {
      tlRef.current.timeScale(1.7).reverse();
    }
  }, [isOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[80] border-b-[3px] border-[var(--red)] bg-[var(--ink)] text-[var(--paper)]">
        <div className="flex h-16 items-center justify-between px-5 md:px-8">
          {/* Logo */}
          <a href="#home" className="font-display text-lg tracking-[0.06em]">
            Edwin<span className="text-[var(--red)]">/</span>Satya
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-9 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="slash-link font-mono text-[0.68rem] font-medium uppercase tracking-[0.2em]"
              >
                <span className="mr-1.5 text-[var(--red)]">{item.index}</span>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="#contact"
              data-cursor-label="GO!"
              className="btn-charge btn-charge--sm hidden sm:inline-flex"
            >
              Hire Me
            </a>

            {/* Burger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              className="relative flex h-10 w-10 items-center justify-center border-2 border-[var(--paper)]"
            >
              <span
                className={`absolute h-[2.5px] w-5 bg-current transition-transform duration-300 ${
                  isOpen ? "translate-y-0 rotate-45" : "-translate-y-[4px]"
                }`}
              />
              <span
                className={`absolute h-[2.5px] w-5 bg-current transition-transform duration-300 ${
                  isOpen ? "translate-y-0 -rotate-45" : "translate-y-[4px]"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen chapter-select menu */}
      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-[75] flex flex-col justify-between bg-[var(--ink)] px-6 pb-10 pt-28 text-[var(--paper)] md:px-20"
        style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      >
        <div className="halftone-fade pointer-events-none absolute inset-0 text-[var(--paper)] opacity-[0.07]" aria-hidden />

        <nav className="relative">
          <p className="hud-label mb-6 text-[var(--red)]">Chapter select</p>
          <ul className="flex flex-col">
            {menuItems.map((item) => (
              <li
                key={item.label}
                className="overflow-hidden border-b-2 border-[rgba(242,239,230,0.15)]"
              >
                <a
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="menu-link-inner group flex items-baseline gap-4 py-3 md:gap-8"
                >
                  <span className="font-jp text-xs text-[var(--red)] md:text-sm">
                    {item.kanji}
                  </span>
                  <span className="font-display text-[clamp(2rem,6.5vw,4.2rem)] uppercase transition-colors duration-200 group-hover:text-[var(--red)]">
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="menu-meta flex flex-col gap-1 font-mono text-xs uppercase tracking-[0.2em] opacity-80">
            <span>Lumajang, Indonesia</span>
            <a href="mailto:edwinsatyayudistira@gmail.com" className="slash-link w-fit">
              edwinsatyayudistira@gmail.com
            </a>
          </div>

          <div className="menu-meta flex gap-6 font-mono text-xs uppercase tracking-[0.2em]">
            <a href="https://github.com/edwinsatya" target="_blank" className="slash-link">
              Github
            </a>
            <a
              href="https://www.linkedin.com/in/edwin-satya-yudistira/"
              target="_blank"
              className="slash-link"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;

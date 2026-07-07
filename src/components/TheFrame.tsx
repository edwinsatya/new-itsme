"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, EASE_OUT, EASE_IN_OUT } from "@/lib/gsap";

const navItems = [
  { label: "Profile", href: "#about" },
  { label: "Works", href: "#works" },
  { label: "Services", href: "#services" },
  { label: "Journey", href: "#journey" },
];

const menuItems = [
  { label: "Home", href: "#home", index: "01" },
  { label: "Profile", href: "#about", index: "02" },
  { label: "Works", href: "#works", index: "03" },
  { label: "Services", href: "#services", index: "04" },
  { label: "Journey", href: "#journey", index: "05" },
  { label: "Contact", href: "#contact", index: "06" },
];

const TheFrame = () => {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      tl.set(overlayRef.current, { pointerEvents: "auto" });
      tl.to(overlayRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.8,
        ease: EASE_IN_OUT,
      });
      tl.fromTo(
        ".menu-link-inner",
        { yPercent: 120 },
        { yPercent: 0, duration: 0.7, ease: EASE_OUT, stagger: 0.06 },
        "-=0.3"
      );
      tl.fromTo(
        ".menu-meta",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: EASE_OUT, stagger: 0.08 },
        "-=0.4"
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
      tlRef.current.timeScale(1.6).reverse();
    }
  }, [isOpen]);

  return (
    <>
      <div className="the-frame">
        {/* Frame lines */}
        <div className="frame-border" />
        <div className="frame-topline" />
        <div className="frame-railline" />

        {/* Hamburger — top-left cell */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="absolute flex items-center justify-center"
          style={{
            left: "var(--frame-pad)",
            top: "var(--frame-pad)",
            width: "max(var(--frame-rail), 56px)",
            height: "var(--frame-top)",
          }}
        >
          <span className="relative flex h-8 w-8 items-center justify-center text-[var(--ink)]">
            <span
              className={`absolute h-[1.5px] w-5 bg-current transition-transform duration-300 ${
                isOpen ? "translate-y-0 rotate-45" : "-translate-y-[3px]"
              }`}
            />
            <span
              className={`absolute h-[1.5px] w-5 bg-current transition-transform duration-300 ${
                isOpen ? "translate-y-0 -rotate-45" : "translate-y-[3px]"
              }`}
            />
          </span>
        </button>

        {/* Name — beside hamburger */}
        <a
          href="#home"
          className="absolute hidden items-center font-mono text-[0.68rem] font-medium uppercase tracking-[0.22em] text-[var(--ink)] md:flex"
          style={{
            left: "calc(var(--frame-pad) + var(--frame-rail) + 1.5rem)",
            top: "var(--frame-pad)",
            height: "var(--frame-top)",
          }}
        >
          Edwin Satya
        </a>

        {/* Center nav */}
        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex"
          style={{ top: "var(--frame-pad)", height: "var(--frame-top)" }}
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="group flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-[var(--ink)] opacity-60 transition-opacity duration-300 hover:opacity-100"
            >
              <span className="h-[5px] w-[5px] bg-current opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              {item.label}
            </a>
          ))}
        </nav>

        {/* Hire me — top-right */}
        <a
          href="#contact"
          className="btn-hud absolute"
          style={{
            right: "calc(var(--frame-pad) + 10px)",
            top: "calc(var(--frame-pad) + 9px)",
            height: "calc(var(--frame-top) - 18px)",
          }}
        >
          Hire Me
        </a>

        {/* Crosshair — left rail */}
        <div
          className="absolute hidden -translate-y-1/2 justify-center text-[var(--ink)] md:flex"
          style={{
            left: "var(--frame-pad)",
            width: "var(--frame-rail)",
            top: "50%",
          }}
        >
          <svg width="24" height="44" viewBox="0 0 24 44" fill="none" stroke="currentColor">
            <line x1="12" y1="0" x2="12" y2="44" strokeWidth="1" />
            <line x1="2" y1="22" x2="22" y2="22" strokeWidth="1" />
            <circle cx="12" cy="22" r="4.5" strokeWidth="1.2" />
          </svg>
        </div>

        {/* Barcode — bottom-left */}
        <div
          className="absolute bottom-0 hidden items-end justify-center pb-6 text-[var(--ink)] md:flex"
          style={{ left: "var(--frame-pad)", width: "var(--frame-rail)", bottom: "var(--frame-pad)" }}
        >
          <svg width="22" height="14" viewBox="0 0 22 14" fill="currentColor">
            <rect x="0" width="1.5" height="14" />
            <rect x="3" width="1" height="10" y="2" />
            <rect x="6" width="2" height="14" />
            <rect x="10" width="1" height="8" y="3" />
            <rect x="13" width="1.5" height="12" y="1" />
            <rect x="16" width="1" height="14" />
            <rect x="19" width="2" height="9" y="2.5" />
          </svg>
        </div>

        {/* Scroll hint — bottom-right */}
        <span
          className="absolute font-mono text-[0.62rem] uppercase tracking-[0.25em] text-[var(--ink)] opacity-70"
          style={{ right: "calc(var(--frame-pad) + 16px)", bottom: "calc(var(--frame-pad) + 14px)" }}
        >
          Scroll ↘
        </span>
      </div>

      {/* Fullscreen overlay menu — fixed KPR teal, independent of section theme */}
      <div
        ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-[75] flex flex-col justify-between bg-[#0e4347] px-6 pb-12 pt-28 md:px-24"
        style={{ clipPath: "inset(0% 0% 100% 0%)" }}
      >
        <nav>
          <ul className="flex flex-col">
            {menuItems.map((item) => (
              <li
                key={item.label}
                className="overflow-hidden border-b border-[rgba(239,238,232,0.15)]"
              >
                <a
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="menu-link-inner group flex items-baseline gap-4 py-3 md:gap-8"
                >
                  <span className="font-mono text-xs text-[#c0fb50]">{item.index}</span>
                  <span className="font-display text-[clamp(2.2rem,7vw,4.5rem)] text-[#efeee8] transition-colors duration-300 group-hover:text-[#c0fb50]">
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="menu-meta flex flex-col gap-1 font-mono text-xs uppercase tracking-[0.2em] text-[rgba(239,238,232,0.6)]">
            <span>Lumajang, Indonesia</span>
            <a
              href="mailto:edwinsatyayudistira@gmail.com"
              className="link-underline w-fit text-[#efeee8]"
            >
              edwinsatyayudistira@gmail.com
            </a>
          </div>

          <div className="menu-meta flex gap-6 font-mono text-xs uppercase tracking-[0.2em]">
            <a
              href="https://github.com/edwinsatya"
              target="_blank"
              className="link-underline text-[#efeee8]"
            >
              Github
            </a>
            <a
              href="https://www.linkedin.com/in/edwin-satya-yudistira/"
              target="_blank"
              className="link-underline text-[#efeee8]"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default TheFrame;

"use client";

import { RefObject, useEffect } from "react";
import { gsap } from "@/lib/gsap";

/** Total px a layer travels while its section crosses the viewport, per unit of speed. */
export const PARALLAX_TRAVEL = 700;

/**
 * Wires up KPR-style depth inside the section:
 * - every [data-scroll-speed] layer sweeps `speed * PARALLAX_TRAVEL` px
 *   (centered, so it sits at its designed spot mid-section) while the
 *   section crosses the viewport
 * - every [data-enter] block rises toward the viewer (translate + scale)
 *   as the section enters, making each section change feel like a scene cut
 */
export function useSectionParallax<T extends HTMLElement>(scope: RefObject<T | null>) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-scroll-speed]").forEach((el) => {
        const travel = parseFloat(el.dataset.scrollSpeed!) * PARALLAX_TRAVEL;
        gsap.fromTo(
          el,
          { y: -travel / 2 },
          {
            y: travel / 2,
            ease: "none",
            scrollTrigger: {
              trigger: scope.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-enter]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 160, scale: 0.94, opacity: 0.4 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: scope.current,
              start: "top bottom",
              end: "top 30%",
              scrub: true,
            },
          }
        );
      });
    }, scope);

    return () => ctx.revert();
  }, [scope]);
}

/* ---------------------------------------------------------------------- */
/* Scene primitives — all pointer-transparent, positioned by className,    */
/* parallaxed via data-scroll-speed.                                       */
/* ---------------------------------------------------------------------- */

type SceneProps = {
  className?: string;
  speed?: number;
};

/** Outlined sun / ringed circle. */
export const SunOutline = ({ className = "", speed = -0.3 }: SceneProps) => (
  <div data-scroll-speed={speed} className={`pointer-events-none absolute ${className}`} aria-hidden>
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="h-full w-full">
      <circle cx="50" cy="50" r="48" strokeWidth="0.5" />
      <circle cx="50" cy="50" r="33" strokeWidth="0.4" opacity="0.5" />
      <circle cx="50" cy="50" r="18" strokeWidth="0.3" opacity="0.3" />
    </svg>
  </div>
);

/** Soft cloud blob. */
export const Cloud = ({ className = "", speed = -0.35 }: SceneProps) => (
  <div data-scroll-speed={speed} className={`pointer-events-none absolute ${className}`} aria-hidden>
    <svg viewBox="0 0 220 70" fill="currentColor" className="h-full w-full">
      <ellipse cx="60" cy="45" rx="60" ry="22" />
      <ellipse cx="120" cy="35" rx="55" ry="26" />
      <ellipse cx="170" cy="48" rx="48" ry="18" />
    </svg>
  </div>
);

/** Rolling hills / mountain ridge anchored to the bottom. */
export const Ridge = ({
  className = "",
  speed = 0.25,
  jagged = false,
}: SceneProps & { jagged?: boolean }) => (
  <div
    data-scroll-speed={speed}
    className={`pointer-events-none absolute bottom-0 left-[-5%] w-[110%] ${className}`}
    aria-hidden
  >
    <svg
      viewBox="0 0 1440 240"
      preserveAspectRatio="none"
      fill="currentColor"
      className="h-full w-full"
    >
      {jagged ? (
        <path d="M0,240 L0,150 L200,60 L400,160 L620,50 L840,170 L1060,80 L1260,160 L1440,90 L1440,240 Z" />
      ) : (
        <path d="M0,240 L0,160 C240,80 420,180 720,120 C1020,60 1200,170 1440,110 L1440,240 Z" />
      )}
    </svg>
  </div>
);

/** Layered sea waves anchored to the bottom. */
export const Waves = ({ className = "" }: { className?: string }) => (
  <div className={`pointer-events-none absolute inset-x-0 bottom-0 ${className}`} aria-hidden>
    {[
      { speed: 0.12, opacity: 0.08, d: "M0,120 C240,60 480,140 720,90 C960,40 1200,120 1440,70 L1440,200 L0,200 Z" },
      { speed: 0.26, opacity: 0.12, d: "M0,140 C280,90 520,160 760,110 C1000,60 1240,150 1440,100 L1440,200 L0,200 Z" },
      { speed: 0.45, opacity: 0.16, d: "M0,160 C320,120 560,180 800,140 C1040,100 1280,170 1440,130 L1440,200 L0,200 Z" },
    ].map((wave, i) => (
      <div key={i} data-scroll-speed={wave.speed} className="absolute inset-x-[-5%] bottom-0">
        <svg
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          fill="currentColor"
          className="h-32 w-full md:h-44"
          style={{ opacity: wave.opacity }}
        >
          <path d={wave.d} />
        </svg>
      </div>
    ))}
  </div>
);

/** Field of small stars. */
export const Stars = ({ className = "", speed = -0.15 }: SceneProps) => (
  <div data-scroll-speed={speed} className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
    <svg
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      fill="currentColor"
      className="h-full w-full"
    >
      {[
        [90, 120], [310, 60], [540, 190], [780, 100], [990, 50],
        [1170, 170], [1350, 80], [200, 300], [680, 280], [1260, 300],
        [60, 460], [440, 400], [1400, 440], [880, 240], [1080, 400],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2 : 1.2} />
      ))}
    </svg>
  </div>
);

/** Dotted terrain mesh (KPR's wireframe-terrain motif). */
export const DotMesh = ({ className = "", speed = -0.3 }: SceneProps) => (
  <div data-scroll-speed={speed} className={`pointer-events-none absolute ${className}`} aria-hidden>
    <svg viewBox="0 0 360 160" fill="currentColor" className="h-full w-full">
      {Array.from({ length: 12 }).map((_, row) =>
        Array.from({ length: 30 }).map((_, col) => {
          // rounded so SSR and client render byte-identical coordinates
          const wave = Math.round(Math.sin(col * 0.5 + row * 0.8) * 100) / 10;
          return (
            <circle key={`${row}-${col}`} cx={col * 12 + row * 2} cy={row * 12 + wave} r="1" />
          );
        })
      )}
    </svg>
  </div>
);

/** Topographic contour lines. */
export const Contours = ({ className = "", speed = 0.22 }: SceneProps) => (
  <div data-scroll-speed={speed} className={`pointer-events-none absolute ${className}`} aria-hidden>
    <svg viewBox="0 0 400 200" fill="none" stroke="currentColor" className="h-full w-full">
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          strokeWidth="0.6"
          opacity={0.9 - i * 0.15}
          d={`M0,${170 - i * 26} C80,${120 - i * 22} 160,${190 - i * 28} 240,${140 - i * 24} C320,${
            95 - i * 18
          } 380,${160 - i * 26} 400,${130 - i * 22}`}
        />
      ))}
    </svg>
  </div>
);

/** Scattered floating pixel squares. */
export const Pixels = ({ className = "" }: { className?: string }) => (
  <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
    {[
      { left: "12%", top: "22%", size: 8, speed: -0.35 },
      { left: "84%", top: "16%", size: 6, speed: -0.5 },
      { left: "68%", top: "38%", size: 10, speed: -0.25 },
      { left: "28%", top: "62%", size: 6, speed: -0.42 },
      { left: "90%", top: "58%", size: 8, speed: -0.6 },
      { left: "48%", top: "12%", size: 5, speed: -0.3 },
    ].map((px, i) => (
      <span
        key={i}
        data-scroll-speed={px.speed}
        className="absolute bg-current"
        style={{ left: px.left, top: px.top, width: px.size, height: px.size }}
      />
    ))}
  </div>
);

/** Crosshair "+" marks. */
export const CrossMarks = ({ className = "", speed = -0.22 }: SceneProps) => (
  <div data-scroll-speed={speed} className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
    {[
      { left: "22%", top: "18%" },
      { left: "76%", top: "30%" },
      { left: "40%", top: "74%" },
    ].map((mark, i) => (
      <span
        key={i}
        className="absolute font-mono text-sm"
        style={{ left: mark.left, top: mark.top }}
      >
        +
      </span>
    ))}
  </div>
);

/* ---------------------------------------------------------------------- */
/* Weather FX — deterministic pseudo-random placement so SSR and client    */
/* markup match exactly.                                                   */
/* ---------------------------------------------------------------------- */

/** Falling rain streaks. */
export const Rain = ({ className = "", count = 26 }: { className?: string; count?: number }) => (
  <div
    className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    aria-hidden
  >
    {Array.from({ length: count }).map((_, i) => {
      const left = (i * 199) % 100;
      const duration = 0.8 + ((i * 37) % 9) / 10;
      const delay = ((i * 53) % 24) / 10;
      const height = 10 + ((i * 29) % 14);
      const opacity = 0.2 + ((i * 13) % 35) / 100;
      return (
        <span
          key={i}
          className="rain-drop"
          style={{
            left: `${left}%`,
            height: `${height}px`,
            opacity,
            animationDuration: `${duration}s`,
            animationDelay: `-${delay}s`,
          }}
        />
      );
    })}
  </div>
);

/** Drifting snowflakes. */
export const Snow = ({ className = "", count = 22 }: { className?: string; count?: number }) => (
  <div
    className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    aria-hidden
  >
    {Array.from({ length: count }).map((_, i) => {
      const left = (i * 137) % 100;
      const size = 3 + ((i * 17) % 4);
      const fall = 7 + ((i * 41) % 8);
      const sway = 2.5 + ((i * 23) % 3);
      const delay = ((i * 61) % 70) / 10;
      const opacity = 0.35 + ((i * 19) % 45) / 100;
      return (
        <span
          key={i}
          className="snow-flake"
          style={{
            left: `${left}%`,
            width: `${size}px`,
            height: `${size}px`,
            opacity,
            animationDuration: `${fall}s, ${sway}s`,
            animationDelay: `-${delay}s, 0s`,
          }}
        />
      );
    })}
  </div>
);

/** Horizontal wind streaks blowing across. */
export const WindLines = ({ className = "", count = 7 }: { className?: string; count?: number }) => (
  <div
    className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    aria-hidden
  >
    {Array.from({ length: count }).map((_, i) => {
      const top = 8 + ((i * 149) % 84);
      const width = 90 + ((i * 71) % 160);
      const duration = 3.5 + ((i * 31) % 40) / 10;
      const delay = ((i * 47) % 50) / 10;
      const opacity = 0.2 + ((i * 11) % 30) / 100;
      return (
        <span
          key={i}
          className="wind-line"
          style={{
            top: `${top}%`,
            width: `${width}px`,
            opacity,
            animationDuration: `${duration}s`,
            animationDelay: `-${delay}s`,
          }}
        />
      );
    })}
  </div>
);

/** Lightning bolt that flashes every few seconds. */
export const Lightning = ({
  className = "",
  speed = -0.3,
  delay = 0,
}: SceneProps & { delay?: number }) => (
  <div data-scroll-speed={speed} className={`pointer-events-none absolute ${className}`} aria-hidden>
    <svg
      viewBox="0 0 60 120"
      fill="none"
      stroke="currentColor"
      className="lightning-bolt h-full w-full"
      style={{ animationDelay: `${delay}s` }}
      strokeWidth="3"
      strokeLinejoin="round"
    >
      <path d="M38,2 L14,58 L30,58 L20,116 L52,48 L34,48 L48,2 Z" fill="currentColor" />
    </svg>
  </div>
);

/** Rainbow arc in the site palette. */
export const Rainbow = ({ className = "", speed = -0.28 }: SceneProps) => (
  <div data-scroll-speed={speed} className={`pointer-events-none absolute ${className}`} aria-hidden>
    <svg viewBox="0 0 200 100" fill="none" className="h-full w-full" preserveAspectRatio="none">
      {["#d9622e", "#f4c04e", "#c0fb50", "#968adf"].map((color, i) => (
        <path
          key={color}
          d={`M ${8 + i * 8},100 A ${92 - i * 8} ${92 - i * 8} 0 0 1 ${192 - i * 8},100`}
          stroke={color}
          strokeWidth="5"
          opacity="0.4"
        />
      ))}
    </svg>
  </div>
);

/** KPR-style faint panel grid lines across the section. */
export const SectionGrid = () => (
  <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden>
    <div className="absolute left-1/3 top-0 h-full w-px bg-[var(--line)]" />
    <div className="absolute left-2/3 top-0 h-full w-px bg-[var(--line)]" />
  </div>
);

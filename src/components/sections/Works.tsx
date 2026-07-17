"use client";

import { useState } from "react";
import Image from "next/image";
import Sector from "@/components/Sector";
import { projects } from "@/constants/projects";

/** hand-placed node coordinates along the winding course (viewBox 1000×420) */
const NODES: [number, number][] = [
  [55, 350],
  [200, 300],
  [345, 345],
  [490, 290],
  [635, 340],
  [800, 270],
  [700, 160],
  [520, 190],
  [340, 150],
  [170, 95],
];

/** short names for the map labels */
const SHORT: Record<number, string> = {
  1: "Food Analyzer",
  2: "DeskLab",
  3: "Pokedex",
  4: "Tola Web",
  5: "MileApp",
  6: "Happy Farm",
  7: "Magloft",
  8: "Mini-Google",
  9: "Bountie",
  10: "Weathernime",
};

const isLocked = (p: (typeof projects)[number]) => !p.live && !p.github;

/** dotted trail connecting the nodes, Mario-map style */
const PATH_D = NODES.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");

/**
 * GAME_03 — SUPER SHIPPED WORLD. The brightest screen on the console:
 * a sunny sky-blue overworld with parallax hills and clouds, 10 shipped
 * projects as level nodes on a dotted course. Selecting a node opens its
 * level card. Levels without a public build show as locked.
 */
const Works = () => {
  const [selectedId, setSelectedId] = useState(projects[projects.length - 1].id);
  const selected = projects.find((p) => p.id === selectedId) ?? projects[0];
  const locked = isLocked(selected);
  const cleared = projects.filter((p) => !isLocked(p)).length;

  /* sunny-day scenery: sun + two hill ranges at different scroll speeds */
  const backdrop = (
    <div className="seam-clip pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="sun" data-scroll-speed="0.05" />
      <svg
        data-scroll-speed="0.08"
        className="absolute bottom-[-4%] left-[-5%] h-[36%] w-[110%]"
        viewBox="0 0 1440 260"
        preserveAspectRatio="none"
      >
        <path
          d="M0 260 L0 150 Q 180 62 360 140 T 720 128 T 1080 150 T 1440 118 L1440 260 Z"
          fill="#a5e3b8"
          opacity="0.8"
        />
      </svg>
      <svg
        data-scroll-speed="0.16"
        className="absolute bottom-[-5%] left-[-5%] h-[27%] w-[110%]"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0 200 L0 120 Q 240 38 480 108 T 960 98 T 1440 108 L1440 200 Z"
          fill="#5fca82"
        />
        {/* little course bushes */}
        <circle cx="220" cy="118" r="16" fill="#4bb56e" />
        <circle cx="246" cy="122" r="12" fill="#4bb56e" />
        <circle cx="1120" cy="108" r="15" fill="#4bb56e" />
      </svg>
    </div>
  );

  return (
    <Sector
      id="works"
      zone="works"
      zIndex={55}
      status={`[${cleared}/${projects.length} CLEARED]`}
      statusVariant="secondary"
      backdrop={backdrop}
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="font-display text-[clamp(2.6rem,7vw,5.6rem)] text-[var(--ink)]">
          <span data-glitch data-text="WORLD 1" className="glitch glitch--block">
            WORLD <span className="accent-1">1</span>
          </span>
          <span
            data-glitch
            data-glitch-delay="0.14"
            data-text="LEVEL SELECT"
            className="glitch glitch--block md:ml-[6vw]"
          >
            LEVEL SELECT
          </span>
        </h2>
        <p data-reveal className="hud-label hud-label--bare">
          ★ COLLECT THEM ALL <span className="mx-2 opacity-40">{"//"}</span> 10 COURSES
        </p>
      </div>

      {/* ---- the world map (md+) ---- */}
      <div data-reveal className="relative mt-14 hidden aspect-[1000/420] w-full md:block">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1000 420"
          fill="none"
          aria-hidden
        >
          {/* course shadow + dotted trail */}
          <path
            d={PATH_D}
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="8"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d={PATH_D}
            className="map-path"
            stroke="rgba(var(--accent-primary-rgb),0.9)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="26" y="392" fill="var(--accent-primary)" fontSize="13" fontFamily="monospace" fontWeight="600">
            START
          </text>
          <text x="128" y="60" fill="var(--accent-secondary)" fontSize="13" fontFamily="monospace" fontWeight="600">
            GOAL ★
          </text>
        </svg>

        {projects.map((p, i) => {
          const [x, y] = NODES[i];
          const lock = isLocked(p);
          const active = p.id === selectedId;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedId(p.id)}
              onMouseEnter={() => setSelectedId(p.id)}
              className={`lvl-node ${lock ? "lvl-node--locked" : ""} ${active ? "lvl-node--active" : ""}`}
              style={{ left: `${x / 10}%`, top: `${(y / 420) * 100}%` }}
              aria-label={`Level ${i + 1}: ${p.title}${lock ? " (locked)" : ""}`}
              data-cursor-label={lock ? "LOCKED" : "PLAY"}
            >
              <span
                className="lvl-dot"
                style={{ backgroundImage: lock ? undefined : `url(${p.image})` }}
              >
                <span className="lvl-num">{i + 1}</span>
                {lock ? (
                  <span className="lvl-clear" style={{ color: "rgba(18,48,71,0.6)" }} aria-hidden>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17 9V7a5 5 0 0 0-10 0v2H5v13h14V9h-2Zm-8-2a3 3 0 0 1 6 0v2H9V7Z" />
                    </svg>
                  </span>
                ) : (
                  <span className="lvl-clear" aria-hidden>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d="m12 2 2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2l-6.1 3.4 1.4-6.8L2.2 9.1l6.9-.8L12 2Z" />
                    </svg>
                  </span>
                )}
              </span>
              <span className="lvl-label">{SHORT[p.id] ?? p.title}</span>
            </button>
          );
        })}
      </div>

      {/* ---- compact course strip (mobile) ---- */}
      <div data-reveal className="tile-rail -mx-6 mt-10 flex gap-4 overflow-x-auto px-6 pb-4 md:hidden">
        {projects.map((p, i) => {
          const lock = isLocked(p);
          const active = p.id === selectedId;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedId(p.id)}
              className={`lvl-node lvl-node--flow flex-none ${lock ? "lvl-node--locked" : ""} ${active ? "lvl-node--active" : ""}`}
              aria-label={`Level ${i + 1}: ${p.title}`}
            >
              <span
                className="lvl-dot"
                style={{ backgroundImage: lock ? undefined : `url(${p.image})` }}
              >
                <span className="lvl-num">{i + 1}</span>
              </span>
              <span className="lvl-label">{SHORT[p.id] ?? p.title}</span>
            </button>
          );
        })}
      </div>

      {/* ---- level card ---- */}
      <div data-reveal className="mt-8">
        <div
          key={selected.id}
          data-tilt="2.5"
          className="panel lvl-panel-in grid grid-cols-1 gap-0 md:grid-cols-12"
        >
          <div className="relative md:col-span-5">
            <div className="relative aspect-video h-full w-full overflow-hidden bg-[#dff0fb] md:aspect-auto">
              <Image
                src={selected.image}
                alt={selected.title}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className={`object-cover ${locked ? "opacity-40 grayscale" : ""}`}
              />
              {locked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="tag tag--dim bg-[rgba(255,255,255,0.8)]">🔒 PRIVATE BUILD</span>
                </div>
              )}
            </div>
            {!locked && (
              <span className="absolute left-4 top-4 rotate-[-6deg] border-2 border-[var(--accent-secondary)] bg-[rgba(255,255,255,0.85)] px-3 py-1 font-display text-sm tracking-[0.14em] text-[var(--accent-secondary)]">
                CLEARED ★
              </span>
            )}
          </div>

          <div className="flex flex-col justify-between gap-6 p-6 md:col-span-7 md:p-8">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="hud-label">
                  LEVEL {projects.findIndex((p) => p.id === selected.id) + 1}-{selected.id}
                </p>
                <span className={locked ? "tag tag--dim" : "tag tag--2"}>
                  {locked ? "[LOCKED]" : "[CLEARED]"}
                </span>
              </div>
              <h3 className="font-display mt-3 text-3xl text-[var(--ink)] md:text-4xl">
                {selected.title}
              </h3>
              <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-[var(--muted)]">
                {selected.description.replace(/^\/\/\.\.\.\s*/, "").replace(/;$/, ".")}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {selected.tech.map((t) => (
                  <span key={t} className="chip chip--xs">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: "var(--accent-secondary)" }}
                    />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {selected.live && (
                <a
                  href={selected.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-game"
                  data-cursor-label="PLAY"
                >
                  ▶ Play Level
                </a>
              )}
              {selected.github && (
                <a
                  href={selected.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-game btn-game--ghost"
                  data-cursor-label="SOURCE"
                >
                  {"</>"} View Source
                </a>
              )}
              {locked && (
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[var(--faint)]">
                  Client project — playable on request
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Sector>
  );
};

export default Works;

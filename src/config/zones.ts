import type { CSSProperties } from "react";

/**
 * NIGHT CITY ZONE MAP — the single source of truth for every district.
 *
 * One entry drives all three per-zone systems:
 *   1. canvas backdrop     — SectionBackground reads `primaryRgb`/`secondaryRgb`
 *   2. UI accent theming   — SectionScene sets the `--accent-*` custom props
 *   3. companion behaviour — WarpDirector/Companion read `line` + colors
 *
 * The base stays near-black everywhere; only these accents shift per zone.
 */

export type ZoneId = "hero" | "profile" | "runs" | "loadout" | "log" | "comm" | "outro";

export interface Zone {
  id: ZoneId;
  /** district name used in HUD copy / debugging */
  district: string;
  /** primary accent */
  primary: string;
  primaryRgb: string;
  /** secondary accent (hover states, ghosts, counter-glow) */
  secondary: string;
  secondaryRgb: string;
  /**
   * the district's base fill — any CSS `background` value. Deep-tinted
   * gradients by default; swap in an image by layering it over a dark
   * gradient so text stays readable, e.g.
   * `url("/textures/market.webp") center/cover no-repeat, linear-gradient(#0a060e, #0a060e)`
   */
  bg: string;
  /** companion's one-liner on arrival — delivered once per visit */
  line: string;
}

export const ZONES: Record<ZoneId, Zone> = {
  hero: {
    id: "hero",
    district: "ARRIVAL",
    primary: "#4c6fff",
    primaryRgb: "76, 111, 255",
    secondary: "#8a5cf6",
    secondaryRgb: "138, 92, 246",
    bg: "radial-gradient(120% 85% at 50% 0%, #0f1230 0%, #0a0b1c 45%, #070710 100%)",
    line: "Systems online. Follow me.",
  },
  profile: {
    id: "profile",
    district: "DATA DISTRICT",
    primary: "#00e5ff",
    primaryRgb: "0, 229, 255",
    secondary: "#2dd4bf",
    secondaryRgb: "45, 212, 191",
    bg: "linear-gradient(172deg, #071a20 0%, #07121a 52%, #060910 100%)",
    line: "This is who I am, on record.",
  },
  runs: {
    id: "runs",
    district: "MARKET DISTRICT",
    primary: "#ff2e88",
    primaryRgb: "255, 46, 136",
    secondary: "#ff5fa8",
    secondaryRgb: "255, 95, 168",
    /* neon rises from the street — glow pooled at the grid floor */
    bg: "radial-gradient(130% 95% at 50% 100%, #200a18 0%, #130813 50%, #0a060e 100%)",
    line: "Welcome to the Market District — here's what I've shipped.",
  },
  loadout: {
    id: "loadout",
    district: "ENGINEERING DISTRICT",
    primary: "#ff9d3d",
    primaryRgb: "255, 157, 61",
    secondary: "#ffb84d",
    secondaryRgb: "255, 184, 77",
    bg: "linear-gradient(160deg, #181008 0%, #110b08 55%, #0b0709 100%)",
    line: "This is where things get built.",
  },
  log: {
    id: "log",
    district: "ARCHIVE DISTRICT",
    primary: "#39ff88",
    primaryRgb: "57, 255, 136",
    secondary: "#2ecc71",
    secondaryRgb: "46, 204, 113",
    bg: "linear-gradient(180deg, #07180e 0%, #07120a 55%, #05090a 100%)",
    line: "Every mission, logged.",
  },
  comm: {
    id: "comm",
    district: "SIGNAL DISTRICT",
    primary: "#a855f7",
    primaryRgb: "168, 85, 247",
    secondary: "#c084fc",
    secondaryRgb: "192, 132, 252",
    /* signal core — brightest at the pulse-ring origin */
    bg: "radial-gradient(110% 80% at 50% 42%, #170b28 0%, #0f081b 50%, #080711 100%)",
    line: "Open a channel. I'll be listening.",
  },
  outro: {
    id: "outro",
    district: "POWERING DOWN",
    primary: "#9aa7b8",
    primaryRgb: "154, 167, 184",
    secondary: "#5c6675",
    secondaryRgb: "92, 102, 117",
    /* powering down — drains to true black at the bottom */
    bg: "linear-gradient(180deg, #0b0b0e 0%, #08080a 45%, #000000 100%)",
    line: "Connection terminated. Thanks for stopping by.",
  },
};

/** document order — WarpDirector derives jump boundaries from this */
export const ZONE_ORDER: ZoneId[] = ["hero", "profile", "runs", "loadout", "log", "comm", "outro"];

export const zoneIndex = (id: ZoneId) => ZONE_ORDER.indexOf(id);

/**
 * Per-section custom props. Everything inside a SectionScene that says
 * `var(--accent-primary)` / `rgba(var(--accent-primary-rgb), …)` re-themes
 * to the local district automatically.
 */
export function zoneCssVars(id: ZoneId): CSSProperties {
  const z = ZONES[id];
  return {
    "--accent-primary": z.primary,
    "--accent-primary-rgb": z.primaryRgb,
    "--accent-secondary": z.secondary,
    "--accent-secondary-rgb": z.secondaryRgb,
    "--glow-color": `rgba(${z.primaryRgb}, 0.55)`,
  } as CSSProperties;
}

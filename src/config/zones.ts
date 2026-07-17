import type { CSSProperties } from "react";

/**
 * THE CONSOLE LIBRARY — the single source of truth for every "game".
 *
 * Each section of the site is a different game cartridge, styled to its
 * genre's classic UI conventions. One entry drives all four per-zone systems:
 *   1. canvas backdrop     — SectionBackground reads `primaryRgb`/`secondaryRgb`
 *   2. UI accent theming   — SectionScene sets the `--accent-*` custom props
 *   3. load transitions    — LoadDirector reads `loader` copy + palette
 *   4. console home tiles  — ConsoleHome renders the library from this list
 *
 * The base stays near-black everywhere; only the accents shift per game,
 * so the whole thing reads as one console, not six disconnected demos.
 */

export type ZoneId =
  | "home"
  | "hero"
  | "profile"
  | "works"
  | "services"
  | "journey"
  | "contact"
  | "outro";

/** loader flavors — LoadDirector shows a genre-authentic loading screen */
export type LoaderKind = "sys" | "vs" | "save" | "level" | "ops" | "race" | "match" | "coin";

export interface Zone {
  id: ZoneId;
  /** cartridge index stamped on the sector header ("01", "END", …) */
  index: string;
  /** the cartridge's game title */
  game: string;
  /** genre chip — instantly answers "which game is this?" */
  genre: string;
  /** primary accent */
  primary: string;
  primaryRgb: string;
  /** secondary accent (hover states, counter-glow) */
  secondary: string;
  secondaryRgb: string;
  /** the zone's base fill — any CSS `background` value, kept deep and dark */
  bg: string;
  /** loading-screen dressing between zones */
  loader: {
    kind: LoaderKind;
    /** small mono kicker, e.g. "ENTERING TOURNAMENT" */
    kicker: string;
  };
  /** one-line blurb on the console home tile */
  blurb: string;
}

export const ZONES: Record<ZoneId, Zone> = {
  home: {
    id: "home",
    index: "SYS",
    game: "EDWIN.SYS",
    genre: "CONSOLE",
    primary: "#7ea8ff",
    primaryRgb: "126, 168, 255",
    secondary: "#9aa7b8",
    secondaryRgb: "154, 167, 184",
    bg: "radial-gradient(130% 90% at 50% 0%, #0c1020 0%, #090b16 48%, #06070d 100%)",
    loader: { kind: "sys", kicker: "SYSTEM MENU" },
    blurb: "Home screen",
  },
  hero: {
    id: "hero",
    index: "01",
    game: "STREET CODER VI",
    genre: "FIGHTING",
    primary: "#ff2e7e",
    primaryRgb: "255, 46, 126",
    secondary: "#8b5cf6",
    secondaryRgb: "139, 92, 246",
    bg: "radial-gradient(120% 85% at 50% 100%, #200a1c 0%, #120818 50%, #090711 100%)",
    loader: { kind: "vs", kicker: "ENTERING TOURNAMENT" },
    blurb: "Character select — meet Player 1",
  },
  profile: {
    id: "profile",
    index: "02",
    game: "EDWIN QUEST",
    genre: "RPG",
    primary: "#e2b155",
    primaryRgb: "226, 177, 85",
    secondary: "#7d5fff",
    secondaryRgb: "125, 95, 255",
    bg: "linear-gradient(172deg, #16110a 0%, #100d14 52%, #090810 100%)",
    loader: { kind: "save", kicker: "OPENING SAVE FILE" },
    blurb: "Character sheet, stats & equipped gear",
  },
  works: {
    id: "works",
    index: "03",
    game: "SUPER SHIPPED WORLD",
    genre: "PLATFORMER",
    primary: "#3ddc78",
    primaryRgb: "61, 220, 120",
    secondary: "#ffd23f",
    secondaryRgb: "255, 210, 63",
    bg: "radial-gradient(130% 95% at 50% 100%, #08170f 0%, #071009 55%, #05090a 100%)",
    loader: { kind: "level", kicker: "WORLD MAP" },
    blurb: "10 cleared levels — the shipped projects",
  },
  services: {
    id: "services",
    index: "04",
    game: "OPERATION: DEPLOY",
    genre: "FPS",
    primary: "#ff8b2d",
    primaryRgb: "255, 139, 45",
    secondary: "#8fa3b8",
    secondaryRgb: "143, 163, 184",
    bg: "linear-gradient(160deg, #15100a 0%, #0e0d0e 55%, #0a090b 100%)",
    loader: { kind: "ops", kicker: "PREPARING LOADOUT" },
    blurb: "Pick a loadout — what I can build for you",
  },
  journey: {
    id: "journey",
    index: "05",
    game: "CAREER DRIVE GT",
    genre: "RACING",
    primary: "#ff3b47",
    primaryRgb: "255, 59, 71",
    secondary: "#dfe6ee",
    secondaryRgb: "223, 230, 238",
    bg: "linear-gradient(180deg, #170a0d 0%, #100a0d 50%, #08070a 100%)",
    loader: { kind: "race", kicker: "STARTING GRID" },
    blurb: "Career mode — 5 seasons on track",
  },
  contact: {
    id: "contact",
    index: "06",
    game: "CO-OP MODE",
    genre: "MULTIPLAYER",
    primary: "#4d8dff",
    primaryRgb: "77, 141, 255",
    secondary: "#a855f7",
    secondaryRgb: "168, 85, 247",
    bg: "radial-gradient(110% 80% at 50% 42%, #0c1226 0%, #0a0d1c 50%, #070810 100%)",
    loader: { kind: "match", kicker: "SEARCHING FOR MATCH" },
    blurb: "Join the lobby — let's play together",
  },
  outro: {
    id: "outro",
    index: "END",
    game: "GAME OVER",
    genre: "ARCADE",
    primary: "#3dff7c",
    primaryRgb: "61, 255, 124",
    secondary: "#ffd23f",
    secondaryRgb: "255, 210, 63",
    bg: "linear-gradient(180deg, #0a0d0a 0%, #070907 45%, #000000 100%)",
    loader: { kind: "coin", kicker: "CONTINUE?" },
    blurb: "Insert coin to continue",
  },
};

/** document order — LoadDirector derives boot boundaries from this */
export const ZONE_ORDER: ZoneId[] = [
  "home",
  "hero",
  "profile",
  "works",
  "services",
  "journey",
  "contact",
  "outro",
];

/** the playable library shown on the console home rail (home itself excluded) */
export const GAME_ORDER: ZoneId[] = ZONE_ORDER.slice(1);

export const zoneIndex = (id: ZoneId) => ZONE_ORDER.indexOf(id);

/**
 * Per-section custom props. Everything inside a SectionScene that says
 * `var(--accent-primary)` / `rgba(var(--accent-primary-rgb), …)` re-themes
 * to the local game automatically.
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

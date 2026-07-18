import type { CSSProperties } from "react";

/**
 * THE CONSOLE LIBRARY — the single source of truth for every "game".
 *
 * Each section of the site is a different game cartridge with its OWN
 * real color identity — some genuinely light and bright (platformer,
 * racing), some deliberately dark (fighting arena, tactical FPS). One
 * entry drives every per-zone system:
 *   1. scene backdrop      — SectionBackground reads the palette
 *   2. UI theming          — SectionScene sets accent + scheme tokens
 *   3. load transitions    — LoadDirector reads `loader` copy + palette
 *   4. console home tiles  — ConsoleHome renders the library from this
 *
 * `scheme` flips the entire ink/surface token set: "light" zones get
 * dark text on bright fills, "dark" zones get bright text on deep fills.
 * The console shell (nav/HUD) is the only constant identity.
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

export type Scheme = "dark" | "light";

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
  /** light = dark ink on bright fills; dark = bright ink on deep fills */
  scheme: Scheme;
  /** primary accent */
  primary: string;
  primaryRgb: string;
  /** secondary accent (hover states, counter-glow) */
  secondary: string;
  secondaryRgb: string;
  /** optional ink override for light zones that want a tinted dark ink */
  ink?: string;
  inkRgb?: string;
  /** the zone's base fill — any CSS `background` value */
  bg: string;
  /** loading-screen dressing between zones */
  loader: {
    kind: LoaderKind;
    /** genre kicker, e.g. "WORLD MAP" */
    kicker: string;
  };
  /** one-line blurb on the console home tile */
  blurb: string;
  /** plain-language translation for non-gamers (subtitles, aria-labels) */
  plain: string;
}

export const ZONES: Record<ZoneId, Zone> = {
  home: {
    id: "home",
    index: "SYS",
    game: "EDWIN.SYS",
    genre: "CONSOLE",
    scheme: "dark",
    primary: "#7ea8ff",
    primaryRgb: "126, 168, 255",
    secondary: "#9aa7b8",
    secondaryRgb: "154, 167, 184",
    bg: "radial-gradient(130% 90% at 50% 0%, #0c1020 0%, #090b16 48%, #06070d 100%)",
    loader: { kind: "sys", kicker: "SYSTEM MENU" },
    blurb: "Home screen",
    plain: "Home",
  },
  hero: {
    id: "hero",
    index: "01",
    game: "STREET CODER VI",
    genre: "FIGHTING",
    scheme: "dark",
    primary: "#ff3d33",
    primaryRgb: "255, 61, 51",
    secondary: "#ffb020",
    secondaryRgb: "255, 176, 32",
    bg: "radial-gradient(120% 90% at 50% 100%, #331110 0%, #1d0b0d 52%, #100709 100%)",
    loader: { kind: "vs", kicker: "ENTERING TOURNAMENT" },
    blurb: "Character select — meet Player 1",
    plain: "About me — introduction",
  },
  profile: {
    id: "profile",
    index: "02",
    game: "EDWIN QUEST",
    genre: "RPG",
    scheme: "dark",
    primary: "#f0b43c",
    primaryRgb: "240, 180, 60",
    secondary: "#7d9bff",
    secondaryRgb: "125, 155, 255",
    bg: "linear-gradient(170deg, #1d2b63 0%, #16204d 48%, #0e142f 100%)",
    loader: { kind: "save", kicker: "OPENING SAVE FILE" },
    blurb: "Character sheet, stats & equipped gear",
    plain: "Skills & experience summary",
  },
  works: {
    id: "works",
    index: "03",
    game: "SUPER SHIPPED WORLD",
    genre: "PLATFORMER",
    scheme: "light",
    primary: "#f97316",
    primaryRgb: "249, 115, 22",
    secondary: "#1fa84f",
    secondaryRgb: "31, 168, 79",
    ink: "#123047",
    inkRgb: "18, 48, 71",
    bg: "linear-gradient(180deg, #6cc4f7 0%, #a4dcfb 48%, #dbf1fe 100%)",
    loader: { kind: "level", kicker: "WORLD MAP" },
    blurb: "10 cleared levels — the shipped projects",
    plain: "Portfolio — my projects",
  },
  services: {
    id: "services",
    index: "04",
    game: "OPERATION: DEPLOY",
    genre: "FPS",
    scheme: "dark",
    primary: "#ff8b2d",
    primaryRgb: "255, 139, 45",
    secondary: "#a9b388",
    secondaryRgb: "169, 179, 136",
    bg: "linear-gradient(160deg, #191c1e 0%, #121415 55%, #0c0e0f 100%)",
    loader: { kind: "ops", kicker: "PREPARING LOADOUT" },
    blurb: "Pick a loadout — what I can build for you",
    plain: "Services I offer",
  },
  journey: {
    id: "journey",
    index: "05",
    game: "CAREER DRIVE GT",
    genre: "RACING",
    scheme: "light",
    primary: "#e10600",
    primaryRgb: "225, 6, 0",
    secondary: "#16181d",
    secondaryRgb: "22, 24, 29",
    ink: "#14161b",
    inkRgb: "20, 22, 27",
    bg: "linear-gradient(180deg, #f6f8fb 0%, #eaeef4 52%, #dbe2ea 100%)",
    loader: { kind: "race", kicker: "STARTING GRID" },
    blurb: "Career mode — 5 seasons on track",
    plain: "Work experience timeline",
  },
  contact: {
    id: "contact",
    index: "06",
    game: "CO-OP MODE",
    genre: "MULTIPLAYER",
    scheme: "dark",
    primary: "#8be2ff",
    primaryRgb: "139, 226, 255",
    secondary: "#ff8ae0",
    secondaryRgb: "255, 138, 224",
    bg: "linear-gradient(150deg, #2b50e0 0%, #5f3bec 48%, #8f2ddb 100%)",
    loader: { kind: "match", kicker: "SEARCHING FOR MATCH" },
    blurb: "Join the lobby — let's play together",
    plain: "Contact me",
  },
  outro: {
    id: "outro",
    index: "END",
    game: "GAME OVER",
    genre: "ARCADE",
    scheme: "dark",
    primary: "#3dff7c",
    primaryRgb: "61, 255, 124",
    secondary: "#c9a8ff",
    secondaryRgb: "201, 168, 255",
    bg: "linear-gradient(180deg, #1c1033 0%, #130a24 45%, #05030a 100%)",
    loader: { kind: "coin", kicker: "CONTINUE?" },
    blurb: "Insert coin to continue",
    plain: "Thanks for visiting — let's work together",
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

/** shared ink/surface token bundles, flipped by zone scheme */
const SCHEMES = {
  dark: {
    ink: "#eef2f7",
    inkRgb: "238, 242, 247",
    surfaceHi: "22, 26, 36",
    surfaceLo: "11, 13, 19",
    mutedA: 0.6,
    faintA: 0.34,
    lineA: 0.14,
  },
  light: {
    ink: "#16202c",
    inkRgb: "22, 32, 44",
    surfaceHi: "255, 255, 255",
    surfaceLo: "238, 243, 249",
    mutedA: 0.68,
    faintA: 0.46,
    lineA: 0.2,
  },
} as const;

/**
 * Per-section custom props. Everything inside a SectionScene that reads
 * `var(--ink)` / `var(--accent-primary)` / `rgba(var(--ink-rgb), …)` /
 * `rgba(var(--surface-hi), …)` re-themes to the local game automatically —
 * including full light/dark flips.
 */
export function zoneCssVars(id: ZoneId): CSSProperties {
  const z = ZONES[id];
  const s = SCHEMES[z.scheme];
  const ink = z.ink ?? s.ink;
  const inkRgb = z.inkRgb ?? s.inkRgb;
  return {
    "--accent-primary": z.primary,
    "--accent-primary-rgb": z.primaryRgb,
    "--accent-secondary": z.secondary,
    "--accent-secondary-rgb": z.secondaryRgb,
    "--glow-color": `rgba(${z.primaryRgb}, ${z.scheme === "light" ? 0.3 : 0.55})`,
    "--ink": ink,
    "--ink-rgb": inkRgb,
    "--muted": `rgba(${inkRgb}, ${s.mutedA})`,
    "--faint": `rgba(${inkRgb}, ${s.faintA})`,
    "--line": `rgba(${inkRgb}, ${s.lineA})`,
    "--line-soft": `rgba(${inkRgb}, ${s.lineA * 0.55})`,
    "--line-accent": `rgba(${z.primaryRgb}, 0.3)`,
    "--surface-hi": s.surfaceHi,
    "--surface-lo": s.surfaceLo,
  } as CSSProperties;
}

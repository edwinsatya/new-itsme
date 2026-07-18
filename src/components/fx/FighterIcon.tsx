/**
 * Original fighter portraits for the STREET CODER VI roster — drawn in
 * code (real fighting-game art is copyrighted, so these are ours).
 * Flat duotone busts: dark silhouette + one accent per fighter, white
 * eye slits — reads like a select-screen grid at any size.
 */

export type FighterId = "E" | "FE" | "BE" | "DB" | "AI" | "OPS" | "UI" | "?";

/** each fighter's accent color (icon + slot tint) */
export const FIGHTER_COLORS: Record<FighterId, { hex: string; rgb: string }> = {
  E: { hex: "#ff3d33", rgb: "255, 61, 51" },
  FE: { hex: "#ff8b2d", rgb: "255, 139, 45" },
  BE: { hex: "#e6392f", rgb: "230, 57, 47" },
  DB: { hex: "#f0b43c", rgb: "240, 180, 60" },
  AI: { hex: "#c9a8ff", rgb: "201, 168, 255" },
  OPS: { hex: "#ff5546", rgb: "255, 85, 70" },
  UI: { hex: "#ff8ae0", rgb: "255, 138, 224" },
  "?": { hex: "#8a8f9a", rgb: "138, 143, 154" },
};

const DARK = "#1c0e10";
const DARK2 = "#2b1517";
const EYE = "#fff6ec";

/** shared shoulders */
const Shoulders = ({ fill = DARK2 }: { fill?: string }) => (
  <path d="M6 64 Q9 46 24 44 L40 44 Q55 46 58 64 Z" fill={fill} />
);

const FighterIcon = ({ id, size = 36 }: { id: FighterId; size?: number }) => {
  const c = FIGHTER_COLORS[id].hex;
  const common = { width: size, height: size, viewBox: "0 0 64 64", "aria-hidden": true } as const;

  switch (id) {
    case "E": // EDWIN — headband warrior
      return (
        <svg {...common}>
          <Shoulders />
          <circle cx="32" cy="26" r="16" fill={DARK} />
          <rect x="15" y="18" width="34" height="7" rx="2" fill={c} />
          <path d="M49 18 L60 14 L56 24 Z" fill={c} />
          <rect x="23" y="30" width="7" height="3" rx="1" fill={EYE} />
          <rect x="34" y="30" width="7" height="3" rx="1" fill={EYE} />
          <rect x="24" y="44" width="16" height="3" fill={c} />
        </svg>
      );
    case "FE": // PIXEL BRAWLER — ninja mask
      return (
        <svg {...common}>
          <Shoulders />
          <path d="M32 8 Q48 10 48 28 Q48 42 32 44 Q16 42 16 28 Q16 10 32 8 Z" fill={DARK} />
          <rect x="18" y="26" width="28" height="9" rx="3" fill={DARK2} />
          <path d="M22 30 L29 28 L29 32 L22 33 Z" fill={EYE} />
          <path d="M42 30 L35 28 L35 32 L42 33 Z" fill={EYE} />
          <rect x="26" y="14" width="12" height="4" rx="1" fill={c} />
          <path d="M46 24 L58 20 L54 30 Z" fill={c} />
        </svg>
      );
    case "BE": // API CRUSHER — mohawk bruiser
      return (
        <svg {...common}>
          <Shoulders />
          <rect x="17" y="14" width="30" height="30" rx="9" fill={DARK} />
          <path d="M28 14 L30 4 L34 4 L36 14 Z" fill={c} />
          <rect x="23" y="27" width="6" height="3" fill={EYE} />
          <rect x="35" y="27" width="6" height="3" fill={EYE} />
          <rect x="26" y="37" width="12" height="2.5" fill={DARK2} />
          <rect x="14" y="48" width="8" height="8" rx="2" fill={c} />
          <rect x="42" y="48" width="8" height="8" rx="2" fill={c} />
        </svg>
      );
    case "DB": // QUERY MASTER — luchador mask
      return (
        <svg {...common}>
          <Shoulders />
          <circle cx="32" cy="27" r="16" fill={c} />
          <path d="M24 24 L30 28 L24 32 Z" fill={DARK} />
          <path d="M40 24 L34 28 L40 32 Z" fill={DARK} />
          <path d="M27 37 Q32 41 37 37 L37 40 Q32 44 27 40 Z" fill={DARK} />
          <path d="M32 11 L35 18 L29 18 Z" fill={DARK} />
        </svg>
      );
    case "AI": // PROMPT SAGE — hooded, third eye
      return (
        <svg {...common}>
          <Shoulders />
          <path d="M32 6 Q52 12 50 44 L14 44 Q12 12 32 6 Z" fill={DARK} />
          <path d="M32 10 Q46 15 45 40 L19 40 Q18 15 32 10 Z" fill={DARK2} />
          <circle cx="32" cy="20" r="3.2" fill={c} />
          <rect x="24" y="30" width="6" height="2.5" rx="1" fill={EYE} opacity="0.75" />
          <rect x="34" y="30" width="6" height="2.5" rx="1" fill={EYE} opacity="0.75" />
        </svg>
      );
    case "OPS": // DEPLOY DEMON — oni horns + grin
      return (
        <svg {...common}>
          <Shoulders />
          <path d="M18 16 L14 4 L24 12 Z" fill={c} />
          <path d="M46 16 L50 4 L40 12 Z" fill={c} />
          <circle cx="32" cy="28" r="16" fill={DARK} />
          <path d="M22 27 L29 24 L29 28 Z" fill={c} />
          <path d="M42 27 L35 24 L35 28 Z" fill={c} />
          <rect x="24" y="34" width="16" height="5" rx="1" fill={EYE} />
          <path d="M27 34 v5 M31 34 v5 M35 34 v5" stroke={DARK} strokeWidth="1.6" />
        </svg>
      );
    case "UI": // UX ASSASSIN — sleek visor
      return (
        <svg {...common}>
          <Shoulders />
          <path d="M32 8 Q49 12 47 44 L17 44 Q15 12 32 8 Z" fill={DARK} />
          <rect x="19" y="26" width="26" height="5" rx="2.5" fill={c} />
          <rect x="19" y="26" width="10" height="5" rx="2.5" fill={EYE} opacity="0.85" />
        </svg>
      );
    default: // locked
      return (
        <svg {...common}>
          <Shoulders fill="rgba(138,143,154,0.25)" />
          <circle cx="32" cy="26" r="15" fill="rgba(138,143,154,0.25)" />
          <text
            x="32"
            y="33"
            textAnchor="middle"
            fontSize="18"
            fontFamily="monospace"
            fill="rgba(238,242,247,0.5)"
          >
            ?
          </text>
        </svg>
      );
  }
};

export default FighterIcon;

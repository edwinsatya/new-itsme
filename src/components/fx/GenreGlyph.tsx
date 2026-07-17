import type { ZoneId } from "@/config/zones";

/**
 * One iconographic mark per genre — clean geometric strokes, shared
 * line-weight, so the library reads as one design system. Used on the
 * console home tiles (large) and anywhere a game needs its sigil.
 */
const GenreGlyph = ({ zone, size = 64 }: { zone: ZoneId; size?: number }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 64 64",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    "aria-hidden": true,
  } as const;

  switch (zone) {
    case "hero": // fighting — clashing strike slashes
      return (
        <svg {...common}>
          <path d="M10 14 L38 42 M28 42 L18 52" strokeWidth="3" />
          <path d="M54 14 L26 42 M36 42 L46 52" strokeWidth="3" opacity="0.55" />
          <circle cx="32" cy="32" r="26" opacity="0.25" />
        </svg>
      );
    case "profile": // RPG — gem in a ring
      return (
        <svg {...common}>
          <path d="M32 10 L50 28 L32 54 L14 28 Z" strokeWidth="2.4" />
          <path d="M14 28 H50 M32 10 L24 28 L32 54 M32 10 L40 28 L32 54" opacity="0.5" />
        </svg>
      );
    case "works": // platformer — course flag on a hill
      return (
        <svg {...common}>
          <path d="M24 54 V12" strokeWidth="2.6" />
          <path d="M24 14 L46 20 L24 28" fill="currentColor" fillOpacity="0.25" />
          <path d="M8 54 Q20 42 32 54 T56 54" opacity="0.5" />
        </svg>
      );
    case "services": // FPS — reticle
      return (
        <svg {...common}>
          <circle cx="32" cy="32" r="17" strokeWidth="2.4" />
          <path d="M32 6 V18 M32 46 V58 M6 32 H18 M46 32 H58" strokeWidth="2.4" />
          <circle cx="32" cy="32" r="2.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "journey": // racing — speedometer gauge
      return (
        <svg {...common}>
          <path d="M10 44 A24 24 0 1 1 54 44" strokeWidth="2.6" />
          <path d="M32 44 L45 26" strokeWidth="3" />
          <circle cx="32" cy="44" r="3" fill="currentColor" stroke="none" />
          <path d="M14 52 H50" opacity="0.5" />
        </svg>
      );
    case "contact": // multiplayer — two linked players
      return (
        <svg {...common}>
          <circle cx="22" cy="24" r="7" strokeWidth="2.4" />
          <path d="M10 48 Q22 36 34 48" strokeWidth="2.4" />
          <circle cx="44" cy="22" r="5" opacity="0.55" />
          <path d="M35 42 Q44 33 53 42" opacity="0.55" />
          <path d="M30 26 L38 24" opacity="0.4" strokeDasharray="2 3" />
        </svg>
      );
    case "outro": // arcade — joystick
      return (
        <svg {...common}>
          <circle cx="32" cy="18" r="8" strokeWidth="2.4" />
          <path d="M32 26 V40" strokeWidth="2.6" />
          <path d="M16 40 H48 L52 54 H12 Z" strokeWidth="2.4" />
          <circle cx="42" cy="47" r="2" fill="currentColor" stroke="none" />
        </svg>
      );
    default: // console mark
      return (
        <svg {...common}>
          <rect x="12" y="12" width="17" height="17" />
          <rect x="35" y="12" width="17" height="17" opacity="0.55" />
          <rect x="12" y="35" width="17" height="17" opacity="0.55" />
          <rect x="35" y="35" width="17" height="17" />
        </svg>
      );
  }
};

export default GenreGlyph;

"use client";

import type { ReactNode } from "react";
import { useRevealScope } from "@/hooks/useRevealScope";
import SectionScene from "@/components/fx/SectionScene";
import GenreGlyph from "@/components/fx/GenreGlyph";
import { ZONES, type ZoneId } from "@/config/zones";

type SectorProps = {
  id: string;
  status?: string;
  statusVariant?: "primary" | "secondary" | "dim";
  /** last sector: no angled cut at the bottom */
  flat?: boolean;
  /** tucks this sector under the previous one's angled seam */
  overlap?: boolean;
  /** which game cartridge this sector is (drives banner, palette) */
  zone: ZoneId;
  zIndex?: number;
  /** scenery painted between the fill and the canvas (parallax layers) */
  backdrop?: ReactNode;
  children: ReactNode;
};

const TAG_VARIANT = {
  primary: "tag",
  secondary: "tag tag--2",
  dim: "tag tag--dim",
} as const;

/**
 * Shared "game screen" shell: SectionScene (game palette + scheme + scene
 * canvas) plus a boot band on entry and the CARTRIDGE BANNER — a colored
 * game label with glyph, index, title, and genre, worn in the game's own
 * gradient. Wires reveal grammar + depth layers for everything inside.
 */
const Sector = ({
  id,
  status,
  statusVariant = "primary",
  flat = false,
  overlap = true,
  zone,
  zIndex = 10,
  backdrop,
  children,
}: SectorProps) => {
  const scope = useRevealScope<HTMLElement>();
  const game = ZONES[zone];

  return (
    <SectionScene
      zone={zone}
      id={id}
      ref={scope}
      zIndex={zIndex}
      flat={flat}
      overlap={overlap}
      backdrop={backdrop}
    >
      <div className="seam-band" aria-hidden />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div data-reveal className="mb-12 flex flex-wrap items-center justify-between gap-3">
          <div className="cart-banner">
            <span className="cart-banner-glyph">
              <GenreGlyph zone={zone} size={20} />
            </span>
            <span className="cart-banner-index">GAME_{game.index}</span>
            <span className="cart-banner-title">{game.game}</span>
            <span className="cart-banner-genre">{game.genre}</span>
          </div>
          {status && <span className={TAG_VARIANT[statusVariant]}>{status}</span>}
        </div>
        {children}
      </div>
    </SectionScene>
  );
};

export default Sector;

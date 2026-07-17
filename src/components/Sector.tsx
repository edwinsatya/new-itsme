"use client";

import type { ReactNode } from "react";
import { useRevealScope } from "@/hooks/useRevealScope";
import SectionScene from "@/components/fx/SectionScene";
import { ZONES, type ZoneId } from "@/config/zones";

type SectorProps = {
  id: string;
  status?: string;
  statusVariant?: "primary" | "secondary" | "dim";
  /** last sector: no angled cut at the bottom */
  flat?: boolean;
  /** tucks this sector under the previous one's angled seam */
  overlap?: boolean;
  /** which game cartridge this sector is (drives title, genre, palette) */
  zone: ZoneId;
  zIndex?: number;
  children: ReactNode;
};

const TAG_VARIANT = {
  primary: "tag",
  secondary: "tag tag--2",
  dim: "tag tag--dim",
} as const;

/**
 * Shared "game screen" shell: SectionScene (game accents + fill + ambient
 * canvas) plus a boot band on entry and the cartridge title bar — GAME_XX,
 * title, and a genre chip so every section answers "which game is this?"
 * within the header row. Wires the reveal grammar for everything inside.
 */
const Sector = ({
  id,
  status,
  statusVariant = "primary",
  flat = false,
  overlap = true,
  zone,
  zIndex = 10,
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
    >
      <div className="seam-band" aria-hidden />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div data-reveal className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="hud-label">
            GAME_{game.index} <span className="mx-1 opacity-50">{"//"}</span> {game.game}
          </p>
          <div className="flex items-center gap-3">
            <span className="tag tag--dim">{game.genre}</span>
            {status && <span className={TAG_VARIANT[statusVariant]}>{status}</span>}
          </div>
        </div>
        <div data-reveal>
          <div data-ping className="divider wipe-x mb-14" />
        </div>
        {children}
      </div>
    </SectionScene>
  );
};

export default Sector;

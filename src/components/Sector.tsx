"use client";

import type { ReactNode } from "react";
import { useRevealScope } from "@/hooks/useRevealScope";
import SectionScene from "@/components/fx/SectionScene";
import type { ZoneId } from "@/config/zones";

type SectorProps = {
  id: string;
  index: string;
  name: string;
  /** JP signage accent shown at the header's right edge */
  jp?: string;
  status?: string;
  statusVariant?: "cyan" | "magenta" | "dim";
  /** last sector: no diagonal cut at the bottom */
  flat?: boolean;
  /** tucks this sector under the previous one's diagonal seam */
  overlap?: boolean;
  /** which district of the city this sector lives in */
  zone: ZoneId;
  zIndex?: number;
  children: ReactNode;
};

const TAG_VARIANT = {
  cyan: "tag",
  magenta: "tag tag--m",
  dim: "tag tag--dim",
} as const;

/**
 * Shared "district" shell: SectionScene (zone accents + fill + ambient
 * canvas) plus a signal-cut band on entry and the SECTOR_XX header row.
 * Wires the reveal grammar for everything inside via useRevealScope.
 */
const Sector = ({
  id,
  index,
  name,
  jp,
  status,
  statusVariant = "cyan",
  flat = false,
  overlap = true,
  zone,
  zIndex = 10,
  children,
}: SectorProps) => {
  const scope = useRevealScope<HTMLElement>();

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
            SECTOR_{index} <span className="mx-1 opacity-50">{"//"}</span> {name}
          </p>
          <div className="flex items-center gap-4">
            {jp && (
              <span className="hidden font-jp text-sm text-[var(--faint)] sm:inline" aria-hidden>
                {jp}
              </span>
            )}
            {status && <span className={TAG_VARIANT[statusVariant]}>{status}</span>}
          </div>
        </div>
        <div data-reveal className="chrome-line mb-14" />
        {children}
      </div>
    </SectionScene>
  );
};

export default Sector;

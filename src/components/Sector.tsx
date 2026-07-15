"use client";

import type { ReactNode } from "react";
import { useRevealScope } from "@/hooks/useRevealScope";
import SectionBackground, { type BackgroundVariant } from "@/components/fx/SectionBackground";

type SectorProps = {
  id: string;
  index: string;
  name: string;
  /** JP signage accent shown at the header's right edge */
  jp?: string;
  status?: string;
  statusVariant?: "cyan" | "magenta" | "dim";
  /** slightly purple-tinted background for alternating depth */
  alt?: boolean;
  /** last sector: no diagonal cut at the bottom */
  flat?: boolean;
  /** tucks this sector under the previous one's diagonal seam */
  overlap?: boolean;
  /** ambient animated backdrop for this zone of the network */
  bg?: BackgroundVariant;
  zIndex?: number;
  children: ReactNode;
};

const TAG_VARIANT = {
  cyan: "tag",
  magenta: "tag tag--m",
  dim: "tag tag--dim",
} as const;

/**
 * Shared "district" shell: diagonal-clipped background with a neon seam,
 * a signal-cut band on entry, and the SECTOR_XX header row. Wires the
 * reveal grammar for everything inside via useRevealScope.
 */
const Sector = ({
  id,
  index,
  name,
  jp,
  status,
  statusVariant = "cyan",
  alt = false,
  flat = false,
  overlap = true,
  bg,
  zIndex = 10,
  children,
}: SectorProps) => {
  const scope = useRevealScope<HTMLElement>();

  return (
    <section
      id={id}
      ref={scope}
      className={`sector ${flat ? "sector--flat" : ""}`}
      style={{ zIndex, marginTop: overlap ? "-4rem" : undefined }}
    >
      <div className="sector-bg-edge" aria-hidden />
      <div
        className="sector-bg"
        aria-hidden
        style={{ background: alt ? "var(--bg-alt)" : "var(--bg)" }}
      />
      {bg && <SectionBackground variant={bg} />}
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
    </section>
  );
};

export default Sector;

"use client";

import type { CSSProperties, ReactNode, Ref } from "react";
import { ZONES, zoneCssVars, type ZoneId } from "@/config/zones";
import SectionBackground from "@/components/fx/SectionBackground";

type SectionSceneProps = {
  /** which game cartridge this scene renders (src/config/zones.ts) */
  zone: ZoneId;
  as?: "section" | "footer";
  id?: string;
  className?: string;
  style?: CSSProperties;
  zIndex?: number;
  /** tucks this scene under the previous one's angled seam */
  overlap?: boolean;
  /** last scene: no angled cut at the bottom */
  flat?: boolean;
  /** switch off the ambient canvas (rare) */
  animate?: boolean;
  /** extra scenery painted between the fill and the canvas (parallax layers) */
  backdrop?: ReactNode;
  ref?: Ref<HTMLElement>;
  children: ReactNode;
};

/**
 * The zone shell every section lives in — one system, eight games.
 * From a single config entry it:
 *   1. scopes the accent + full light/dark scheme tokens (`data-scheme`)
 *   2. paints the game's own fill (sky blue, white circuit, royal blue…)
 *   3. mounts the game's animated scene canvas
 * LoadDirector finds these via `data-zone` to drive cartridge loads.
 */
const SectionScene = ({
  zone,
  as: Tag = "section",
  id,
  className = "",
  style,
  zIndex,
  overlap = false,
  flat = false,
  animate = true,
  backdrop,
  ref,
  children,
}: SectionSceneProps) => (
  <Tag
    id={id}
    ref={ref}
    data-zone={zone}
    data-scheme={ZONES[zone].scheme}
    className={`sector ${flat ? "sector--flat" : ""} ${className}`}
    style={{
      zIndex,
      marginTop: overlap ? "-4rem" : undefined,
      color: "var(--ink)",
      ...zoneCssVars(zone),
      ...style,
    }}
  >
    <div className="sector-bg-edge" aria-hidden />
    <div className="sector-bg" aria-hidden style={{ background: ZONES[zone].bg }} />
    {backdrop}
    {animate && <SectionBackground variant={zone} />}
    {children}
  </Tag>
);

export default SectionScene;

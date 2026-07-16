"use client";

import type { CSSProperties, ReactNode, Ref } from "react";
import { ZONES, zoneCssVars, type ZoneId } from "@/config/zones";
import SectionBackground from "@/components/fx/SectionBackground";

type SectionSceneProps = {
  /** which district of the city this scene renders (src/config/zones.ts) */
  zone: ZoneId;
  as?: "section" | "footer";
  id?: string;
  className?: string;
  style?: CSSProperties;
  zIndex?: number;
  /** tucks this scene under the previous one's diagonal seam */
  overlap?: boolean;
  /** last scene: no diagonal cut at the bottom */
  flat?: boolean;
  /** switch off the ambient canvas (rare) */
  animate?: boolean;
  /** extra scenery painted between the fill and the canvas (hero skyline) */
  backdrop?: ReactNode;
  ref?: Ref<HTMLElement>;
  children: ReactNode;
};

/**
 * The zone shell every section lives in — one system, seven parameter sets.
 * From a single config entry it:
 *   1. scopes the `--accent-*` custom props so all UI inside re-themes
 *   2. paints the district's own deep-tinted fill behind the diagonal seam
 *   3. mounts the zone's ambient canvas backdrop
 * WarpDirector finds these via `data-zone` to drive jumps + the companion.
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
    className={`sector ${flat ? "sector--flat" : ""} ${className}`}
    style={{
      zIndex,
      marginTop: overlap ? "-4rem" : undefined,
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

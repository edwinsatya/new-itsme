"use client";

import { Code2, Layers, Cpu } from "lucide-react";
import Sector from "@/components/Sector";
import { services } from "@/constants/profile";

const SLOT_META = [
  { icon: Code2, slot: "PRIMARY WEAPON", cls: "AR — PRECISION" },
  { icon: Layers, slot: "SECONDARY", cls: "SIDEARM — VERSATILE" },
  { icon: Cpu, slot: "FIELD UPGRADE", cls: "TACTICAL — EXPERIMENTAL" },
];

/**
 * GAME_04 — OPERATION: DEPLOY. A shooter's gunsmith/loadout menu:
 * three equippable service slots, each with its feature list attached
 * as perk mods. Sharp panels, sliding EQUIPPED banner on hover.
 */
const Loadout = () => (
  <Sector id="services" zone="services" zIndex={50} status="[ARMORY OPEN]">
    <div className="flex flex-wrap items-end justify-between gap-6">
      <h2 className="font-display text-[clamp(2.6rem,7vw,5.6rem)] text-[var(--ink)]">
        <span data-glitch data-text="SELECT" className="glitch glitch--block">
          SELECT
        </span>
        <span
          data-glitch
          data-glitch-delay="0.14"
          data-text="LOADOUT"
          className="glitch glitch--block md:ml-[6vw]"
        >
          <span className="accent-1">LOADOUT</span>
        </span>
      </h2>
      <p data-reveal className="hud-label hud-label--bare">
        CREDITS: ∞ <span className="mx-2 opacity-40">{"//"}</span> ALL SLOTS UNLOCKED
      </p>
    </div>

    <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
      {services.map((service, i) => {
        const meta = SLOT_META[i];
        const Icon = meta.icon;
        return (
          <article
            key={service.index}
            data-reveal
            data-reveal-delay={String(i * 0.1)}
            className="ops-slot flex flex-col p-7"
            data-cursor-label="EQUIP"
          >
            <span className="ops-equip">Equipped</span>

            <div className="flex items-center justify-between">
              <p className="font-mono text-[0.56rem] uppercase tracking-[0.26em] text-[var(--accent-primary)]">
                {meta.slot}
              </p>
              <span className="font-display text-2xl text-[rgba(238,242,247,0.16)]">
                {service.index}
              </span>
            </div>

            <div className="mt-6 flex h-16 w-16 items-center justify-center border border-[rgba(var(--accent-primary-rgb),0.35)] bg-[rgba(var(--accent-primary-rgb),0.06)]">
              <Icon className="h-7 w-7 text-[var(--accent-primary)]" strokeWidth={1.5} />
            </div>

            <h3 className="font-display mt-6 text-2xl text-[var(--ink)]">{service.title}</h3>
            <p className="mt-1 font-mono text-[0.54rem] uppercase tracking-[0.2em] text-[var(--faint)]">
              {meta.cls}
            </p>
            <p className="mt-4 flex-1 text-[0.92rem] leading-relaxed text-[var(--muted)]">
              {service.description}
            </p>

            <div className="mt-6 border-t border-[var(--line-soft)] pt-5">
              <p className="hud-label hud-label--bare mb-3 !text-[0.54rem]">Attached mods</p>
              <div className="flex flex-wrap gap-2">
                {service.features.map((f) => (
                  <span key={f} className="perk">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </article>
        );
      })}
    </div>

    <p data-reveal className="mt-10 flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.22em] text-[var(--faint)]">
      <span className="live-dot text-[var(--accent-primary)]" />
      Loadouts fully customizable per mission — brief me in the lobby.
    </p>
  </Sector>
);

export default Loadout;

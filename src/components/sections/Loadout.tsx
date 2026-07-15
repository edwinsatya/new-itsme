"use client";

import { Code2, Layers, Cpu } from "lucide-react";
import Sector from "@/components/Sector";
import GlitchText from "@/components/fx/GlitchText";
import { services } from "@/constants/profile";

const ICONS = [Code2, Layers, Cpu];

const Loadout = () => (
  <Sector id="loadout" index="03" name="LOADOUT" jp="装備" status="[3 PROGRAMS EQUIPPED]" alt zIndex={45}>
    <h2 className="font-display text-[clamp(2.4rem,6vw,4.8rem)] text-[var(--ink)]">
      <GlitchText as="span" className="glitch--block" text="EQUIPPED" />
      <GlitchText as="span" className="glitch--block md:ml-[7vw]" text="PROGRAMS." delay={0.14} />
    </h2>

    <div className="mt-16 border-t border-[var(--line)]">
      {services.map((service, i) => {
        const Icon = ICONS[i] ?? Cpu;
        return (
          <div
            key={service.index}
            data-reveal
            className="group grid grid-cols-1 gap-6 border-b border-[var(--line)] py-12 transition-colors duration-300 md:grid-cols-12 md:gap-8"
          >
            <div className="flex items-start gap-5 md:col-span-1 md:flex-col">
              <span className="font-mono text-[0.62rem] tracking-[0.24em] text-[var(--faint)]">
                {service.index}
              </span>
              <Icon
                size={22}
                className="text-[var(--muted)] transition-all duration-300 group-hover:text-[var(--cyan)] group-hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]"
                aria-hidden
              />
            </div>

            <div className="md:col-span-5">
              <h3 className="font-display text-[clamp(1.5rem,3vw,2.5rem)] leading-none text-[var(--ink)] transition-colors duration-300 group-hover:text-[var(--cyan)]">
                {service.title}
              </h3>
              <span className="tag mt-4 hidden md:inline-flex">[EQUIPPED]</span>
            </div>

            <div className="md:col-span-6">
              <p className="mb-6 max-w-xl leading-relaxed text-[var(--muted)]">{service.description}</p>
              <div className="flex flex-wrap gap-2">
                {service.features.map((feature) => (
                  <span key={feature} className="chip chip--xs">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>

    <div data-reveal className="mt-16 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
      <p className="max-w-md leading-relaxed text-[var(--muted)]">
        Need something off-catalogue? Custom programs compiled to spec — tell me
        about the job.
      </p>
      <a href="#comm" className="btn-neon">
        Request a custom run
      </a>
    </div>
  </Sector>
);

export default Loadout;

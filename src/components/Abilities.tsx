"use client";

import { useRevealScope } from "@/hooks/useRevealScope";
import ChapterHeader from "./fx/ChapterHeader";
import ChargeButton from "./fx/ChargeButton";
import SfxPop from "./fx/SfxPop";

const abilities = [
  {
    numeral: "壱",
    move: "Signature move 01",
    technique: "Interface Arts",
    title: "Front-End Development",
    description:
      "Building interactive and performant user interfaces using modern JavaScript frameworks and cutting-edge web technologies.",
    features: ["React / Next.js", "Vue.js", "TypeScript", "Modern CSS", "Web Performance"],
  },
  {
    numeral: "弐",
    move: "Signature move 02",
    technique: "Full-Spectrum Arts",
    title: "Full-Stack Engineering",
    description:
      "Developing complete web applications from database design to deployment, ensuring scalable and maintainable code.",
    features: ["API Development", "Database Design", "Cloud Deployment"],
  },
  {
    numeral: "参",
    move: "Signature move 03",
    technique: "Machine Summoning",
    title: "AI Integration",
    description:
      "Exploring and integrating artificial intelligence technologies to create innovative solutions that enhance user experiences.",
    features: ["OpenAI", "ChatGPT", "AI Integration", "Automation"],
  },
];

const Abilities = () => {
  const scope = useRevealScope<HTMLElement>();

  return (
    <section id="abilities" ref={scope} className="theme-paper section-shell overflow-hidden">
      <div
        className="halftone-fade pointer-events-none absolute right-[-6%] top-[10%] h-96 w-[32rem] text-[var(--ink)] opacity-20"
        aria-hidden
      />
      <p
        className="font-jp pointer-events-none absolute bottom-[4%] left-[-2%] select-none text-[clamp(6rem,18vw,15rem)] leading-none opacity-[0.05]"
        aria-hidden
      >
        能力
      </p>

      <div className="relative z-10 mx-auto max-w-6xl">
        <ChapterHeader
          chapter={3}
          sub="Services — What this character can do"
          lines={["Special", "Abilities"]}
        />

        <div className="mt-16 border-t-[3px] border-[var(--ink)]">
          {abilities.map((ability) => (
            <div
              key={ability.numeral}
              data-wipe
              className="group grid grid-cols-1 gap-6 border-b-[3px] border-[var(--ink)] py-10 md:grid-cols-12 md:gap-8"
            >
              {/* Kanji numeral */}
              <span className="font-jp text-5xl leading-none text-[var(--ink)] transition-colors duration-200 group-hover:text-[var(--red)] md:col-span-2 md:text-7xl">
                {ability.numeral}
              </span>

              {/* Technique name */}
              <div className="md:col-span-4">
                <p className="hud-label mb-2 text-[var(--red)]">{ability.move}</p>
                <h3 className="font-display text-[clamp(1.5rem,3vw,2.3rem)] leading-none">
                  {ability.title}
                </h3>
                <p className="font-mono mt-2 text-[0.68rem] uppercase tracking-[0.22em] opacity-60">
                  a.k.a. “{ability.technique}”
                </p>
              </div>

              {/* Description + sub-techniques */}
              <div className="md:col-span-6">
                <p className="mb-5 leading-relaxed opacity-85">{ability.description}</p>
                <div className="flex flex-wrap gap-2">
                  {ability.features.map((feature) => (
                    <span key={feature} className="chip !text-[0.58rem]">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          data-reveal
          className="relative mt-14 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center"
        >
          <SfxPop text="NEW!" className="-top-9 left-0 text-2xl" rotate={-10} />
          <p className="max-w-md text-lg opacity-85">
            Need something off the list? Custom techniques can be learned for the right
            quest.
          </p>
          <ChargeButton href="#contact" cursorLabel="GO!">
            Request a technique
          </ChargeButton>
        </div>
      </div>
    </section>
  );
};

export default Abilities;

"use client";

import { useRevealScope } from "@/hooks/useRevealScope";
import {
  useSectionParallax,
  SunOutline,
  Cloud,
  Contours,
  DotMesh,
  CrossMarks,
  WindLines,
  SectionGrid,
} from "./scenes";

const services = [
  {
    index: "01",
    title: "Front-End Development",
    description:
      "Building interactive and performant user interfaces using modern JavaScript frameworks and cutting-edge web technologies.",
    features: ["React / Next.js", "Vue.js", "TypeScript", "Modern CSS", "Web Performance"],
  },
  {
    index: "02",
    title: "Full-Stack Engineering",
    description:
      "Developing complete web applications from database design to deployment, ensuring scalable and maintainable code.",
    features: ["API Development", "Database Design", "Cloud Deployment"],
  },
  {
    index: "03",
    title: "AI Integration",
    description:
      "Exploring and integrating artificial intelligence technologies to create innovative solutions that enhance user experiences.",
    features: ["OpenAI", "ChatGPT", "AI Integration", "Automation"],
  },
];

const Services = () => {
  const scope = useRevealScope<HTMLElement>();

  useSectionParallax(scope);

  return (
    <section id="services" ref={scope} data-theme="banana" className="section-shell overflow-hidden">
      {/* Hot windy desert scenery */}
      <SectionGrid />
      <SunOutline className="right-[6%] top-[5%] h-72 w-72 text-[#0e4347] opacity-25 md:h-[28rem] md:w-[28rem]" speed={-0.3} />
      <Cloud className="left-[8%] top-[8%] h-12 w-44 text-[#0e4347] opacity-10" speed={-0.55} />
      <WindLines className="text-[#0e4347]" />
      <Contours className="bottom-[4%] left-[2%] h-56 w-[28rem] text-[#0e4347] opacity-20" speed={0.22} />
      <DotMesh className="left-[38%] top-[12%] hidden h-32 w-72 text-[#0e4347] opacity-20 md:block" speed={-0.28} />
      <CrossMarks className="text-[#0e4347] opacity-30" speed={-0.2} />

      <div data-enter className="relative z-10 mx-auto max-w-6xl">
        <div data-reveal className="mb-10 flex flex-wrap items-center justify-between gap-3">
          <p className="hud-label">003 — Services</p>
          <p className="hud-label">WX // Windy — 31°C</p>
        </div>

        <h2 data-scroll-speed="-0.2" className="font-display text-[clamp(2.2rem,6vw,4.8rem)] text-[var(--ink)]">
          <span className="line-mask md:ml-[8vw]">
            <span>What will we</span>
          </span>
          <span className="line-mask">
            <span>build together?</span>
          </span>
        </h2>

        <div className="mt-20 border-t border-[var(--line)]">
          {services.map((service) => (
            <div
              key={service.index}
              data-reveal
              className="group grid grid-cols-1 gap-6 border-b border-[var(--line)] py-12 md:grid-cols-12 md:gap-8"
            >
              <span className="hud-label md:col-span-1">{service.index}</span>

              <h3 className="font-display text-[clamp(1.4rem,3vw,2.4rem)] uppercase leading-none text-[var(--ink)] md:col-span-5">
                {service.title}
              </h3>

              <div className="md:col-span-6">
                <p className="mb-6 leading-relaxed text-[var(--ink)] opacity-85">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature) => (
                    <span
                      key={feature}
                      className="border border-[var(--line)] px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.15em] text-[var(--ink)]"
                    >
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
          className="mt-16 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center"
        >
          <p className="max-w-md text-lg text-[var(--ink)] opacity-85">
            Need something specific? I offer custom solutions tailored to your unique requirements.
          </p>
          <a href="#contact" className="btn-hud">
            Discuss a project
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;

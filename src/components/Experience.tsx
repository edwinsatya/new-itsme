import Counter from "@/components/Counter";
import { experience, site } from "@/data/content";

/** Paper two-column career section: ruled timeline + counters, certs, CV. */
export default function Experience() {
  return (
    <section
      id="experience"
      aria-label="Experience"
      data-theme="paper"
      className="paper-sec relative border-t border-line py-28 max-md:py-16"
    >
      <div className="gutter">
        <div className="grid grid-cols-12 gap-x-10 gap-y-14">
          <div className="col-span-12 md:col-span-8">
            <p data-reveal className="type-label flex items-center gap-2.5">
              <span aria-hidden="true" className="inline-block size-1.5 rounded-full bg-ultra" />
              {experience.label}
            </p>
            <h2 data-reveal className="type-title mt-6">
              {experience.title}
            </h2>

            <div className="mt-14 border-t border-line max-md:mt-10">
              {experience.rows.map((row) => (
                <div
                  key={`${row.company}-${row.period}`}
                  data-reveal
                  className="group grid grid-cols-12 gap-x-4 gap-y-1 border-b border-line py-6 transition-colors duration-300 hover:bg-ink/[0.035] md:py-7"
                >
                  <span className="col-span-12 text-[0.78rem] font-medium tracking-[0.1em] text-muted md:col-span-3">
                    {row.period}
                  </span>
                  <div className="col-span-12 md:col-span-5">
                    <h3 className="text-[clamp(1.3rem,2.2vw,1.9rem)] font-medium leading-tight tracking-[-0.02em]">
                      {row.company}
                    </h3>
                    <p className="type-label mt-1.5 text-ultra">{row.role}</p>
                  </div>
                  <p className="col-span-12 self-center text-[0.85rem] leading-snug text-muted md:col-span-4">
                    {row.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* side column */}
          <aside className="col-span-12 md:col-span-4 md:pt-24">
            <div className="md:sticky md:top-24">
              <dl className="space-y-8 border-t border-line pt-8">
                {experience.stats.map((stat) => (
                  <div key={stat.label} data-reveal className="flex items-end justify-between gap-4">
                    <dt className="type-label pb-2 text-muted">{stat.label}</dt>
                    <dd>
                      <Counter
                        value={stat.value}
                        suffix={stat.suffix}
                        className="text-[clamp(2.8rem,4.4vw,4.2rem)] font-semibold leading-none tracking-[-0.04em]"
                        suffixClassName="text-ultra"
                      />
                    </dd>
                  </div>
                ))}
              </dl>

              <div data-reveal className="mt-10 flex flex-wrap gap-2">
                {experience.certs.map((cert) => (
                  <span
                    key={cert}
                    className="rounded-full border border-line px-4 py-2 text-[0.72rem] font-medium tracking-[0.08em]"
                  >
                    {cert}
                  </span>
                ))}
              </div>

              <div data-reveal className="mt-10">
                <a
                  href={site.cv}
                  target="_blank"
                  rel="noreferrer"
                  data-magnetic
                  className="pill pill-ink"
                >
                  Download CV <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

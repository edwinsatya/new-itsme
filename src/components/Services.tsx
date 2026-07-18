import RuledRow from "@/components/RuledRow";
import { services } from "@/data/content";

/** Ruled service rows — what I do, assembled around the problem. */
export default function Services() {
  return (
    <section
      aria-label="Services"
      data-theme="paper"
      className="paper-sec relative pt-28 max-md:pt-16"
    >
      <div className="gutter">
        <div className="grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 md:col-span-8">
            <p data-reveal className="type-label flex items-center gap-2.5">
              <span aria-hidden="true" className="inline-block size-1.5 rounded-full bg-acid" />
              {services.label}
            </p>
            <h2 data-reveal className="type-title mt-6">
              {services.title}
            </h2>
          </div>
          <p
            data-reveal
            className="col-span-12 max-w-[380px] text-[0.95rem] leading-relaxed text-muted md:col-span-4 md:justify-self-end"
          >
            {services.description}
          </p>
        </div>

        <div className="mt-16 border-t border-line max-md:mt-10">
          {services.rows.map((row) => (
            <RuledRow
              key={row.num}
              num={row.num}
              name={row.name}
              desc={row.desc}
              tag={row.tag}
              as="h3"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

import RuledRow from "@/components/RuledRow";
import { archive } from "@/data/content";

/** Paper archive of further shipped work as ruled hover rows. */
export default function ProjectIndex() {
  return (
    <section
      aria-label="Project archive"
      data-theme="paper"
      className="paper-sec relative py-28 max-md:py-16"
    >
      <div className="gutter">
        <p data-reveal className="type-label flex items-center gap-2.5">
          <span aria-hidden="true" className="inline-block size-1.5 rounded-full bg-ultra" />
          Archive
        </p>
        <h2 data-reveal className="type-title mt-6 max-w-[900px]">
          More shipped work
        </h2>

        <div className="mt-16 border-t border-line max-md:mt-10">
          {archive.map((row) => (
            <RuledRow
              key={row.num}
              num={row.num}
              name={row.name}
              desc={row.desc}
              tag={row.tag}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

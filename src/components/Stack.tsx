import { stack } from "@/data/content";

/** Thin ink band with a continuously moving marquee of the arsenal. */
export default function Stack() {
  const row = (hidden: boolean) => (
    <div
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center"
    >
      {stack.map((tech) => (
        <span key={tech} className="flex items-center">
          <span className="px-7 text-[0.82rem] font-medium uppercase tracking-[0.2em] text-white/85 max-md:px-5">
            {tech}
          </span>
          <span aria-hidden="true" className="size-1.5 rounded-full bg-acid" />
        </span>
      ))}
    </div>
  );

  return (
    <section
      aria-label="Technology stack"
      className="overflow-hidden border-y border-wline bg-ink py-6"
    >
      <div className="marquee-track" style={{ ["--marquee-dur" as string]: "26s" }}>
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}

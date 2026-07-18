import { contact, site } from "@/data/content";

/** Centered black closing section with oversized off-canvas circles. */
export default function Contact() {
  return (
    <section
      id="contact"
      aria-label="Contact"
      className="grain relative grid min-h-[80vh] place-items-center overflow-hidden bg-black py-36 text-center max-md:py-24"
    >
      {/* oversized outlined circles bleeding off-canvas */}
      <div
        aria-hidden="true"
        className="absolute -left-[26vw] -top-[34vw] size-[70vw] rounded-full border border-white/[0.08]"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-[42vw] -right-[30vw] size-[84vw] rounded-full border border-white/[0.08]"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-[48vw] -right-[36vw] size-[96vw] rounded-full border border-acid/10"
      />

      <div className="gutter relative z-10 flex max-w-[1100px] flex-col items-center">
        <h2 data-reveal className="type-hero text-white">
          {contact.heading[0]}
          <br />
          {contact.heading[1]}
          <em className="font-serif italic text-acid">{contact.accent}</em>
        </h2>

        <div data-reveal className="mt-14 max-md:mt-10" style={{ ["--reveal-delay" as string]: "0.1s" }}>
          <a
            href={`mailto:${site.email}`}
            data-magnetic
            className="paper-sec inline-flex items-center gap-3 rounded-full px-9 py-4 text-[0.8rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-300 hover:bg-acid"
          >
            {contact.cta}
          </a>
        </div>

        <div
          data-reveal
          className="type-label mt-10 flex items-center gap-8 text-white/70"
          style={{ ["--reveal-delay" as string]: "0.18s" }}
        >
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="transition-colors duration-300 hover:text-acid"
          >
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noreferrer"
            className="transition-colors duration-300 hover:text-acid"
          >
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
        </div>

        <p
          data-reveal
          className="type-label mt-8 text-white/40"
          style={{ ["--reveal-delay" as string]: "0.24s" }}
        >
          {contact.micro}
        </p>
      </div>
    </section>
  );
}

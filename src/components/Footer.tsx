import { footer, nav, site } from "@/data/content";

/** Paper footer: giant moving ultramarine wordmark + site map. */
export default function Footer() {
  const marqueeRow = (hidden: boolean) => (
    <span
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center whitespace-nowrap pr-[4vw] text-[11vw] font-semibold leading-[0.85] tracking-[-0.045em] text-ultra max-md:text-[16vw]"
    >
      {footer.marquee}
      <span className="inline-block px-[4vw]" aria-hidden="true">
        {footer.marquee}
      </span>
    </span>
  );

  return (
    <footer
      data-theme="paper"
      className="paper-sec relative overflow-hidden pt-14 max-md:pt-10"
    >
      <div
        className="marquee-track select-none"
        style={{ ["--marquee-dur" as string]: "38s" }}
      >
        {marqueeRow(false)}
        {marqueeRow(true)}
      </div>

      <div className="gutter mt-14 grid grid-cols-12 gap-x-6 gap-y-10 border-t border-line pb-10 pt-10 max-md:mt-10">
        <nav aria-label="Footer" className="col-span-6 md:col-span-3">
          <p className="type-label mb-5 text-muted">Menu</p>
          <ul className="space-y-2.5">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-[0.95rem] font-medium transition-colors duration-300 hover:text-ultra"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-6 md:col-span-3">
          <p className="type-label mb-5 text-muted">Elsewhere</p>
          <ul className="space-y-2.5">
            <li>
              <a
                href={site.github}
                target="_blank"
                rel="noreferrer"
                className="text-[0.95rem] font-medium transition-colors duration-300 hover:text-ultra"
              >
                GitHub <span aria-hidden="true">↗</span>
              </a>
            </li>
            <li>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-[0.95rem] font-medium transition-colors duration-300 hover:text-ultra"
              >
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="text-[0.95rem] font-medium transition-colors duration-300 hover:text-ultra"
              >
                Email <span aria-hidden="true">↗</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="col-span-12 flex flex-col justify-between gap-6 md:col-span-6 md:items-end">
          <p className="type-label text-muted">{site.location}</p>
          <p className="type-label text-muted">{footer.note}</p>
        </div>
      </div>
    </footer>
  );
}

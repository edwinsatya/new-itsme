import { nav, site } from "@/data/content";

/** Absolute overlay header sitting on the hero. */
export default function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-40 text-white">
      <div className="gutter relative flex h-[76px] items-center justify-between">
        <a
          href="#top"
          className="text-[0.82rem] font-semibold tracking-[0.06em]"
          aria-label={`${site.name} — back to top`}
        >
          {site.brand}
        </a>

        <nav
          aria-label="Primary"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex"
        >
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="type-label transition-colors duration-300 hover:text-acid"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#contact" className="pill" data-magnetic>
          {"Let's talk"} <span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>
  );
}

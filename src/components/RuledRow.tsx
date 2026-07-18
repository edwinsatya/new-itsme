import clsx from "clsx";

type RuledRowProps = {
  num: string;
  name: string;
  desc: string;
  tag: string;
  /** heading level for the name — services rows are h3s, index rows plain */
  as?: "h3" | "span";
};

/**
 * Editorial ruled row that flips to ultramarine with white type on hover.
 * Used by the project index and the services list.
 */
export default function RuledRow({ num, name, desc, tag, as = "span" }: RuledRowProps) {
  const Name = as;
  return (
    <div
      data-reveal
      className="group relative -mx-3 grid grid-cols-[3.2rem_1fr_auto] items-baseline gap-x-4 gap-y-1 border-b border-line px-3 py-6 transition-colors duration-300 hover:bg-ultra hover:text-white max-md:grid-cols-[2.4rem_1fr_auto] md:grid-cols-[3.5rem_1.1fr_1fr_auto] md:py-7"
    >
      <span className="text-[0.72rem] font-medium tracking-[0.14em] text-muted transition-colors duration-300 group-hover:text-white/70">
        {num}
      </span>
      <Name
        className={clsx(
          "text-[clamp(1.45rem,3vw,2.6rem)] font-medium leading-none tracking-[-0.03em]"
        )}
      >
        {name}
      </Name>
      <span className="text-[0.85rem] leading-snug text-muted transition-colors duration-300 group-hover:text-white/80 max-md:col-span-2 max-md:col-start-2 max-md:mt-1">
        {desc}
      </span>
      <span className="type-label justify-self-end text-muted transition-colors duration-300 group-hover:text-white/70 max-md:col-start-3 max-md:row-start-1">
        {tag}
      </span>
    </div>
  );
}

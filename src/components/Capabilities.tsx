import Counter from "@/components/Counter";
import { capabilities } from "@/data/content";

/** Three equal capability cards: ultramarine, paper, acid. */
export default function Capabilities() {
  const [ultra, paper, acid] = capabilities;

  return (
    <section
      aria-label="Capability cards"
      data-theme="paper"
      className="paper-sec relative pb-28 pt-16 max-md:pb-16 max-md:pt-10"
    >
      <div className="gutter grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* ultramarine — interfaces */}
        <article
          data-reveal
          className="relative flex min-h-[440px] flex-col justify-between overflow-hidden rounded-[20px] bg-ultra p-7 text-white max-md:min-h-[380px]"
        >
          <div className="relative z-10">
            <h3 className="max-w-[240px] text-[1.7rem] font-medium leading-[1.05] tracking-[-0.03em]">
              {ultra.title}
            </h3>
            <p className="mt-4 max-w-[260px] text-[0.85rem] leading-relaxed text-white/70">
              {ultra.body}
            </p>
          </div>
          {/* floating paper mini-dashboard */}
          <div aria-hidden="true" className="relative mt-10 h-[190px]">
            <div className="float-card paper-sec absolute left-1/2 top-1/2 w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-xl p-5 shadow-[0_30px_60px_rgba(5,5,6,0.35)]">
              <div className="flex items-center justify-between">
                <span className="size-2 rounded-full bg-acid" />
                <span className="h-1.5 w-16 rounded-full bg-ink/15" />
              </div>
              <div className="mt-4 space-y-2">
                <span className="block h-2 w-3/4 rounded-full bg-ink/20" />
                <span className="block h-2 w-1/2 rounded-full bg-ink/15" />
              </div>
              <div className="mt-5 flex items-end gap-1.5">
                {[34, 58, 42, 72, 50, 88, 64].map((h, i) => (
                  <span
                    key={i}
                    className={i === 5 ? "w-3 rounded-sm bg-ultra" : "w-3 rounded-sm bg-ink/20"}
                    style={{ height: `${h * 0.55}px` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* paper — systems */}
        <article
          data-reveal
          className="relative flex min-h-[440px] flex-col justify-between overflow-hidden rounded-[20px] border border-line bg-paper p-7 max-md:min-h-[380px]"
          style={{ ["--reveal-delay" as string]: "0.08s" }}
        >
          <div className="relative z-10">
            <h3 className="max-w-[240px] text-[1.7rem] font-medium leading-[1.05] tracking-[-0.03em]">
              {paper.title}
            </h3>
            <p className="mt-4 max-w-[280px] text-[0.85rem] leading-relaxed text-muted">
              {paper.body}
            </p>
          </div>
          {/* rotated prototype cards */}
          <div aria-hidden="true" className="relative mt-10 h-[190px]">
            <div className="absolute left-[12%] top-[18%] h-[130px] w-[46%] -rotate-[9deg] rounded-lg bg-ink p-3">
              <span className="block h-1.5 w-1/2 rounded-full bg-white/25" />
              <span className="mt-2 block h-1.5 w-2/3 rounded-full bg-white/15" />
            </div>
            <div className="absolute left-[34%] top-[8%] h-[130px] w-[46%] rotate-[4deg] rounded-lg bg-acid p-3">
              <span className="block h-1.5 w-1/2 rounded-full bg-ink/30" />
              <span className="mt-2 block h-1.5 w-1/3 rounded-full bg-ink/20" />
            </div>
            <div className="absolute left-[52%] top-[26%] h-[130px] w-[46%] rotate-[13deg] rounded-lg bg-ultra p-3 shadow-[0_24px_44px_rgba(5,5,6,0.22)]">
              <span className="block h-1.5 w-2/3 rounded-full bg-white/30" />
              <span className="mt-2 block h-1.5 w-1/2 rounded-full bg-white/20" />
            </div>
          </div>
        </article>

        {/* acid — momentum */}
        <article
          data-reveal
          className="relative flex min-h-[440px] flex-col justify-between overflow-hidden rounded-[20px] bg-acid p-7 text-ink max-md:min-h-[380px]"
          style={{ ["--reveal-delay" as string]: "0.16s" }}
        >
          {/* concentric signal field */}
          <div aria-hidden="true" className="absolute inset-0">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="signal-ring absolute left-1/2 top-[62%] block size-[320px] rounded-full border border-ink/25"
                style={{ animationDelay: `${i * 1.2}s` }}
              />
            ))}
          </div>
          <div className="relative z-10">
            <h3 className="max-w-[240px] text-[1.7rem] font-medium leading-[1.05] tracking-[-0.03em]">
              {acid.title}
            </h3>
            <p className="mt-4 max-w-[240px] text-[0.85rem] leading-relaxed text-ink/65">
              {acid.body}
            </p>
          </div>
          <div className="relative z-10">
            <Counter
              value={10}
              suffix="+"
              className="text-[clamp(4rem,7vw,6.5rem)] font-semibold leading-none tracking-[-0.05em]"
            />
            <p className="type-label mt-2 text-ink/60">shipped projects</p>
          </div>
        </article>
      </div>
    </section>
  );
}

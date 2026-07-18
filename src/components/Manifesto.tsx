"use client";

import { useRef } from "react";
import clsx from "clsx";
import { gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";
import MediaSlot from "@/components/media/MediaSlot";
import { manifesto } from "@/data/content";

const ROTATE_FROM = [-10, 7, -6, 9, -8];
const ROTATE_TO = [-3, 2, -2, 3, -1];

type CollageMedia = { magloft: string | null; happyfarm: string | null };

/**
 * Near-black sticky manifesto: three display lines brighten in sequence,
 * then five collage items rise in around the type.
 */
export default function Manifesto({ media }: { media: CollageMedia }) {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap.set("[data-mline]", { opacity: 0.18 });
        gsap.set("[data-citem]", {
          autoAlpha: 0,
          y: 90,
          scale: 0.78,
          rotation: (i: number) => ROTATE_FROM[i % ROTATE_FROM.length],
        });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.to("[data-mline]", { opacity: 1, duration: 0.15, stagger: 0.17 }, 0.05)
          .to(
            "[data-citem]",
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              rotation: (i: number) => ROTATE_TO[i % ROTATE_TO.length],
              duration: 0.22,
              stagger: 0.07,
              ease: "power1.out",
            },
            0.56
          )
          .fromTo(
            "[data-mindex]",
            { opacity: 0.25 },
            { opacity: 1, duration: 0.2 },
            0.1
          );
      },
      sectionRef
    );
    return () => mm.revert();
  }, []);

  const items: Array<{
    key: string;
    className: string;
    z: string;
    node: React.ReactNode;
  }> = [
    {
      key: "shot-a",
      className:
        "left-[6vw] top-[14vh] w-[19vw] max-md:left-[4vw] max-md:top-[12vh] max-md:w-[36vw]",
      z: "z-[1]",
      node: (
        <MediaSlot
          src={media.magloft}
          alt="Magloft project screenshot"
          variant="ultra"
          className="aspect-[4/3] w-full"
          sizes="(max-width: 760px) 36vw, 19vw"
        />
      ),
    },
    {
      key: "shot-b",
      className:
        "right-[7vw] top-[10vh] w-[15vw] max-md:right-[4vw] max-md:top-[64vh] max-md:w-[32vw]",
      z: "z-[12]",
      node: (
        <MediaSlot
          src={media.happyfarm}
          alt="Happy Farm project screenshot"
          variant="space"
          className="aspect-[3/4] w-full"
          sizes="(max-width: 760px) 32vw, 15vw"
        />
      ),
    },
    {
      key: "orb",
      className:
        "bottom-[12vh] left-[9vw] w-[13vw] max-md:bottom-[10vh] max-md:left-[5vw] max-md:w-[30vw]",
      z: "z-[1]",
      node: (
        <div className="grain relative aspect-square w-full overflow-hidden bg-ultra">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(200,255,46,1), rgba(200,255,46,0.5) 62%, transparent 75%)",
              boxShadow: "0 0 60px rgba(200,255,46,0.65)",
            }}
          />
        </div>
      ),
    },
    {
      key: "es",
      className:
        "bottom-[9vh] right-[24vw] w-[11vw] max-md:bottom-[26vh] max-md:right-[8vw] max-md:w-[24vw]",
      z: "z-[12]",
      node: (
        <div className="paper-sec grid aspect-[5/4] w-full place-items-center">
          <span className="text-[3.2vw] font-semibold tracking-[-0.04em] max-md:text-[7vw]">
            ES
          </span>
        </div>
      ),
    },
    {
      key: "stats",
      className:
        "right-[10vw] top-[48vh] w-[16vw] max-md:left-[10vw] max-md:top-[36vh] max-md:w-[44vw]",
      z: "z-[12]",
      node: (
        <div className="grid aspect-[16/9] w-full place-items-center border border-wline bg-ink">
          <span className="font-mono text-[10px] tracking-[0.22em] text-white/70">
            {manifesto.stats}
          </span>
        </div>
      ),
    },
  ];

  return (
    <section
      ref={sectionRef}
      aria-label="Manifesto"
      className="sec-manifesto tall relative h-[440vh] bg-black text-white max-md:h-[320vh]"
    >
      <div className="stage sticky top-0 h-[100svh] overflow-hidden">
        {/* centered display type */}
        <div className="absolute inset-0 z-[6] grid place-items-center px-5">
          <p className="type-display max-w-[1100px] text-center">
            {manifesto.lines.map((line) => (
              <span key={line} data-mline className="block">
                {line}
              </span>
            ))}
          </p>
        </div>

        {/* collage */}
        {items.map((item) => (
          <div
            key={item.key}
            data-citem
            className={clsx("absolute will-change-transform", item.z, item.className)}
          >
            {item.node}
          </div>
        ))}

        {/* vertical index */}
        <span
          data-mindex
          className="type-label absolute right-4 top-1/2 z-[7] text-white/50 max-md:hidden"
          style={{ writingMode: "vertical-rl" }}
        >
          {manifesto.sideIndex}
        </span>
      </div>
    </section>
  );
}

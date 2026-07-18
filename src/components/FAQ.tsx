"use client";

import { useState } from "react";
import clsx from "clsx";
import { faq } from "@/data/content";

/**
 * Accessible one-at-a-time accordion: acid numerals, circular plus/minus,
 * aria-expanded kept in sync, height + opacity animated via grid rows.
 */
export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      aria-label="Frequently asked questions"
      data-theme="paper"
      className="paper-sec relative border-t border-line py-28 max-md:py-16"
    >
      <div className="gutter grid grid-cols-12 gap-x-10 gap-y-12">
        <div className="col-span-12 md:col-span-4">
          <div className="md:sticky md:top-24">
            <p data-reveal className="type-label flex items-center gap-2.5">
              <span aria-hidden="true" className="inline-block size-1.5 rounded-full bg-acid" />
              {faq.label}
            </p>
            <h2 data-reveal className="type-title mt-6 max-w-[420px] !text-[clamp(2.2rem,4vw,4rem)]">
              {faq.title}
            </h2>
          </div>
        </div>

        <div className="col-span-12 border-t border-line md:col-span-8">
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            const buttonId = `faq-q-${i}`;
            const panelId = `faq-a-${i}`;
            return (
              <div key={item.q} data-reveal className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center gap-6 py-7 text-left max-md:gap-4 max-md:py-5"
                  >
                    <span className="w-9 shrink-0 font-serif italic text-[1.5rem] leading-none text-ink">
                      <span className="sr-only">Question </span>
                      <span aria-hidden="true" className="text-acid brightness-[0.72] saturate-[1.4]">
                        0{i + 1}
                      </span>
                    </span>
                    <span className="flex-1 text-[clamp(1.1rem,2vw,1.6rem)] font-medium tracking-[-0.02em]">
                      {item.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className={clsx(
                        "relative grid size-10 shrink-0 place-items-center rounded-full border border-ink/25 transition-all duration-500",
                        "group-hover:bg-ink group-hover:text-paper",
                        isOpen && "rotate-180"
                      )}
                    >
                      <span className="absolute h-[1.5px] w-3.5 bg-current" />
                      <span
                        className={clsx(
                          "absolute h-3.5 w-[1.5px] bg-current transition-transform duration-500",
                          isOpen && "scale-y-0"
                        )}
                      />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,0.61,0.21,1)]"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[640px] pb-8 pl-[3.75rem] pr-6 text-[0.95rem] leading-relaxed text-ink/70 max-md:pl-[3.25rem]">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

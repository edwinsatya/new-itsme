"use client";

import { useRef, useState } from "react";
import { gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";

export const LOADER_DONE_EVENT = "es:loader-done";

/** Resolves once the window has loaded (or immediately if it already has). */
function windowLoaded(): Promise<void> {
  return new Promise((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", () => resolve(), { once: true });
  });
}

/**
 * Full-screen black loader: E/S mark + acid progress line, revealed upward
 * with a clip-path once fonts and the window are ready. Locks body scroll
 * while visible and is guaranteed to unlock it.
 */
export default function Loader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    document.body.style.overflow = "hidden";

    let finished = false;
    const announce = () => {
      if (document.documentElement.dataset.loaded) return;
      document.documentElement.dataset.loaded = "true";
      window.dispatchEvent(new CustomEvent(LOADER_DONE_EVENT));
    };
    const finish = () => {
      if (finished) return;
      finished = true;
      document.body.style.overflow = "";
      announce();
      setGone(true);
    };

    // absolute failsafe: never leave the page locked
    const failsafe = window.setTimeout(finish, 4200);

    if (prefersReducedMotion()) {
      finish();
      return () => window.clearTimeout(failsafe);
    }

    const bar = root.querySelector<HTMLElement>("[data-bar]");
    const pct = root.querySelector<HTMLElement>("[data-pct]");
    const state = { p: 0 };
    const render = () => {
      if (bar) bar.style.transform = `scaleX(${state.p / 100})`;
      if (pct) pct.textContent = `${Math.round(state.p)}`.padStart(2, "0");
    };

    let crawlDone = false;
    let ready = false;
    let finaleStarted = false;

    const ctx = gsap.context(() => {
      const finale = () => {
        if (finaleStarted || finished) return;
        finaleStarted = true;
        const tl = gsap.timeline();
        tl.to(state, {
          p: 100,
          duration: 0.3,
          ease: "power1.inOut",
          onUpdate: render,
        });
        // hero entry starts as the shutter lifts
        tl.add(announce);
        tl.to(
          innerRef.current,
          { yPercent: -28, autoAlpha: 0.3, duration: 0.85, ease: "power4.inOut" },
          "<"
        );
        tl.to(
          root,
          {
            clipPath: "inset(0 0 100% 0)",
            duration: 0.85,
            ease: "power4.inOut",
            onComplete: finish,
          },
          "<"
        );
      };
      const maybeFinale = () => {
        if (crawlDone && ready) finale();
      };

      gsap.set(root, { clipPath: "inset(0 0 0% 0)" });
      gsap.to(state, {
        p: 84,
        duration: 1.35,
        ease: "power2.inOut",
        onUpdate: render,
        onComplete: () => {
          crawlDone = true;
          maybeFinale();
        },
      });

      Promise.race([
        Promise.all([document.fonts?.ready ?? Promise.resolve(), windowLoaded()]),
        new Promise((r) => setTimeout(r, 2400)),
      ]).then(() => {
        ready = true;
        maybeFinale();
      });
    }, root);

    return () => {
      window.clearTimeout(failsafe);
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-[100] grid place-items-center bg-black"
    >
      <div ref={innerRef} className="flex w-full flex-col items-center gap-10">
        <div
          className="font-serif leading-none text-paper"
          style={{ fontSize: "clamp(88px, 19vw, 230px)" }}
        >
          E<span className="italic text-acid">/</span>S
        </div>
        <div className="w-[min(420px,72vw)]">
          <div className="relative h-[2px] w-full overflow-hidden bg-white/10">
            <div
              data-bar
              className="absolute inset-0 origin-left bg-acid"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
          <div className="type-label mt-3 flex justify-between text-white/45">
            <span>EDWIN.SATYA®</span>
            <span>
              <span data-pct>00</span>%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

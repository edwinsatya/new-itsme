"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const INTERACTIVE = "a, button, input, textarea, label, [data-cursor]";

/**
 * Target-lock cursor: a crosshair reticle that follows the pointer and snaps
 * its corner brackets open when it acquires an interactive element. Elements
 * can announce themselves via `data-cursor-label="ENTER BATTLE"`.
 */
const Cursor = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.body.classList.add("custom-cursor-active");

    const root = rootRef.current!;
    const label = labelRef.current!;
    gsap.set(root, { xPercent: -50, yPercent: -50, opacity: 0 });

    const x = gsap.quickTo(root, "x", { duration: 0.13, ease: "power3.out" });
    const y = gsap.quickTo(root, "y", { duration: 0.13, ease: "power3.out" });

    let locked = false;

    const onMove = (e: MouseEvent) => {
      gsap.to(root, { opacity: 1, duration: 0.25, overwrite: "auto" });
      x(e.clientX);
      y(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(INTERACTIVE);
      const shouldLock = !!target;

      if (shouldLock !== locked) {
        locked = shouldLock;
        root.classList.toggle("is-locked", locked);
        if (locked) {
          // snap-to-lock: quick rotation settle, like a targeting UI acquiring
          gsap.fromTo(
            root,
            { rotation: 42 },
            { rotation: 0, duration: 0.32, ease: "back.out(2.6)", overwrite: "auto" }
          );
        }
      }

      label.textContent = target
        ? (target.closest<HTMLElement>("[data-cursor-label]")?.dataset.cursorLabel ?? "")
        : "";
    };

    const onLeave = () => {
      gsap.to(root, { opacity: 0, duration: 0.3, overwrite: "auto" });
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={rootRef} className="cursor-lock text-[var(--paper)]">
      {/* reticle blends with the backdrop so it stays visible on paper and ink;
          the label sits outside the blend group to keep its true red */}
      <span className="cursor-reticle mix-blend-difference">
        <span className="cursor-cross-h" />
        <span className="cursor-cross-v" />
        <span className="cursor-bracket cursor-bracket--tl" />
        <span className="cursor-bracket cursor-bracket--tr" />
        <span className="cursor-bracket cursor-bracket--bl" />
        <span className="cursor-bracket cursor-bracket--br" />
      </span>
      <span ref={labelRef} className="cursor-label" />
    </div>
  );
};

export default Cursor;

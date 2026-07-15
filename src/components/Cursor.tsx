"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Crosshair reticle cursor with a velocity streak trailing behind it.
 * Snaps hot (magenta, rotated) over interactive elements; shows a mono
 * label ("ACCESS" etc.) over anything carrying data-cursor-label.
 */
const Cursor = () => {
  const retRef = useRef<HTMLDivElement>(null);
  const streakRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.body.classList.add("custom-cursor-active");

    const ret = retRef.current!;
    const streak = streakRef.current!;
    const label = labelRef.current!;

    gsap.set(ret, { xPercent: -50, yPercent: -50, opacity: 0 });
    gsap.set(streak, { xPercent: -100, yPercent: -50, opacity: 0, transformOrigin: "100% 50%" });
    gsap.set(label, { opacity: 0 });

    const retX = gsap.quickTo(ret, "x", { duration: 0.13, ease: "power3.out" });
    const retY = gsap.quickTo(ret, "y", { duration: 0.13, ease: "power3.out" });
    const stX = gsap.quickTo(streak, "x", { duration: 0.38, ease: "power3.out" });
    const stY = gsap.quickTo(streak, "y", { duration: 0.38, ease: "power3.out" });
    const lbX = gsap.quickTo(label, "x", { duration: 0.2, ease: "power3.out" });
    const lbY = gsap.quickTo(label, "y", { duration: 0.2, ease: "power3.out" });

    let prevX = 0;
    let prevY = 0;
    let hot = false;

    const onMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      gsap.to(ret, { opacity: 1, duration: 0.25, overwrite: "auto" });

      retX(x);
      retY(y);
      stX(x);
      stY(y);
      lbX(x + 20);
      lbY(y + 22);

      // streak orients along travel and brightens with speed
      const dx = x - prevX;
      const dy = y - prevY;
      const speed = Math.hypot(dx, dy);
      if (speed > 2) {
        gsap.set(streak, { rotation: (Math.atan2(dy, dx) * 180) / Math.PI });
      }
      gsap.to(streak, {
        opacity: Math.min(speed / 42, 0.75),
        duration: 0.3,
        overwrite: "auto",
      });
      prevX = x;
      prevY = y;
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, input, textarea, [role='link'], [data-cursor]");
      const labelled = target.closest<HTMLElement>("[data-cursor-label]");

      if (!!interactive !== hot) {
        hot = !!interactive;
        ret.classList.toggle("is-active", hot);
        gsap.to(ret, {
          scale: hot ? 1.45 : 1,
          rotation: hot ? 45 : 0,
          duration: 0.3,
          ease: "power3.out",
          overwrite: "auto",
        });
      }

      if (labelled) {
        label.textContent = labelled.dataset.cursorLabel || "ACCESS";
        gsap.to(label, { opacity: 1, duration: 0.2, overwrite: "auto" });
      } else {
        gsap.to(label, { opacity: 0, duration: 0.2, overwrite: "auto" });
      }
    };

    const onLeave = () => {
      gsap.to([ret, streak, label], { opacity: 0, duration: 0.3, overwrite: "auto" });
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
    <>
      <div ref={streakRef} className="cursor-streak" />
      <div ref={retRef} className="cursor-ret">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1">
          <line x1="18" y1="1" x2="18" y2="9" />
          <line x1="18" y1="27" x2="18" y2="35" />
          <line x1="1" y1="18" x2="9" y2="18" />
          <line x1="27" y1="18" x2="35" y2="18" />
          <circle cx="18" cy="18" r="1.7" fill="currentColor" stroke="none" />
        </svg>
      </div>
      <div ref={labelRef} className="cursor-label">
        ACCESS
      </div>
    </>
  );
};

export default Cursor;

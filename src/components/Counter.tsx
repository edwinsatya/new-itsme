"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";

type CounterProps = {
  value: number;
  suffix?: string;
  className?: string;
  suffixClassName?: string;
  duration?: number;
};

/** Number that counts up from 0 the first time it scrolls into view. */
export default function Counter({
  value,
  suffix = "",
  className,
  suffixClassName,
  duration = 1.6,
}: CounterProps) {
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = numRef.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.textContent = String(value);
      return;
    }

    let tween: gsap.core.Tween | null = null;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const state = { v: 0 };
        tween = gsap.to(state, {
          v: value,
          duration,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = String(Math.round(state.v));
          },
        });
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      tween?.kill();
    };
  }, [value, duration]);

  return (
    <span className={className}>
      <span ref={numRef}>0</span>
      {suffix && <span className={suffixClassName}>{suffix}</span>}
    </span>
  );
}

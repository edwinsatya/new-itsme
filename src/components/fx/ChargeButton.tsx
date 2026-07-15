"use client";

import { ReactNode, useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

type ChargeButtonProps = {
  children: ReactNode;
  href?: string;
  target?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  cursorLabel?: string;
};

/**
 * Primary CTA: magnetic pull toward the cursor (wrapper transform, GSAP) and a
 * charge-up ring while hovering (CSS, `.btn-charge::before`). The click snap is
 * pure CSS `:active` on the inner element, so it never fights the magnet tween.
 */
const ChargeButton = ({
  children,
  href,
  target,
  type = "button",
  disabled,
  className = "",
  cursorLabel = "GO!",
}: ChargeButtonProps) => {
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (!window.matchMedia("(pointer: fine)").matches || prefersReducedMotion()) return;

    const xTo = gsap.quickTo(wrap, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(wrap, "y", { duration: 0.35, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      xTo((e.clientX - (rect.left + rect.width / 2)) * 0.32);
      yTo((e.clientY - (rect.top + rect.height / 2)) * 0.32);
    };

    const onLeave = () => {
      gsap.to(wrap, {
        x: 0,
        y: 0,
        duration: 0.65,
        ease: "elastic.out(1, 0.35)",
        overwrite: "auto",
      });
    };

    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);

    return () => {
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const inner = href ? (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      className={`btn-charge ${className}`}
      data-cursor-label={cursorLabel}
    >
      {children}
    </a>
  ) : (
    <button
      type={type}
      disabled={disabled}
      className={`btn-charge disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      data-cursor-label={cursorLabel}
    >
      {children}
    </button>
  );

  return (
    <span ref={wrapRef} className="inline-block will-change-transform">
      {inner}
    </span>
  );
};

export default ChargeButton;

"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

type Drop = {
  x: number;
  y: number;
  len: number;
  vy: number;
  alpha: number;
  color: string;
};

// mostly desaturated blue-white; the occasional neon-lit streak
const pickColor = () => {
  const r = Math.random();
  if (r < 0.08) return "rgba(255,46,136,";
  if (r < 0.22) return "rgba(0,229,255,";
  return "rgba(168,198,228,";
};

/**
 * Ambient neon rain on a canvas. Slow, sparse, angled by a light wind.
 * Pauses when offscreen or the tab is hidden; skipped entirely under
 * prefers-reduced-motion; density and DPR are capped on small screens.
 */
const NeonRain = ({ className = "" }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let drops: Drop[] = [];
    let raf = 0;
    let visible = true;
    let last = performance.now();

    const spawn = (initial: boolean): Drop => ({
      x: Math.random() * (width + 120) - 60,
      y: initial ? Math.random() * height : -120 - Math.random() * 80,
      len: 34 + Math.random() * 82,
      vy: 130 + Math.random() * 170, // px/s — slow, ambient
      alpha: 0.06 + Math.random() * 0.2,
      color: pickColor(),
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(Math.max(width / (width < 768 ? 26 : 20), 22), 85));
      drops = Array.from({ length: count }, () => spawn(true));
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;

      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        const vx = d.vy * 0.16; // constant wind shear
        d.y += d.vy * dt;
        d.x += vx * dt;

        ctx.strokeStyle = `${d.color}${d.alpha})`;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - vx * (d.len / d.vy), d.y - d.len);
        ctx.stroke();

        if (d.y - d.len > height) drops[i] = spawn(false);
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    resize();
    window.addEventListener("resize", resize);
    start();

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
};

export default NeonRain;

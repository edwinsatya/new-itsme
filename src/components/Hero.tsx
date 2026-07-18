"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";
import { useInViewVideo } from "@/hooks/useInViewVideo";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { LOADER_DONE_EVENT } from "@/components/Loader";
import { hero } from "@/data/content";

/* ------------------------------------------------------------------------ */
/*  Canvas fallback scene: drifting ink/ultramarine gradient field           */
/* ------------------------------------------------------------------------ */

type Blob = {
  x: number;
  y: number;
  r: number;
  color: string;
  speed: number;
  phase: number;
  ampX: number;
  ampY: number;
};

const BLOBS: Blob[] = [
  { x: 0.74, y: 0.3, r: 0.62, color: "61,67,255", speed: 0.21, phase: 0, ampX: 0.1, ampY: 0.08 },
  { x: 0.18, y: 0.78, r: 0.55, color: "24,30,110", speed: 0.16, phase: 2.1, ampX: 0.09, ampY: 0.1 },
  { x: 0.42, y: 0.12, r: 0.4, color: "16,20,72", speed: 0.27, phase: 4.2, ampX: 0.12, ampY: 0.06 },
  { x: 0.88, y: 0.82, r: 0.3, color: "200,255,46", speed: 0.12, phase: 1.2, ampX: 0.05, ampY: 0.07 },
];

function drawScene(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.globalCompositeOperation = "source-over";
  const base = ctx.createLinearGradient(0, 0, 0, h);
  base.addColorStop(0, "#0a0d24");
  base.addColorStop(0.55, "#0b0b0d");
  base.addColorStop(1, "#050506");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  ctx.globalCompositeOperation = "screen";
  for (const b of BLOBS) {
    const cx = (b.x + Math.sin(t * b.speed + b.phase) * b.ampX) * w;
    const cy = (b.y + Math.cos(t * b.speed * 0.9 + b.phase) * b.ampY) * h;
    const r = b.r * Math.max(w, h);
    const alpha = b.color === "200,255,46" ? 0.1 : 0.5;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, `rgba(${b.color},${alpha})`);
    g.addColorStop(0.6, `rgba(${b.color},${alpha * 0.35})`);
    g.addColorStop(1, `rgba(${b.color},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  }

  // vignette
  ctx.globalCompositeOperation = "source-over";
  const v = ctx.createRadialGradient(w / 2, h * 0.42, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.85);
  v.addColorStop(0, "rgba(5,5,6,0)");
  v.addColorStop(1, "rgba(5,5,6,0.72)");
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, w, h);
}

function HeroScene({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement | null> }) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = prefersReducedMotion();
    let raf = 0;
    let running = false;
    let last = 0;

    const resize = () => {
      const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.75;
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * scale));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * scale));
      drawScene(ctx, canvas.width, canvas.height, performance.now() / 1000);
    };

    const loop = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      if (now - last < 33) return; // ~30fps is plenty for a gradient drift
      last = now;
      drawScene(ctx, canvas.width, canvas.height, now / 1000);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !document.hidden) start();
      else stop();
    });
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", resize);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}

/* ------------------------------------------------------------------------ */
/*  Hero                                                                     */
/* ------------------------------------------------------------------------ */

export default function Hero({ hasVideo }: { hasVideo: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sceneRef = useRef<HTMLCanvasElement>(null);
  const pixelRef = useRef<HTMLCanvasElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  const showVideo = hasVideo && !videoFailed;
  useInViewVideo(videoRef, showVideo);

  /* entry animation, synced with the loader shutter */
  useIsomorphicLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        gsap.set("[data-hero-line]", { yPercent: 118 });
        gsap.set("[data-hero-fade]", { autoAlpha: 0, y: 26 });
        gsap.set("[data-hero-mark]", { autoAlpha: 0, yPercent: 34 });

        const play = () => {
          gsap
            .timeline({ defaults: { ease: "power4.out" } })
            .to("[data-hero-line]", { yPercent: 0, duration: 1.15, stagger: 0.14 }, 0.05)
            .to("[data-hero-mark]", { autoAlpha: 1, yPercent: 0, duration: 1.25 }, 0.3)
            .to("[data-hero-fade]", { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.07 }, 0.45);
        };

        if (document.documentElement.dataset.loaded) play();
        else window.addEventListener(LOADER_DONE_EVENT, play, { once: true });
        return () => window.removeEventListener(LOADER_DONE_EVENT, play);
      },
      sectionRef
    );
    return () => mm.revert();
  }, []);

  /* pixelation hover: sample the hero media low-res and blow it back up */
  useEffect(() => {
    const section = sectionRef.current;
    const overlay = pixelRef.current;
    const octx = overlay?.getContext("2d");
    if (!section || !overlay || !octx) return;
    if (!window.matchMedia("(pointer: fine)").matches || prefersReducedMotion()) return;

    const buffer = document.createElement("canvas");
    const bctx = buffer.getContext("2d");
    if (!bctx) return;

    const cell = { size: 1 };
    let raf = 0;
    let running = false;

    const sourceEl = (): HTMLVideoElement | HTMLCanvasElement | null => {
      const video = videoRef.current;
      if (video && video.readyState >= 2) return video;
      return sceneRef.current;
    };
    const sourceSize = (src: HTMLVideoElement | HTMLCanvasElement) =>
      src instanceof HTMLVideoElement
        ? { sw: src.videoWidth, sh: src.videoHeight }
        : { sw: src.width, sh: src.height };

    const draw = () => {
      const src = sourceEl();
      if (!src) return;
      const { sw, sh } = sourceSize(src);
      if (!sw || !sh) return;
      const w = overlay.width;
      const h = overlay.height;
      const cs = Math.max(1, cell.size);
      const tw = Math.max(1, Math.round(w / cs));
      const th = Math.max(1, Math.round(h / cs));
      if (buffer.width !== tw || buffer.height !== th) {
        buffer.width = tw;
        buffer.height = th;
      }
      // object-cover crop from the source into the tiny buffer
      const scale = Math.max(w / sw, h / sh);
      const cw = w / scale;
      const ch = h / scale;
      bctx.drawImage(src, (sw - cw) / 2, (sh - ch) / 2, cw, ch, 0, 0, tw, th);
      octx.imageSmoothingEnabled = false;
      octx.clearRect(0, 0, w, h);
      octx.drawImage(buffer, 0, 0, tw, th, 0, 0, w, h);
    };

    const loop = () => {
      if (!running) return;
      draw();
      raf = requestAnimationFrame(loop);
    };

    const resize = () => {
      overlay.width = section.clientWidth;
      overlay.height = section.clientHeight;
    };
    resize();

    const enter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      resize();
      gsap.killTweensOf(cell);
      overlay.style.opacity = "1";
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
      gsap.to(cell, { size: 22, duration: 0.9, ease: "power2.out" });
    };
    const leave = () => {
      gsap.killTweensOf(cell);
      gsap.to(cell, {
        size: 1,
        duration: 0.65,
        ease: "power2.inOut",
        onComplete: () => {
          running = false;
          cancelAnimationFrame(raf);
          overlay.style.opacity = "0";
        },
      });
    };

    section.addEventListener("pointerenter", enter);
    section.addEventListener("pointerleave", leave);
    window.addEventListener("resize", resize);
    return () => {
      section.removeEventListener("pointerenter", enter);
      section.removeEventListener("pointerleave", leave);
      window.removeEventListener("resize", resize);
      gsap.killTweensOf(cell);
      running = false;
      cancelAnimationFrame(raf);
    };
  }, [showVideo]);

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-label="Intro"
      className="relative flex h-[100svh] min-h-[700px] flex-col overflow-hidden bg-ink text-white"
    >
      {/* media */}
      <div className="absolute inset-0">
        {showVideo ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={hero.video}
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoFailed(true)}
          />
        ) : (
          <HeroScene canvasRef={sceneRef} />
        )}
      </div>

      {/* pixelation overlay */}
      <canvas
        ref={pixelRef}
        aria-hidden="true"
        className="pixel-overlay pointer-events-none absolute inset-0 z-[1] h-full w-full opacity-0 transition-opacity duration-300"
      />

      {/* navy/black wash for legibility */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,5,6,0.52) 0%, rgba(5,5,6,0.1) 36%, rgba(5,5,6,0.35) 70%, rgba(7,8,26,0.82) 100%), linear-gradient(100deg, rgba(5,5,6,0.55) 0%, rgba(5,5,6,0) 48%), radial-gradient(110% 80% at 85% 0%, rgba(21,27,74,0.4), rgba(21,27,74,0) 60%)",
        }}
      />

      {/* content */}
      <div className="gutter relative z-10 flex h-full flex-col pt-[104px] pb-0">
        <div className="type-label flex items-start justify-between gap-4 text-white/60">
          <span data-hero-fade>{hero.microLeft}</span>
          <span data-hero-fade className="hidden text-right sm:inline">
            {hero.microRight}
          </span>
        </div>

        <div className="my-auto max-w-[900px] pt-10">
          <p data-hero-fade className="type-label mb-6 text-acid">
            {hero.eyebrow}
          </p>
          <h1 className="type-hero">
            {hero.headline.map((line) => (
              <span key={line} className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
                <span data-hero-line className="block will-change-transform">
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <p
            data-hero-fade
            className="mt-7 max-w-[560px] text-[0.95rem] leading-relaxed text-white/75"
          >
            {hero.description}
          </p>
        </div>

        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div
            aria-hidden="true"
            data-hero-mark
            className="type-wordmark order-last -mb-[0.06em] select-none text-acid md:order-first"
          >
            {hero.wordmark}
          </div>
          <div
            data-hero-fade
            className="pill self-end !border-white/20 bg-white/10 backdrop-blur-sm md:mb-[1.6vw] md:shrink-0"
          >
            <span className="relative flex size-2">
              <span className="pulse-dot absolute inset-0 rounded-full bg-acid" />
              <span className="relative size-2 rounded-full bg-acid" />
            </span>
            {hero.status}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

export type BackgroundVariant =
  | "hero"
  | "profile"
  | "runs"
  | "loadout"
  | "log"
  | "comm"
  | "outro";

/* One color language everywhere: cyan + magenta neon over blue-white haze. */
const CYAN = "0,229,255";
const MAGENTA = "255,46,136";
const HAZE = "168,198,228";

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];

type Ctx2D = CanvasRenderingContext2D;

interface Renderer {
  draw(ctx: Ctx2D, t: number, dt: number): void;
  drawStatic(ctx: Ctx2D): void;
  /** called when the section re-enters the viewport */
  reset?(t: number): void;
  /** set true when a one-shot sequence (outro power-down) has ended */
  finished?: boolean;
}

/* ------------------------------------------------------------------ */
/* hero — slow neon rain / data streaks with depth via speed + alpha   */
/* ------------------------------------------------------------------ */
function createRain(w: number, h: number): Renderer {
  type Drop = { x: number; y: number; len: number; vy: number; a: number; col: string };
  const col = () => {
    const r = Math.random();
    if (r < 0.1) return MAGENTA;
    if (r < 0.26) return CYAN;
    return HAZE;
  };
  const spawn = (initial: boolean): Drop => ({
    x: rand(-60, w + 60),
    y: initial ? rand(0, h) : rand(-190, -60),
    len: rand(30, 110),
    vy: rand(120, 290),
    a: rand(0.05, 0.2),
    col: col(),
  });
  const drops = Array.from(
    { length: Math.round(Math.min(Math.max(w / (w < 768 ? 26 : 20), 24), 80)) },
    () => spawn(true)
  );

  const paint = (ctx: Ctx2D) => {
    ctx.lineWidth = 1;
    for (const d of drops) {
      const vx = d.vy * 0.16;
      ctx.strokeStyle = `rgba(${d.col},${d.a})`;
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - vx * (d.len / d.vy), d.y - d.len);
      ctx.stroke();
    }
  };

  return {
    draw(ctx, _t, dt) {
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        d.y += d.vy * dt;
        d.x += d.vy * 0.16 * dt;
        if (d.y - d.len > h) drops[i] = spawn(false);
      }
      paint(ctx);
    },
    drawStatic(ctx) {
      paint(ctx);
    },
  };
}

/* ------------------------------------------------------------------ */
/* profile — circuit traces pinging outward from nodes + slow sweep    */
/* ------------------------------------------------------------------ */
function createCircuit(w: number, h: number): Renderer {
  type Trace = {
    pts: { x: number; y: number }[];
    lens: number[];
    total: number;
    p: number;
    speed: number;
    fade: number;
    col: string;
  };

  const genTrace = (): Trace => {
    let x = rand(w * 0.06, w * 0.94);
    let y = rand(h * 0.08, h * 0.92);
    const pts = [{ x, y }];
    let dir = pick([0, 45, 90, 135, 180, 225, 270, 315]);
    const n = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      const len = rand(26, 84);
      const r = (dir * Math.PI) / 180;
      x += Math.cos(r) * len;
      y += Math.sin(r) * len;
      pts.push({ x, y });
      dir += pick([-90, -45, 45, 90]);
    }
    const lens: number[] = [];
    let total = 0;
    for (let i = 1; i < pts.length; i++) {
      const l = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
      lens.push(l);
      total += l;
    }
    return {
      pts,
      lens,
      total,
      p: 0,
      speed: rand(0.4, 0.7),
      fade: 1,
      col: Math.random() < 0.2 ? MAGENTA : CYAN,
    };
  };

  const dots = Array.from({ length: 26 }, () => ({
    x: rand(0, w),
    y: rand(0, h),
    a: rand(0.03, 0.07),
  }));
  let traces: Trace[] = [];
  let nextSpawn = 0;

  const strokeTrace = (ctx: Ctx2D, tr: Trace, headGlow: boolean) => {
    const target = tr.p * tr.total;
    ctx.strokeStyle = `rgba(${tr.col},${0.09 * tr.fade})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(tr.pts[0].x, tr.pts[0].y);
    let run = 0;
    let head = tr.pts[0];
    for (let i = 1; i < tr.pts.length; i++) {
      const seg = tr.lens[i - 1];
      if (run + seg <= target) {
        ctx.lineTo(tr.pts[i].x, tr.pts[i].y);
        head = tr.pts[i];
        run += seg;
      } else {
        const k = (target - run) / seg;
        head = {
          x: tr.pts[i - 1].x + (tr.pts[i].x - tr.pts[i - 1].x) * k,
          y: tr.pts[i - 1].y + (tr.pts[i].y - tr.pts[i - 1].y) * k,
        };
        ctx.lineTo(head.x, head.y);
        break;
      }
    }
    ctx.stroke();
    // origin node + bright head
    ctx.fillStyle = `rgba(${tr.col},${0.35 * tr.fade})`;
    ctx.fillRect(tr.pts[0].x - 1.5, tr.pts[0].y - 1.5, 3, 3);
    if (headGlow && tr.p < 1) {
      ctx.fillStyle = `rgba(${tr.col},${0.5 * tr.fade})`;
      ctx.fillRect(head.x - 1, head.y - 1, 2, 2);
    }
  };

  return {
    draw(ctx, t, dt) {
      ctx.fillStyle = `rgba(${HAZE},0.05)`;
      for (const d of dots) {
        ctx.globalAlpha = d.a / 0.05;
        ctx.fillRect(d.x, d.y, 1.4, 1.4);
      }
      ctx.globalAlpha = 1;

      if (t >= nextSpawn && traces.length < 7) {
        traces.push(genTrace());
        nextSpawn = t + rand(1.2, 2.4);
      }
      for (const tr of traces) {
        if (tr.p < 1) tr.p = Math.min(1, tr.p + tr.speed * dt);
        else tr.fade -= dt * 0.55;
        strokeTrace(ctx, tr, true);
      }
      traces = traces.filter((tr) => tr.fade > 0);

      // slow scanline sweep, top to bottom (~16s per pass)
      const band = 110;
      const y = ((t * 34) % (h + band * 2)) - band;
      const g = ctx.createLinearGradient(0, y, 0, y + band);
      g.addColorStop(0, `rgba(${CYAN},0)`);
      g.addColorStop(0.5, `rgba(${CYAN},0.035)`);
      g.addColorStop(1, `rgba(${CYAN},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, y, w, band);
    },
    drawStatic(ctx) {
      ctx.fillStyle = `rgba(${HAZE},0.05)`;
      for (const d of dots) ctx.fillRect(d.x, d.y, 1.4, 1.4);
      for (let i = 0; i < 4; i++) {
        const tr = genTrace();
        tr.p = 1;
        strokeTrace(ctx, tr, false);
      }
    },
  };
}

/* ------------------------------------------------------------------ */
/* runs — perspective data-floor grid with a slow forward drift        */
/* ------------------------------------------------------------------ */
function createGrid(w: number, h: number): Renderer {
  const horizon = h * 0.36;
  const vpX = w / 2;
  const V = 22;
  const ROWS = 13;
  const stars = Array.from({ length: 30 }, () => ({
    x: rand(0, w),
    y: rand(0, horizon * 0.95),
    a: rand(0.03, 0.08),
  }));

  const paint = (ctx: Ctx2D, phase: number) => {
    ctx.fillStyle = `rgba(${HAZE},1)`;
    for (const s of stars) {
      ctx.globalAlpha = s.a;
      ctx.fillRect(s.x, s.y, 1.3, 1.3);
    }
    ctx.globalAlpha = 1;

    // horizon glow line
    ctx.strokeStyle = `rgba(${CYAN},0.1)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, horizon);
    ctx.lineTo(w, horizon);
    ctx.stroke();

    // fan of verticals converging on the vanishing point
    for (let i = 0; i <= V; i++) {
      const xB = (i / V) * (w * 1.9) - w * 0.45;
      const xT = vpX + (xB - vpX) * 0.04;
      ctx.strokeStyle = `rgba(${CYAN},0.045)`;
      ctx.beginPath();
      ctx.moveTo(xT, horizon);
      ctx.lineTo(xB, h);
      ctx.stroke();
    }

    // horizontals drifting toward the viewer
    for (let i = 0; i < ROWS; i++) {
      const z = (i / ROWS + phase) % 1;
      const y = horizon + Math.pow(z, 2.4) * (h - horizon);
      const col = i % 5 === 0 ? MAGENTA : CYAN;
      ctx.strokeStyle = `rgba(${col},${0.02 + z * 0.085})`;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  };

  return {
    draw(ctx, t) {
      paint(ctx, (t * 0.045) % 1); // ~22s per grid cycle
    },
    drawStatic(ctx) {
      paint(ctx, 0.4);
    },
  };
}

/* ------------------------------------------------------------------ */
/* loadout — sparse code glyphs drifting upward, programs compiling    */
/* ------------------------------------------------------------------ */
function createGlyphs(w: number, h: number, mono: string): Renderer {
  const CHARS = "01<>/[]{}=+*#:;ｱｲｳｶｷｸｹｼﾂﾃﾅﾗﾝ".split("");
  type Glyph = {
    x: number;
    y: number;
    vy: number;
    size: number;
    a: number;
    ch: string;
    col: string;
    swap: number;
  };
  const spawn = (initial: boolean): Glyph => ({
    x: rand(0, w),
    y: initial ? rand(0, h) : h + rand(10, 60),
    vy: rand(9, 24),
    size: rand(9, 13),
    a: Math.random() < 0.12 ? rand(0.16, 0.26) : rand(0.04, 0.12),
    ch: pick(CHARS),
    col: Math.random() < 0.16 ? CYAN : HAZE,
    swap: rand(1, 3),
  });
  const glyphs = Array.from(
    { length: Math.round(Math.min(Math.max(w / 26, 26), 58)) },
    () => spawn(true)
  );

  const paint = (ctx: Ctx2D) => {
    for (const g of glyphs) {
      ctx.font = `${g.size}px ${mono}`;
      ctx.fillStyle = `rgba(${g.col},${g.a})`;
      ctx.fillText(g.ch, g.x, g.y);
    }
  };

  return {
    draw(ctx, _t, dt) {
      for (let i = 0; i < glyphs.length; i++) {
        const g = glyphs[i];
        g.y -= g.vy * dt;
        g.swap -= dt;
        if (g.swap <= 0) {
          g.ch = pick(CHARS);
          g.swap = rand(1, 3);
        }
        if (g.y < -20) glyphs[i] = spawn(false);
      }
      paint(ctx);
    },
    drawStatic(ctx) {
      paint(ctx);
    },
  };
}

/* ------------------------------------------------------------------ */
/* log — EKG / network-activity trace running behind the timeline      */
/* ------------------------------------------------------------------ */
function createWave(w: number, h: number): Renderer {
  const baseY = h * 0.44;
  const P = 300; // spike period in px

  const spike = (p: number) => {
    if (p < 6) return -p * 2.4;
    if (p < 14) return -14.4 + (p - 6) * 5.4;
    if (p < 24) return 28.8 - (p - 14) * 3.4;
    return 0;
  };
  const wave = (x: number, phase: number) => {
    const u = x + phase;
    return Math.sin(u * 0.016) * 4 + spike(((u % P) + P) % P) * 0.85;
  };

  const stroke = (ctx: Ctx2D, phase: number, y0: number, col: string, a: number) => {
    ctx.strokeStyle = `rgba(${col},${a})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 5) {
      const y = y0 + wave(x, phase);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  const paint = (ctx: Ctx2D, t: number) => {
    const phase = t * 42;
    stroke(ctx, phase, baseY, CYAN, 0.11);
    stroke(ctx, phase + 60, baseY + 18, MAGENTA, 0.05);

    // traveling pulse dot on the main trace
    const xd = ((t * 95) % (w + 60)) - 30;
    const yd = baseY + wave(xd, phase);
    for (const [r, a] of [
      [5, 0.06],
      [3, 0.16],
      [1.5, 0.45],
    ] as const) {
      ctx.fillStyle = `rgba(${CYAN},${a})`;
      ctx.beginPath();
      ctx.arc(xd, yd, r, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  return {
    draw(ctx, t) {
      paint(ctx, t);
    },
    drawStatic(ctx) {
      stroke(ctx, 40, baseY, CYAN, 0.11);
      stroke(ctx, 100, baseY + 18, MAGENTA, 0.05);
    },
  };
}

/* ------------------------------------------------------------------ */
/* comm — broadcast pulse rings + rare static interference bursts      */
/* ------------------------------------------------------------------ */
function createPulse(w: number, h: number): Renderer {
  const cx = w * 0.5;
  const cy = h * 0.52;
  const R = Math.min(w, h) * 0.62;
  const PERIOD = 5.4;
  const RINGS = 3;
  let burstUntil = -1;
  let nextBurst = rand(4, 8);

  const ring = (ctx: Ctx2D, prog: number, col: string) => {
    if (prog <= 0 || prog >= 1) return;
    ctx.strokeStyle = `rgba(${col},${0.13 * (1 - prog)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 8 + prog * R, 0, Math.PI * 2);
    ctx.stroke();
  };

  const paint = (ctx: Ctx2D, t: number) => {
    for (let k = 0; k < RINGS; k++) {
      const prog = ((t / PERIOD + k / RINGS) % 1 + 1) % 1;
      ring(ctx, prog, k === RINGS - 1 ? MAGENTA : CYAN);
    }
    // beacon dot
    ctx.fillStyle = `rgba(${CYAN},${0.22 + 0.12 * Math.sin(t * 2.4)})`;
    ctx.beginPath();
    ctx.arc(cx, cy, 2.2, 0, Math.PI * 2);
    ctx.fill();
  };

  return {
    draw(ctx, t) {
      paint(ctx, t);
      // occasional interference: a few frames of sparse static
      if (t >= nextBurst) {
        burstUntil = t + 0.13;
        nextBurst = t + rand(5, 9);
      }
      if (t < burstUntil) {
        ctx.fillStyle = `rgba(${HAZE},0.07)`;
        for (let i = 0; i < 110; i++) {
          ctx.fillRect(rand(0, w), rand(0, h), rand(1, 2), rand(1, 2));
        }
      }
    },
    drawStatic(ctx) {
      ring(ctx, 0.3, CYAN);
      ring(ctx, 0.65, CYAN);
      ring(ctx, 0.85, MAGENTA);
      ctx.fillStyle = `rgba(${CYAN},0.3)`;
      ctx.beginPath();
      ctx.arc(cx, cy, 2.2, 0, Math.PI * 2);
      ctx.fill();
    },
  };
}

/* ------------------------------------------------------------------ */
/* outro — the network powers down: particles decelerate, fade, then   */
/* a single CRT collapse line — and the loop stops for good.           */
/* ------------------------------------------------------------------ */
function createPowerDown(w: number, h: number): Renderer {
  type Mote = { x: number; y: number; vy: number; len: number; a: number; col: string };
  const gen = () =>
    Array.from({ length: 36 }, (): Mote => ({
      x: rand(0, w),
      y: rand(0, h),
      vy: rand(40, 120),
      len: rand(10, 40),
      a: rand(0.05, 0.16),
      col: Math.random() < 0.18 ? (Math.random() < 0.5 ? CYAN : MAGENTA) : HAZE,
    }));

  let motes = gen();
  let start = 0;
  const DECAY = 3.4; // seconds until fully powered down
  const self: Renderer = {
    finished: false,
    reset(t) {
      start = t;
      motes = gen();
      self.finished = false;
    },
    draw(ctx, t, dt) {
      const e = Math.max(0, 1 - (t - start) / DECAY); // energy 1 → 0
      ctx.lineWidth = 1;
      for (const m of motes) {
        m.y += m.vy * e * dt;
        if (m.y - m.len > h) m.y = -m.len;
        ctx.strokeStyle = `rgba(${m.col},${m.a * e})`;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x, m.y - m.len * (0.3 + 0.7 * e));
        ctx.stroke();
      }
      // CRT collapse flash once the particles die
      const flash = t - start - DECAY;
      if (flash >= 0) {
        const a = Math.max(0, 0.4 - flash * 0.9);
        if (a > 0) {
          const g = ctx.createLinearGradient(0, 0, w, 0);
          g.addColorStop(0, `rgba(${CYAN},0)`);
          g.addColorStop(0.5, `rgba(${CYAN},${a})`);
          g.addColorStop(1, `rgba(${CYAN},0)`);
          ctx.fillStyle = g;
          ctx.fillRect(0, h * 0.5 - 1, w, 2);
        } else {
          self.finished = true;
        }
      }
    },
    drawStatic(ctx) {
      ctx.fillStyle = `rgba(${HAZE},0.06)`;
      for (const m of motes.slice(0, 16)) ctx.fillRect(m.x, m.y, 1.4, 1.4);
    },
  };
  return self;
}

/* ------------------------------------------------------------------ */

function createRenderer(variant: BackgroundVariant, w: number, h: number, mono: string): Renderer {
  switch (variant) {
    case "hero":
      return createRain(w, h);
    case "profile":
      return createCircuit(w, h);
    case "runs":
      return createGrid(w, h);
    case "loadout":
      return createGlyphs(w, h, mono);
    case "log":
      return createWave(w, h);
    case "comm":
      return createPulse(w, h);
    case "outro":
      return createPowerDown(w, h);
  }
}

/**
 * Ambient animated backdrop for a sector — one shared engine, themed per
 * variant. Sticky viewport-sized canvas (tall sections stay cheap), runs
 * only while within 200px of the viewport, pauses on hidden tabs, and
 * renders a single static frame under prefers-reduced-motion.
 */
const SectionBackground = ({
  variant,
  className = "",
}: {
  variant: BackgroundVariant;
  className?: string;
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    const mono =
      getComputedStyle(document.body).getPropertyValue("--font-mono").trim() ||
      '"IBM Plex Mono", monospace';

    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;
    let t = 0;
    let last = 0;
    let renderer: Renderer | null = null;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      w = rect.width;
      h = Math.min(rect.height, window.innerHeight);
      if (w === 0 || h === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      renderer = createRenderer(variant, w, h, mono);
      renderer.reset?.(t);
      if (reduced) {
        ctx.clearRect(0, 0, w, h);
        renderer.drawStatic(ctx);
      }
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;
      ctx.clearRect(0, 0, w, h);
      renderer?.draw(ctx, t, dt);
      if (renderer?.finished) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf || reduced || !visible || document.hidden || renderer?.finished) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        const was = visible;
        visible = entry.isIntersecting;
        if (visible && !was) {
          renderer?.reset?.(t);
          start();
        }
        if (!visible) stop();
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(wrap);

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    resize();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [variant]);

  return (
    <div
      ref={wrapRef}
      className={`seam-clip pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <canvas ref={canvasRef} className="sticky top-0 block" />
    </div>
  );
};

export default SectionBackground;

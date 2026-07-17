"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import { ZONES, type ZoneId } from "@/config/zones";

export type BackgroundVariant = ZoneId;

/**
 * One scene engine, eight genuinely different games. Each renderer paints
 * that genre's atmosphere — a versus-screen spotlight, a starfield, a
 * bright cloud sky, a radar, bokeh — in the zone's own palette. Canvas is
 * sticky viewport-sized, runs only near the viewport, pauses on hidden
 * tabs, and renders one static frame under prefers-reduced-motion.
 */
type Palette = { a: string; b: string };

const rand = (a: number, b: number) => a + Math.random() * (b - a);

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
/* home — console ambient: slow particle field + drifting light band   */
/* ------------------------------------------------------------------ */
function createAmbient(w: number, h: number, pal: Palette): Renderer {
  type Mote = { x: number; y: number; r: number; vx: number; vy: number; a: number; col: string };
  const motes = Array.from({ length: Math.round(Math.min(Math.max(w / 30, 22), 54)) }, (): Mote => ({
    x: rand(0, w),
    y: rand(0, h),
    r: rand(0.8, 2.2),
    vx: rand(-6, 6),
    vy: rand(-10, -3),
    a: rand(0.05, 0.2),
    col: Math.random() < 0.3 ? pal.a : "182, 200, 226",
  }));

  const paint = (ctx: Ctx2D, t: number) => {
    for (const m of motes) {
      const tw = 0.7 + 0.3 * Math.sin(t * 1.4 + m.x);
      ctx.fillStyle = `rgba(${m.col},${m.a * tw})`;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
    }
    const band = 220;
    const y = ((t * 16) % (h + band * 2)) - band;
    const g = ctx.createLinearGradient(0, y, 0, y + band);
    g.addColorStop(0, `rgba(${pal.a},0)`);
    g.addColorStop(0.5, `rgba(${pal.a},0.03)`);
    g.addColorStop(1, `rgba(${pal.a},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, y, w, band);
  };

  return {
    draw(ctx, t, dt) {
      for (const m of motes) {
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        if (m.y < -6) { m.y = h + 6; m.x = rand(0, w); }
        if (m.x < -6) m.x = w + 6;
        if (m.x > w + 6) m.x = -6;
      }
      paint(ctx, t);
    },
    drawStatic(ctx) {
      paint(ctx, 2);
    },
  };
}

/* ------------------------------------------------------------------ */
/* hero — versus screen: pulsing stage spotlight, crowd silhouettes    */
/* with camera flashes, one-shot diagonal VS energy burst on entry     */
/* ------------------------------------------------------------------ */
function createArena(w: number, h: number, pal: Palette): Renderer {
  // crowd: deterministic-ish bumps along the bottom
  const heads: { x: number; r: number }[] = [];
  for (let x = -10; x < w + 10; x += rand(14, 26)) {
    heads.push({ x, r: rand(7, 14) });
  }
  type Flash = { x: number; y: number; born: number };
  let flashes: Flash[] = [];
  let nextFlash = 0;

  let burstStart = 0.2; // one-shot on entry / re-entry

  const paintSpot = (ctx: Ctx2D, t: number) => {
    const pulse = 0.85 + 0.15 * Math.sin(t * 1.6);
    const R = Math.min(w, h) * 0.75 * pulse;
    const cx = w * 0.5;
    const cy = h * 0.34;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    g.addColorStop(0, `rgba(${pal.b},0.16)`);
    g.addColorStop(0.4, `rgba(${pal.a},0.07)`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
    // spotlight cone rays
    ctx.fillStyle = `rgba(${pal.b},0.03)`;
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.05, -10);
    ctx.lineTo(cx + w * 0.05, -10);
    ctx.lineTo(cx + w * 0.3, h);
    ctx.lineTo(cx - w * 0.3, h);
    ctx.closePath();
    ctx.fill();
  };

  const paintCrowd = (ctx: Ctx2D) => {
    ctx.fillStyle = "rgba(6, 3, 4, 0.85)";
    ctx.beginPath();
    ctx.moveTo(-20, h + 20);
    for (const hd of heads) {
      ctx.arc(hd.x, h - hd.r * 0.6, hd.r, Math.PI, 0);
    }
    ctx.lineTo(w + 20, h + 20);
    ctx.closePath();
    ctx.fill();
  };

  return {
    reset(t) {
      burstStart = t + 0.15;
    },
    draw(ctx, t, dt) {
      void dt;
      paintSpot(ctx, t);

      // one-shot diagonal energy burst (VS clash) shortly after entry
      const bp = (t - burstStart) / 0.7;
      if (bp > 0 && bp < 1) {
        const fade = Math.sin(bp * Math.PI);
        ctx.lineWidth = 2;
        for (const [dir, col] of [
          [1, pal.a],
          [-1, pal.b],
        ] as const) {
          const x = w * 0.5 + dir * (0.1 + bp * 0.55) * w;
          ctx.strokeStyle = `rgba(${col},${0.5 * fade})`;
          ctx.beginPath();
          ctx.moveTo(x - 220 * dir, h * 0.7);
          ctx.lineTo(x, h * 0.22);
          ctx.stroke();
        }
      }

      // crowd camera flashes
      if (t >= nextFlash) {
        flashes.push({ x: rand(w * 0.05, w * 0.95), y: h - rand(6, 26), born: t });
        nextFlash = t + rand(0.5, 1.6);
      }
      for (const f of flashes) {
        const p = (t - f.born) / 0.35;
        if (p >= 1) continue;
        const a = Math.sin(p * Math.PI) * 0.7;
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, 16);
        g.addColorStop(0, `rgba(255,246,230,${a})`);
        g.addColorStop(1, "rgba(255,246,230,0)");
        ctx.fillStyle = g;
        ctx.fillRect(f.x - 16, f.y - 16, 32, 32);
      }
      flashes = flashes.filter((f) => t - f.born < 0.35);

      paintCrowd(ctx);
    },
    drawStatic(ctx) {
      paintSpot(ctx, 1);
      paintCrowd(ctx);
    },
  };
}

/* ------------------------------------------------------------------ */
/* profile — night quest: drifting starfield + slow-rising gold motes  */
/* ------------------------------------------------------------------ */
function createQuestNight(w: number, h: number, pal: Palette): Renderer {
  const stars = Array.from({ length: Math.round(Math.min(Math.max(w / 12, 50), 130)) }, () => ({
    x: rand(0, w),
    y: rand(0, h),
    r: rand(0.5, 1.6),
    a: rand(0.15, 0.7),
    tw: rand(0.6, 2.2),
    v: rand(1.5, 5),
  }));
  type Mote = { x: number; y: number; vy: number; sway: number; r: number; a: number };
  const spawn = (initial: boolean): Mote => ({
    x: rand(0, w),
    y: initial ? rand(0, h) : h + rand(6, 40),
    vy: rand(8, 22),
    sway: rand(0.5, 1.6),
    r: rand(1, 2.6),
    a: rand(0.2, 0.55),
  });
  const motes = Array.from({ length: Math.round(Math.min(Math.max(w / 70, 10), 22)) }, () => spawn(true));

  const paintStars = (ctx: Ctx2D, t: number) => {
    for (const s of stars) {
      const tw = 0.55 + 0.45 * Math.sin(t * s.tw + s.x);
      ctx.fillStyle = `rgba(226, 234, 255, ${s.a * tw * 0.5})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  return {
    draw(ctx, t, dt) {
      for (const s of stars) {
        s.x -= s.v * dt;
        if (s.x < -3) s.x = w + 3;
      }
      paintStars(ctx, t);
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        m.y -= m.vy * dt;
        m.x += Math.sin(t * m.sway + i) * 10 * dt;
        if (m.y < -8) motes[i] = spawn(false);
        const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 4);
        g.addColorStop(0, `rgba(${pal.a},${m.a})`);
        g.addColorStop(1, `rgba(${pal.a},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(m.x - m.r * 4, m.y - m.r * 4, m.r * 8, m.r * 8);
      }
    },
    drawStatic(ctx) {
      paintStars(ctx, 1);
    },
  };
}

/* ------------------------------------------------------------------ */
/* works — bright overworld: puffy white clouds on the sky, occasional */
/* coin glints; the sun + hills are DOM parallax layers in the section */
/* ------------------------------------------------------------------ */
function createOverworld(w: number, h: number, pal: Palette): Renderer {
  type Cloud = { x: number; y: number; s: number; v: number; a: number };
  const clouds = Array.from({ length: Math.round(Math.min(Math.max(w / 150, 6), 11)) }, (): Cloud => ({
    x: rand(-120, w + 120),
    y: rand(h * 0.03, h * 0.6),
    s: rand(34, 96),
    v: rand(6, 18),
    a: rand(0.5, 0.9),
  }));
  type Coin = { x: number; y: number; born: number; life: number };
  let coins: Coin[] = [];
  let nextCoin = 0;

  const drawCloud = (ctx: Ctx2D, c: Cloud) => {
    ctx.fillStyle = `rgba(255, 255, 255, ${c.a})`;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.s * 0.5, 0, Math.PI * 2);
    ctx.arc(c.x + c.s * 0.48, c.y + c.s * 0.12, c.s * 0.38, 0, Math.PI * 2);
    ctx.arc(c.x - c.s * 0.48, c.y + c.s * 0.14, c.s * 0.34, 0, Math.PI * 2);
    ctx.arc(c.x + c.s * 0.1, c.y - c.s * 0.18, c.s * 0.4, 0, Math.PI * 2);
    ctx.fill();
    // flat cloud base
    ctx.fillRect(c.x - c.s * 0.62, c.y + c.s * 0.05, c.s * 1.24, c.s * 0.32);
  };

  return {
    draw(ctx, t, dt) {
      for (const c of clouds) {
        c.x += c.v * dt;
        if (c.x - c.s > w + 80) c.x = -c.s - 80;
        drawCloud(ctx, c);
      }
      if (t >= nextCoin) {
        coins.push({ x: rand(w * 0.06, w * 0.94), y: rand(h * 0.1, h * 0.8), born: t, life: 1.1 });
        nextCoin = t + rand(1.4, 3);
      }
      for (const c of coins) {
        const p = (t - c.born) / c.life;
        const a = Math.sin(p * Math.PI) * 0.85;
        ctx.strokeStyle = `rgba(${pal.b},${a})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        const squish = Math.abs(Math.cos(p * Math.PI * 2));
        ctx.ellipse(c.x, c.y, 5 * Math.max(squish, 0.12), 5, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      coins = coins.filter((c) => t - c.born < c.life);
    },
    drawStatic(ctx) {
      for (const c of clouds) drawCloud(ctx, c);
    },
  };
}

/* ------------------------------------------------------------------ */
/* services — tactical: grid + radar sweep with blips + smoke wisps    */
/* ------------------------------------------------------------------ */
function createRadar(w: number, h: number, pal: Palette): Renderer {
  const cx = w * 0.78;
  const cy = h * 0.42;
  const R = Math.min(w, h) * 0.42;
  const CELL = 64;
  const blips = Array.from({ length: 6 }, () => ({
    ang: rand(0, Math.PI * 2),
    r: rand(R * 0.2, R * 0.92),
  }));
  type Wisp = { x: number; y: number; r: number; vx: number; a: number };
  const wisps = Array.from({ length: 7 }, (): Wisp => ({
    x: rand(0, w),
    y: rand(h * 0.3, h),
    r: rand(60, 160),
    vx: rand(4, 12),
    a: rand(0.015, 0.04),
  }));

  const paintGrid = (ctx: Ctx2D) => {
    ctx.strokeStyle = `rgba(${pal.b},0.05)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= w; x += CELL) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
    }
    for (let y = 0; y <= h; y += CELL) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();
    ctx.strokeStyle = `rgba(${pal.a},0.08)`;
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, (R * i) / 3, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  return {
    draw(ctx, t, dt) {
      // smoke/dust wisps drifting
      for (const wd of wisps) {
        wd.x += wd.vx * dt;
        if (wd.x - wd.r > w) wd.x = -wd.r;
        const g = ctx.createRadialGradient(wd.x, wd.y, 0, wd.x, wd.y, wd.r);
        g.addColorStop(0, `rgba(${pal.b},${wd.a})`);
        g.addColorStop(1, `rgba(${pal.b},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(wd.x - wd.r, wd.y - wd.r, wd.r * 2, wd.r * 2);
      }
      paintGrid(ctx);
      const sweep = t * 0.9;
      for (let i = 0; i < 22; i++) {
        const a = sweep - i * 0.035;
        ctx.strokeStyle = `rgba(${pal.a},${0.1 * (1 - i / 22)})`;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
        ctx.stroke();
      }
      for (const b of blips) {
        const diff = ((sweep - b.ang) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
        const glow = Math.max(0, 1 - diff / 1.6);
        if (glow > 0.02) {
          ctx.fillStyle = `rgba(${pal.a},${0.5 * glow})`;
          ctx.beginPath();
          ctx.arc(cx + Math.cos(b.ang) * b.r, cy + Math.sin(b.ang) * b.r, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
    drawStatic(ctx) {
      paintGrid(ctx);
    },
  };
}

/* ------------------------------------------------------------------ */
/* journey — daylight circuit: soft motion streaks passing over white  */
/* (the road strip + kart live in the section as DOM/GSAP)             */
/* ------------------------------------------------------------------ */
function createSpeedway(w: number, h: number, pal: Palette): Renderer {
  type Streak = { x: number; y: number; len: number; v: number; a: number; col: string };
  const spawn = (initial: boolean): Streak => ({
    x: initial ? rand(0, w) : -rand(80, 240),
    y: rand(0, h),
    len: rand(50, 200),
    v: rand(280, 760),
    a: rand(0.04, 0.12),
    col: Math.random() < 0.25 ? pal.a : pal.b,
  });
  const streaks = Array.from(
    { length: Math.round(Math.min(Math.max(w / 48, 14), 30)) },
    () => spawn(true)
  );

  const paint = (ctx: Ctx2D) => {
    ctx.lineWidth = 2;
    for (const s of streaks) {
      const g = ctx.createLinearGradient(s.x - s.len, s.y, s.x, s.y);
      g.addColorStop(0, `rgba(${s.col},0)`);
      g.addColorStop(1, `rgba(${s.col},${s.a})`);
      ctx.strokeStyle = g;
      ctx.beginPath();
      ctx.moveTo(s.x - s.len, s.y);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
    }
  };

  return {
    draw(ctx, _t, dt) {
      for (let i = 0; i < streaks.length; i++) {
        const s = streaks[i];
        s.x += s.v * dt;
        if (s.x - s.len > w) streaks[i] = spawn(false);
      }
      paint(ctx);
    },
    drawStatic(ctx) {
      paint(ctx);
    },
  };
}

/* ------------------------------------------------------------------ */
/* contact — lobby bokeh: soft glowing orbs floating upward            */
/* ------------------------------------------------------------------ */
function createBokeh(w: number, h: number, pal: Palette): Renderer {
  type Orb = { x: number; y: number; r: number; vy: number; sway: number; a: number; col: string };
  const cols = [pal.a, pal.b, "255, 255, 255"];
  const spawn = (initial: boolean): Orb => ({
    x: rand(0, w),
    y: initial ? rand(0, h) : h + rand(20, 80),
    r: rand(5, 30),
    vy: rand(10, 30),
    sway: rand(0.4, 1.4),
    a: rand(0.08, 0.26),
    col: cols[Math.floor(rand(0, cols.length))],
  });
  const orbs = Array.from({ length: Math.round(Math.min(Math.max(w / 55, 14), 30)) }, () => spawn(true));

  const paintOrb = (ctx: Ctx2D, o: Orb, t: number, i: number) => {
    const x = o.x + Math.sin(t * o.sway + i) * 14;
    const g = ctx.createRadialGradient(x, o.y, 0, x, o.y, o.r);
    g.addColorStop(0, `rgba(${o.col},${o.a})`);
    g.addColorStop(0.7, `rgba(${o.col},${o.a * 0.4})`);
    g.addColorStop(1, `rgba(${o.col},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(x - o.r, o.y - o.r, o.r * 2, o.r * 2);
  };

  return {
    draw(ctx, t, dt) {
      for (let i = 0; i < orbs.length; i++) {
        const o = orbs[i];
        o.y -= o.vy * dt;
        if (o.y + o.r < -10) orbs[i] = spawn(false);
        paintOrb(ctx, o, t, i);
      }
    },
    drawStatic(ctx) {
      for (let i = 0; i < orbs.length; i++) paintOrb(ctx, orbs[i], 1, i);
    },
  };
}

/* ------------------------------------------------------------------ */
/* outro — the cabinet powers down: motes decelerate, then a single    */
/* CRT collapse line — and the loop stops for good.                    */
/* ------------------------------------------------------------------ */
function createPowerDown(w: number, h: number, pal: Palette): Renderer {
  type Mote = { x: number; y: number; vy: number; len: number; a: number; col: string };
  const gen = () =>
    Array.from({ length: 36 }, (): Mote => ({
      x: rand(0, w),
      y: rand(0, h),
      vy: rand(40, 120),
      len: rand(10, 40),
      a: rand(0.05, 0.16),
      col: Math.random() < 0.25 ? (Math.random() < 0.5 ? pal.a : pal.b) : "182, 200, 226",
    }));

  let motes = gen();
  let start = 0;
  const DECAY = 3.4;
  const self: Renderer = {
    finished: false,
    reset(t) {
      start = t;
      motes = gen();
      self.finished = false;
    },
    draw(ctx, t, dt) {
      const e = Math.max(0, 1 - (t - start) / DECAY);
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
      const flash = t - start - DECAY;
      if (flash >= 0) {
        const a = Math.max(0, 0.4 - flash * 0.9);
        if (a > 0) {
          const g = ctx.createLinearGradient(0, 0, w, 0);
          g.addColorStop(0, `rgba(${pal.a},0)`);
          g.addColorStop(0.5, `rgba(${pal.a},${a})`);
          g.addColorStop(1, `rgba(${pal.a},0)`);
          ctx.fillStyle = g;
          ctx.fillRect(0, h * 0.5 - 1, w, 2);
        } else {
          self.finished = true;
        }
      }
    },
    drawStatic(ctx) {
      ctx.fillStyle = "rgba(182, 200, 226, 0.06)";
      for (const m of motes.slice(0, 16)) ctx.fillRect(m.x, m.y, 1.4, 1.4);
    },
  };
  return self;
}

/* ------------------------------------------------------------------ */

function createRenderer(variant: BackgroundVariant, w: number, h: number, pal: Palette): Renderer {
  switch (variant) {
    case "home":
      return createAmbient(w, h, pal);
    case "hero":
      return createArena(w, h, pal);
    case "profile":
      return createQuestNight(w, h, pal);
    case "works":
      return createOverworld(w, h, pal);
    case "services":
      return createRadar(w, h, pal);
    case "journey":
      return createSpeedway(w, h, pal);
    case "contact":
      return createBokeh(w, h, pal);
    case "outro":
      return createPowerDown(w, h, pal);
  }
}

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
    const zone = ZONES[variant];
    const pal: Palette = { a: zone.primaryRgb, b: zone.secondaryRgb };

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
      renderer = createRenderer(variant, w, h, pal);
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

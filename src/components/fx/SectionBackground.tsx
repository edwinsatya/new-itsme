"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import { ZONES, type ZoneId } from "@/config/zones";

export type BackgroundVariant = ZoneId;

/**
 * One drawing language everywhere — thin lines, dots, soft glows — with
 * each game's palette injected per zone (see src/config/zones.ts).
 * `a` = primary accent, `b` = secondary; MIST is the shared cool-white
 * atmosphere that keeps every game feeling like the same console.
 */
type Palette = { a: string; b: string };
const MIST = "182, 200, 226";

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
/* home — console ambient: slow particle field + drifting light sweep  */
/* (PS5/Switch home-screen atmosphere)                                 */
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
    col: Math.random() < 0.25 ? pal.a : MIST,
  }));

  const paint = (ctx: Ctx2D, t: number) => {
    for (const m of motes) {
      const tw = 0.7 + 0.3 * Math.sin(t * 1.4 + m.x);
      ctx.fillStyle = `rgba(${m.col},${m.a * tw})`;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fill();
    }
    // wide horizontal light band drifting down, very soft
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
/* hero — fight arena: embers rising + hard diagonal speed slashes     */
/* ------------------------------------------------------------------ */
function createArena(w: number, h: number, pal: Palette): Renderer {
  type Ember = { x: number; y: number; vy: number; r: number; a: number; col: string };
  const spawn = (initial: boolean): Ember => ({
    x: rand(0, w),
    y: initial ? rand(0, h) : h + rand(4, 40),
    vy: rand(14, 46),
    r: rand(0.8, 2),
    a: rand(0.08, 0.3),
    col: Math.random() < 0.55 ? pal.a : pal.b,
  });
  const embers = Array.from(
    { length: Math.round(Math.min(Math.max(w / 34, 18), 46)) },
    () => spawn(true)
  );

  type Slash = { y: number; p: number; speed: number; col: string };
  let slashes: Slash[] = [];
  let nextSlash = rand(1.5, 3);

  const paintEmbers = (ctx: Ctx2D) => {
    for (const e of embers) {
      ctx.fillStyle = `rgba(${e.col},${e.a})`;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  return {
    draw(ctx, t, dt) {
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.y -= e.vy * dt;
        e.x += Math.sin(t * 1.2 + e.y * 0.02) * 8 * dt;
        if (e.y < -8) embers[i] = spawn(false);
      }
      paintEmbers(ctx);

      // diagonal slash streaks tearing across (fight-intro energy)
      if (t >= nextSlash && slashes.length < 3) {
        slashes.push({ y: rand(h * 0.12, h * 0.85), p: 0, speed: rand(1.6, 2.4), col: Math.random() < 0.5 ? pal.a : pal.b });
        nextSlash = t + rand(2.2, 4.5);
      }
      ctx.lineWidth = 1;
      for (const s of slashes) {
        s.p = Math.min(1, s.p + s.speed * dt);
        const fade = s.p < 0.5 ? 1 : 1 - (s.p - 0.5) * 2;
        const x = -w * 0.2 + s.p * w * 1.4;
        ctx.strokeStyle = `rgba(${s.col},${0.22 * fade})`;
        ctx.beginPath();
        ctx.moveTo(x - 160, s.y + 46);
        ctx.lineTo(x, s.y);
        ctx.stroke();
      }
      slashes = slashes.filter((s) => s.p < 1);
    },
    drawStatic(ctx) {
      paintEmbers(ctx);
    },
  };
}

/* ------------------------------------------------------------------ */
/* profile — RPG: floating gem diamonds + 4-point star twinkles        */
/* ------------------------------------------------------------------ */
function createRunes(w: number, h: number, pal: Palette): Renderer {
  type Gem = { x: number; y: number; s: number; vy: number; rot: number; vr: number; a: number; col: string };
  const spawn = (initial: boolean): Gem => ({
    x: rand(0, w),
    y: initial ? rand(0, h) : h + rand(10, 50),
    s: rand(3, 7),
    vy: rand(6, 16),
    rot: rand(0, Math.PI),
    vr: rand(-0.4, 0.4),
    a: rand(0.06, 0.2),
    col: Math.random() < 0.5 ? pal.a : pal.b,
  });
  const gems = Array.from({ length: Math.round(Math.min(Math.max(w / 60, 10), 24)) }, () => spawn(true));

  type Star = { x: number; y: number; born: number; life: number; s: number; col: string };
  let stars: Star[] = [];
  let nextStar = 0;

  const drawGem = (ctx: Ctx2D, g: Gem) => {
    ctx.save();
    ctx.translate(g.x, g.y);
    ctx.rotate(g.rot);
    ctx.strokeStyle = `rgba(${g.col},${g.a})`;
    ctx.lineWidth = 1;
    ctx.strokeRect(-g.s / 2, -g.s / 2, g.s, g.s);
    ctx.restore();
  };
  const drawStar = (ctx: Ctx2D, x: number, y: number, s: number, a: number, col: string) => {
    ctx.strokeStyle = `rgba(${col},${a})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - s, y);
    ctx.lineTo(x + s, y);
    ctx.moveTo(x, y - s);
    ctx.lineTo(x, y + s);
    ctx.stroke();
  };

  return {
    draw(ctx, t, dt) {
      for (let i = 0; i < gems.length; i++) {
        const g = gems[i];
        g.y -= g.vy * dt;
        g.rot += g.vr * dt;
        if (g.y < -12) gems[i] = spawn(false);
        drawGem(ctx, g);
      }
      if (t >= nextStar) {
        stars.push({ x: rand(w * 0.05, w * 0.95), y: rand(h * 0.05, h * 0.9), born: t, life: rand(0.8, 1.4), s: rand(3, 7), col: Math.random() < 0.6 ? pal.a : MIST });
        nextStar = t + rand(0.5, 1.4);
      }
      for (const s of stars) {
        const p = (t - s.born) / s.life;
        const a = Math.sin(Math.min(Math.max(p, 0), 1) * Math.PI) * 0.4;
        drawStar(ctx, s.x, s.y, s.s * (0.5 + p * 0.5), a, s.col);
      }
      stars = stars.filter((s) => t - s.born < s.life);
    },
    drawStatic(ctx) {
      for (const g of gems) drawGem(ctx, g);
      drawStar(ctx, w * 0.3, h * 0.3, 5, 0.3, pal.a);
      drawStar(ctx, w * 0.7, h * 0.6, 4, 0.25, MIST);
    },
  };
}

/* ------------------------------------------------------------------ */
/* works — platformer: parallax cloud banks + drifting coin glints     */
/* ------------------------------------------------------------------ */
function createOverworld(w: number, h: number, pal: Palette): Renderer {
  type Cloud = { x: number; y: number; s: number; v: number; a: number };
  const clouds = Array.from({ length: Math.round(Math.min(Math.max(w / 160, 5), 10)) }, (): Cloud => ({
    x: rand(-100, w + 100),
    y: rand(h * 0.04, h * 0.75),
    s: rand(30, 84),
    v: rand(4, 14),
    a: rand(0.025, 0.06),
  }));
  type Coin = { x: number; y: number; born: number; life: number };
  let coins: Coin[] = [];
  let nextCoin = 0;

  const drawCloud = (ctx: Ctx2D, c: Cloud) => {
    ctx.fillStyle = `rgba(${MIST},${c.a})`;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.s * 0.5, 0, Math.PI * 2);
    ctx.arc(c.x + c.s * 0.45, c.y + c.s * 0.1, c.s * 0.36, 0, Math.PI * 2);
    ctx.arc(c.x - c.s * 0.45, c.y + c.s * 0.12, c.s * 0.32, 0, Math.PI * 2);
    ctx.fill();
  };

  return {
    draw(ctx, t, dt) {
      for (const c of clouds) {
        c.x += c.v * dt;
        if (c.x - c.s > w + 60) c.x = -c.s - 60;
        drawCloud(ctx, c);
      }
      // coin glints: a small circle that pops with a shine tick
      if (t >= nextCoin) {
        coins.push({ x: rand(w * 0.06, w * 0.94), y: rand(h * 0.1, h * 0.85), born: t, life: 1.1 });
        nextCoin = t + rand(1.2, 2.6);
      }
      for (const c of coins) {
        const p = (t - c.born) / c.life;
        const a = Math.sin(p * Math.PI) * 0.5;
        ctx.strokeStyle = `rgba(${pal.b},${a})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        const squish = Math.abs(Math.cos(p * Math.PI * 2));
        ctx.ellipse(c.x, c.y, 4.5 * Math.max(squish, 0.12), 4.5, 0, 0, Math.PI * 2);
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
/* services — FPS: tactical grid + radar sweep with contact blips      */
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

  const paintGrid = (ctx: Ctx2D) => {
    ctx.strokeStyle = `rgba(${MIST},0.03)`;
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
    // radar rings
    ctx.strokeStyle = `rgba(${pal.a},0.07)`;
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, (R * i) / 3, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  return {
    draw(ctx, t) {
      paintGrid(ctx);
      const sweep = t * 0.9;
      // sweep wedge (fading trail)
      for (let i = 0; i < 22; i++) {
        const a = sweep - i * 0.035;
        ctx.strokeStyle = `rgba(${pal.a},${0.09 * (1 - i / 22)})`;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
        ctx.stroke();
      }
      // blips light up as the sweep passes
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
/* journey — racing: horizontal speed streaks + drifting checker band  */
/* ------------------------------------------------------------------ */
function createSpeedway(w: number, h: number, pal: Palette): Renderer {
  type Streak = { x: number; y: number; len: number; v: number; a: number; col: string };
  const spawn = (initial: boolean): Streak => ({
    x: initial ? rand(0, w) : -rand(80, 240),
    y: rand(0, h),
    len: rand(40, 190),
    v: rand(260, 720),
    a: rand(0.04, 0.16),
    col: Math.random() < 0.3 ? pal.a : MIST,
  });
  const streaks = Array.from(
    { length: Math.round(Math.min(Math.max(w / 40, 16), 38)) },
    () => spawn(true)
  );

  const paint = (ctx: Ctx2D) => {
    ctx.lineWidth = 1;
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
/* contact — multiplayer: network constellation, links pulse alive     */
/* ------------------------------------------------------------------ */
function createNetwork(w: number, h: number, pal: Palette): Renderer {
  type Node = { x: number; y: number; vx: number; vy: number; r: number };
  const nodes = Array.from({ length: Math.round(Math.min(Math.max(w / 70, 12), 26)) }, (): Node => ({
    x: rand(0, w),
    y: rand(0, h),
    vx: rand(-9, 9),
    vy: rand(-7, 7),
    r: rand(1.2, 2.4),
  }));
  const LINK = 150;

  const paint = (ctx: Ctx2D, t: number) => {
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          const pulse = 0.6 + 0.4 * Math.sin(t * 1.6 + i + j);
          ctx.strokeStyle = `rgba(${pal.a},${(1 - d / LINK) * 0.11 * pulse})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    for (const [i, n] of nodes.entries()) {
      const col = i % 4 === 0 ? pal.b : pal.a;
      ctx.fillStyle = `rgba(${col},${0.35 + 0.2 * Math.sin(t * 2 + i)})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  return {
    draw(ctx, t, dt) {
      for (const n of nodes) {
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      paint(ctx, t);
    },
    drawStatic(ctx) {
      paint(ctx, 1);
    },
  };
}

/* ------------------------------------------------------------------ */
/* outro — the console powers down: motes decelerate, fade, then a     */
/* single CRT collapse line — and the loop stops for good.             */
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
      col: Math.random() < 0.2 ? (Math.random() < 0.5 ? pal.a : pal.b) : MIST,
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
      ctx.fillStyle = `rgba(${MIST},0.06)`;
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
      return createRunes(w, h, pal);
    case "works":
      return createOverworld(w, h, pal);
    case "services":
      return createRadar(w, h, pal);
    case "journey":
      return createSpeedway(w, h, pal);
    case "contact":
      return createNetwork(w, h, pal);
    case "outro":
      return createPowerDown(w, h, pal);
  }
}

/**
 * Ambient animated backdrop for a game zone — one shared engine, themed
 * per genre. Sticky viewport-sized canvas (tall sections stay cheap), runs
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

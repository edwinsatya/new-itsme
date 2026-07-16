"use client";

import dynamic from "next/dynamic";
import {
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
} from "react";
import { PRELOADER_DONE_EVENT, prefersReducedMotion } from "@/lib/gsap";
import { ZONES, ZONE_ORDER, zoneIndex, type ZoneId } from "@/config/zones";
import { zoneBus } from "@/lib/zoneBus";

/**
 * COMPANION UNIT — a small drone that rides shotgun through the districts.
 * Driven entirely by zoneBus (the same scroll source of truth as the warp
 * overlay), it idles, senses upcoming jumps, glitches out on the flash
 * frame, and pops back in wearing the new district's glow with one line.
 *
 * Rive-first: drop `public/companion.riv` and this component drives it
 * (contract below). Until that asset ships, the built-in canvas drone
 * implements the same four-state machine so the experience is complete.
 *
 * Rive contract — artboard "Companion", state machine "Companion":
 *   alert  (boolean)       brighter/faster idle while a jump approaches
 *   jump   (trigger)       glitch-out timed to the warp flash
 *   arrive (trigger)       pop-in at the new district
 *   zone   (number 0–6)    index into ZONE_ORDER, drives glow color
 *   lookX / lookY (number −1…1)  cursor gaze
 */
export interface DroneHandle {
  alert(on: boolean): void;
  jump(): void;
  arrive(zoneIdx: number): void;
  set(zoneIdx: number): void;
}

const RiveDrone = dynamic(() => import("./RiveDrone"), { ssr: false });

const DRONE_SIZE = 76;
const JUMP_DUR = 0.34;
const ARRIVE_DUR = 0.42;

const parseRgb = (s: string) =>
  s.split(",").map((n) => parseInt(n, 10)) as [number, number, number];

/* ================================================================== */
/* speech bubble — one line per district, delivered once per visit     */
/* ================================================================== */

const Bubble = () => {
  const [state, setState] = useState({
    district: "",
    text: "",
    full: "",
    open: false,
    typing: false,
  });
  const seen = useRef(new Set<ZoneId>());
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const clearTimers = () => {
      timers.current.forEach((id) => {
        window.clearTimeout(id);
        window.clearInterval(id);
      });
      timers.current = [];
    };

    const speak = (zone: ZoneId) => {
      const z = ZONES[zone];
      clearTimers();
      if (reduced) {
        setState({ district: z.district, text: z.line, full: z.line, open: true, typing: false });
        timers.current.push(
          window.setTimeout(() => setState((s) => ({ ...s, open: false })), 4600)
        );
        return;
      }
      setState({ district: z.district, text: "", full: z.line, open: true, typing: true });
      let i = 0;
      const iv = window.setInterval(() => {
        i++;
        setState((s) => ({ ...s, text: z.line.slice(0, i) }));
        if (i >= z.line.length) {
          window.clearInterval(iv);
          setState((s) => ({ ...s, typing: false }));
          timers.current.push(
            window.setTimeout(() => setState((s) => ({ ...s, open: false })), 3800)
          );
        }
      }, 24);
      timers.current.push(iv);
    };

    const offs = [
      zoneBus.on("arrive", ({ zone }) => {
        if (seen.current.has(zone)) return;
        seen.current.add(zone);
        speak(zone);
      }),
      // the line cuts out with the drone on a jump
      zoneBus.on("jump", () => {
        clearTimers();
        setState((s) => ({ ...s, open: false }));
      }),
    ];
    return () => {
      offs.forEach((off) => off());
      clearTimers();
    };
  }, []);

  return (
    <>
      <span className="sr-only" role="status">
        {state.open ? state.full : ""}
      </span>
      <div
        className={`companion-bubble ${state.open ? "is-open" : ""} ${state.typing ? "is-typing" : ""}`}
        aria-hidden
      >
        <span className="bubble-tag">{"// "}{state.district}</span>
        <span className="bubble-text">{state.text}</span>
      </div>
    </>
  );
};

/* ================================================================== */
/* canvas fallback drone — same four states as the Rive contract       */
/* ================================================================== */

const CanvasDrone = memo(({ handleRef }: { handleRef: Ref<DroneHandle> }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedRef = useRef(false);
  const pokeRef = useRef<() => void>(() => {});
  const s = useRef({
    glow: parseRgb(ZONES.hero.primaryRgb),
    target: parseRgb(ZONES.hero.primaryRgb),
    ghostA: parseRgb(ZONES.hero.primaryRgb),
    alertOn: false,
    alert: 0,
    look: { x: 0, y: 0 },
    lookT: { x: 0, y: 0 },
    jumpT: 0,
    arriveT: 0,
    blinkPhase: 0,
    nextBlink: 2.8,
    t: 0,
  });

  useImperativeHandle(
    handleRef,
    () => ({
      alert(on) {
        s.current.alertOn = on;
        pokeRef.current();
      },
      jump() {
        if (reducedRef.current) return;
        s.current.ghostA = [...s.current.glow] as [number, number, number];
        s.current.jumpT = JUMP_DUR;
      },
      arrive(zi) {
        s.current.target = parseRgb(ZONES[ZONE_ORDER[zi]].primaryRgb);
        if (reducedRef.current) {
          s.current.glow = [...s.current.target] as [number, number, number];
        } else {
          s.current.arriveT = ARRIVE_DUR;
        }
        pokeRef.current();
      },
      set(zi) {
        s.current.target = parseRgb(ZONES[ZONE_ORDER[zi]].primaryRgb);
        if (reducedRef.current) {
          s.current.glow = [...s.current.target] as [number, number, number];
        }
        pokeRef.current();
      },
    }),
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const g = canvas.getContext("2d");
    if (!g) return;

    const reduced = (reducedRef.current = prefersReducedMotion());
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = DRONE_SIZE * dpr;
    canvas.height = DRONE_SIZE * dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);

    const C = DRONE_SIZE / 2;
    const INK = "232,238,245";
    const rgba = (c: [number, number, number], a: number) =>
      `rgba(${c[0]},${c[1]},${c[2]},${a})`;

    /** the drone body — everything is drawn relative to its center */
    const drawBody = (
      ox: number,
      oy: number,
      scale: number,
      col: [number, number, number],
      alpha: number,
      blink: number,
      look: { x: number; y: number },
      thrust: number,
      time: number
    ) => {
      g.save();
      g.translate(C + ox, C + oy);
      g.scale(scale, scale);
      g.globalAlpha *= alpha;

      // hexagonal shell
      g.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i + Math.PI / 6;
        const x = Math.cos(a) * 15.5;
        const y = Math.sin(a) * 15.5;
        if (i === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.closePath();
      g.fillStyle = rgba(col, 0.09);
      g.fill();
      g.lineWidth = 1.4;
      g.strokeStyle = rgba(col, 0.95);
      g.stroke();

      // visor slit
      g.fillStyle = "rgba(5,6,10,0.9)";
      g.fillRect(-9, -6, 18, 9);
      g.strokeStyle = `rgba(${INK},0.28)`;
      g.lineWidth = 1;
      g.strokeRect(-9, -6, 18, 9);

      // pupil — tracks the cursor, squashes on blink
      const px = look.x * 3.6;
      const py = -1.5 + look.y * 2.4;
      g.save();
      g.translate(px, py);
      g.scale(1, Math.max(0.08, 1 - blink));
      g.shadowColor = rgba(col, 0.9);
      g.shadowBlur = 7;
      g.fillStyle = rgba(col, 1);
      g.beginPath();
      g.arc(0, 0, 2.7, 0, Math.PI * 2);
      g.fill();
      g.restore();

      // antenna + status tip
      g.strokeStyle = rgba(col, 0.7);
      g.beginPath();
      g.moveTo(0, -15.5);
      g.lineTo(0, -21);
      g.stroke();
      const tipOn = (time * (2 + thrust * 4)) % 1 < 0.62;
      g.fillStyle = rgba(col, tipOn ? 0.95 : 0.25);
      g.fillRect(-1.3, -23.5, 2.6, 2.6);

      // thrusters
      for (const tx of [-6, 6]) {
        const len = 4 + Math.abs(Math.sin(time * 13 + tx)) * (3 + thrust * 4);
        const grad = g.createLinearGradient(0, 16, 0, 16 + len);
        grad.addColorStop(0, rgba(col, 0.75));
        grad.addColorStop(1, rgba(col, 0));
        g.strokeStyle = grad;
        g.lineWidth = 1.6;
        g.beginPath();
        g.moveTo(tx, 16);
        g.lineTo(tx, 16 + len);
        g.stroke();
      }
      g.restore();
    };

    const render = (dt: number) => {
      const st = s.current;
      st.t += dt;

      // eased state
      st.alert += ((st.alertOn ? 1 : 0) - st.alert) * Math.min(1, dt * 5);
      for (let i = 0; i < 3; i++) {
        st.glow[i] += (st.target[i] - st.glow[i]) * Math.min(1, dt * 4.5);
      }
      st.look.x += (st.lookT.x - st.look.x) * Math.min(1, dt * 6);
      st.look.y += (st.lookT.y - st.look.y) * Math.min(1, dt * 6);

      // blink scheduling — quicker when alert
      st.nextBlink -= dt * (1 + st.alert * 1.4);
      if (st.nextBlink <= 0) {
        st.blinkPhase = 0.15;
        st.nextBlink = 2.4 + Math.random() * 2.8;
      }
      let blink = 0;
      if (st.blinkPhase > 0) {
        st.blinkPhase -= dt;
        const k = 1 - Math.max(0, st.blinkPhase) / 0.15;
        blink = k < 0.5 ? k * 2 : (1 - k) * 2;
      }

      g.clearRect(0, 0, DRONE_SIZE, DRONE_SIZE);
      const col = st.glow.map(Math.round) as [number, number, number];
      const bob = reduced
        ? 0
        : Math.sin(st.t * (1.4 + st.alert * 1.9)) * (2.6 + st.alert * 1.4);
      let jitterX = 0;
      let jitterY = 0;
      if (st.alert > 0.5 && Math.random() < 0.07) {
        jitterX = (Math.random() - 0.5) * 2;
        jitterY = (Math.random() - 0.5) * 2;
      }

      if (st.jumpT > 0) {
        /* -------- jump: glitch-out synced to the warp flash -------- */
        st.jumpT -= dt;
        const p = 1 - Math.max(0, st.jumpT) / JUMP_DUR;
        const flick = (st.t * 42) % 2 < 1 ? 0.3 : 1;
        const scale = 1 + 0.3 * Math.sin(p * Math.PI);

        // chromatic ghosts split off the body
        g.save();
        g.globalCompositeOperation = "screen";
        g.globalAlpha = 0.55 * flick;
        drawBody(-4 * (1 - p), 0, scale, st.ghostA, 1, blink, st.look, 1, st.t);
        drawBody(4 * (1 - p), 0, scale, col, 1, blink, st.look, 1, st.t);
        g.restore();

        // body torn into three drifting bands
        for (let k = 0; k < 3; k++) {
          g.save();
          g.beginPath();
          g.rect(0, (DRONE_SIZE / 3) * k, DRONE_SIZE, DRONE_SIZE / 3);
          g.clip();
          g.globalAlpha = flick;
          drawBody(
            (Math.random() - 0.5) * 9 * (1 - p),
            bob * 0.4,
            scale,
            col,
            0.9,
            blink,
            st.look,
            1,
            st.t
          );
          g.restore();
        }
      } else if (st.arriveT > 0) {
        /* -------- arrive: pop-in wearing the new district's glow ---- */
        st.arriveT -= dt;
        const p = 1 - Math.max(0, st.arriveT) / ARRIVE_DUR;
        const scale = p < 0.3 ? 0.55 + (p / 0.3) * 0.57 : 1.12 - ((p - 0.3) / 0.7) * 0.12;
        const alpha = p < 0.18 ? ((st.t * 36) % 2 < 1 ? 0.35 : 1) : 1;
        drawBody(0, bob, scale, col, alpha, blink, st.look, 0.6, st.t);
      } else {
        /* -------- idle / alert ------------------------------------- */
        if (st.alert > 0.05 && !reduced) {
          // proximity ping — it senses the seam coming
          const ringP = ((st.t * 2.2) % 1 + 1) % 1;
          g.strokeStyle = rgba(col, (1 - ringP) * 0.34 * st.alert);
          g.lineWidth = 1;
          g.beginPath();
          g.arc(C, C + bob, 16 + ringP * 14, 0, Math.PI * 2);
          g.stroke();
        }
        drawBody(jitterX, bob + jitterY, 1, col, 0.85 + st.alert * 0.15, blink, st.look, st.alert, st.t);
      }
    };

    /* loop management — pauses off-tab; reduced motion = static frames */
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      render(dt);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (raf || reduced || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    pokeRef.current = () => {
      if (reduced) render(0);
      else start();
    };

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    // gaze tracking — only when a fine pointer is around
    let onMove: ((e: PointerEvent) => void) | undefined;
    if (!reduced && window.matchMedia("(pointer: fine)").matches) {
      onMove = (e) => {
        const r = canvas.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const within = Math.hypot(dx, dy) < 300;
        s.current.lookT.x = within ? Math.max(-1, Math.min(1, dx / 150)) : 0;
        s.current.lookT.y = within ? Math.max(-1, Math.min(1, dy / 150)) : 0;
      };
      window.addEventListener("pointermove", onMove, { passive: true });
    }

    if (reduced) render(0);
    else start();

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
      if (onMove) window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="companion-canvas"
      style={{ width: DRONE_SIZE, height: DRONE_SIZE }}
      aria-hidden
    />
  );
});
CanvasDrone.displayName = "CanvasDrone";

/* ================================================================== */
/* the companion itself                                                */
/* ================================================================== */

const Companion = () => {
  const [live, setLive] = useState(false);
  const [riveMode, setRiveMode] = useState(false);
  const droneRef = useRef<DroneHandle | null>(null);
  const shownRef = useRef(false);

  // probe once for a real Rive asset; the canvas drone covers until then
  useEffect(() => {
    let alive = true;
    fetch("/companion.riv", { method: "HEAD" })
      .then((r) => {
        const type = r.headers.get("content-type") ?? "";
        if (alive && r.ok && !type.includes("text/html")) setRiveMode(true);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // drone follows the zone bus — same source of truth as the warp overlay
  useEffect(() => {
    const offs = [
      zoneBus.on("alert", ({ on }) => droneRef.current?.alert(on)),
      zoneBus.on("jump", () => droneRef.current?.jump()),
      zoneBus.on("arrive", ({ zone }) => droneRef.current?.arrive(zoneIndex(zone))),
      zoneBus.on("set", ({ zone }) => droneRef.current?.set(zoneIndex(zone))),
    ];
    return () => offs.forEach((off) => off());
  }, []);

  // pop in once the preloader signs off, then greet the current district
  useEffect(() => {
    let greet = 0;
    const show = () => {
      if (shownRef.current) return;
      shownRef.current = true;
      setLive(true);
      greet = window.setTimeout(
        () => zoneBus.emit("arrive", { zone: zoneBus.current }),
        420
      );
    };
    window.addEventListener(PRELOADER_DONE_EVENT, show, { once: true });
    const fallback = window.setTimeout(show, 5200);
    return () => {
      window.removeEventListener(PRELOADER_DONE_EVENT, show);
      window.clearTimeout(fallback);
      window.clearTimeout(greet);
    };
  }, []);

  return (
    <div className={`companion ${live ? "is-live" : ""}`}>
      <Bubble />
      {riveMode ? (
        <RiveDrone
          handleRef={droneRef}
          size={DRONE_SIZE}
          onFail={() => setRiveMode(false)}
        />
      ) : (
        <CanvasDrone handleRef={droneRef} />
      )}
    </div>
  );
};

export default Companion;

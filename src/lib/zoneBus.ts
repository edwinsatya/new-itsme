import type { ZoneId } from "@/config/zones";

/**
 * Tiny typed event bus — the ONE source of truth for zone state.
 * LoadDirector derives everything from scroll position and emits here;
 * the load overlay, the HUD chrome, and the cursor all listen to the
 * same stream, so they can never drift out of sync.
 */
export type ZoneEvents = {
  /** active zone changed without ceremony (initial mount, silent syncs) */
  set: { zone: ZoneId };
  /** entering/leaving the approach band before a boundary */
  alert: { on: boolean };
  /** the flash frame of a dimension jump */
  jump: { from: ZoneId; to: ZoneId };
  /** landed in a new district (fires just after the flash clears) */
  arrive: { zone: ZoneId };
};

type Handler<K extends keyof ZoneEvents> = (payload: ZoneEvents[K]) => void;

const handlers: { [K in keyof ZoneEvents]: Set<Handler<K>> } = {
  set: new Set(),
  alert: new Set(),
  jump: new Set(),
  arrive: new Set(),
};

export const zoneBus = {
  /** zone currently on screen — kept current across set/arrive */
  current: "home" as ZoneId,
  alert: false,

  on<K extends keyof ZoneEvents>(ev: K, fn: Handler<K>): () => void {
    handlers[ev].add(fn);
    return () => {
      handlers[ev].delete(fn);
    };
  },

  emit<K extends keyof ZoneEvents>(ev: K, payload: ZoneEvents[K]) {
    if (ev === "set" || ev === "arrive") {
      zoneBus.current = (payload as ZoneEvents["set"]).zone;
    }
    if (ev === "alert") {
      zoneBus.alert = (payload as ZoneEvents["alert"]).on;
    }
    handlers[ev].forEach((fn) => fn(payload));
  },
};

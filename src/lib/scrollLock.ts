/**
 * Hard scroll lock shared by the boot gate and the game-library menu.
 *
 * `overflow: hidden` alone cannot lock this page: Lenis converts wheel
 * input into programmatic scrolls (which ignore overflow), and iOS
 * ignores body overflow for touch-panning entirely. Fixing the body
 * gives the document zero scrollable height — nothing can move it.
 *
 * The current scroll position is parked in `body.style.top` and restored
 * on unlock, so locking mid-page never visibly jumps. The `lenis-stopped`
 * class additionally pauses Lenis (SmoothScroll watches it), keeping its
 * internal target in sync so unlocking doesn't snap.
 */

let lockedY = 0;
let locks = 0;

export function lockScroll() {
  locks += 1;
  if (locks > 1) return; // already locked
  lockedY = window.scrollY;
  const b = document.body.style;
  b.position = "fixed";
  b.top = `-${lockedY}px`;
  b.left = "0";
  b.right = "0";
  document.documentElement.style.overflow = "hidden";
  document.documentElement.classList.add("lenis-stopped");
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks > 0) return; // someone else still holds the lock
  const b = document.body.style;
  b.position = "";
  b.top = "";
  b.left = "";
  b.right = "";
  document.documentElement.style.overflow = "";
  document.documentElement.classList.remove("lenis-stopped");
  window.scrollTo(0, lockedY);
}

/**
 * Small SFX shout ("GO!!", "NEW!") that pops in near a CTA when scrolled into
 * view. Relies on the parent section's `useRevealScope` for the pop animation.
 */
const SfxPop = ({
  text,
  className = "",
  rotate = -8,
}: {
  text: string;
  className?: string;
  rotate?: number;
}) => (
  <span
    data-reveal-pop
    data-rotate={rotate}
    aria-hidden
    className={`sfx-text pointer-events-none select-none absolute z-10 ${className}`}
  >
    {text}
  </span>
);

export default SfxPop;

import type { ElementType, ReactNode } from "react";

type GlitchTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
  /** seconds after the scroll trigger before the glitch plays */
  delay?: number;
  children?: ReactNode;
};

/**
 * Headline that stutters in with an RGB-split slice glitch (~320ms) and
 * settles clean. The reveal itself is driven by `useRevealScope`, which
 * adds `.glitched` when the element scrolls into view.
 */
const GlitchText = ({ text, as: Tag = "span", className = "", delay }: GlitchTextProps) => (
  <Tag
    className={`glitch ${className}`}
    data-glitch
    data-text={text}
    {...(delay ? { "data-glitch-delay": String(delay) } : {})}
  >
    {text}
  </Tag>
);

export default GlitchText;

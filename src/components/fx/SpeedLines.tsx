/*
 * Manga speed-line assets. Pure SVG, colored via `currentColor`, and fully
 * deterministic (seeded pseudo-random) so SSR and client render identically.
 */

/** fract(sin(n) * big) — cheap deterministic jitter in [0, 1) */
const seeded = (n: number) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const r1 = (n: number) => Math.round(n * 10) / 10;

type SpeedLinesProps = {
  className?: string;
  /** number of radial strokes */
  count?: number;
  /** empty radius at the focal point (viewBox units, canvas is 1000×1000) */
  inner?: number;
};

/**
 * Radial speed lines converging on the center of the canvas — tapered wedges,
 * thick at the rim, needle-sharp toward the focal point.
 */
export const SpeedLines = ({ className = "", count = 56, inner = 210 }: SpeedLinesProps) => {
  const cx = 500;
  const cy = 500;

  const wedges = Array.from({ length: count }, (_, i) => {
    const jitter = seeded(i + 1);
    const angle = ((i * 360) / count + jitter * 5.5) * (Math.PI / 180);
    const r0 = inner * (0.8 + seeded(i + 101) * 0.55);
    const rOut = 780 + seeded(i + 201) * 240;
    const halfW = 0.0045 + seeded(i + 301) * 0.011;

    const p0 = `${r1(cx + Math.cos(angle) * r0)},${r1(cy + Math.sin(angle) * r0)}`;
    const p1 = `${r1(cx + Math.cos(angle + halfW) * rOut)},${r1(cy + Math.sin(angle + halfW) * rOut)}`;
    const p2 = `${r1(cx + Math.cos(angle - halfW) * rOut)},${r1(cy + Math.sin(angle - halfW) * rOut)}`;

    return <polygon key={i} points={`${p0} ${p1} ${p2}`} />;
  });

  return (
    <svg
      className={className}
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      fill="currentColor"
      aria-hidden
    >
      {wedges}
    </svg>
  );
};

type ImpactStarProps = {
  className?: string;
  /** number of spikes */
  spikes?: number;
};

/** Jagged impact-burst star — the classic "explosion frame" shape. */
export const ImpactStar = ({ className = "", spikes = 14 }: ImpactStarProps) => {
  const cx = 500;
  const cy = 500;
  const points: string[] = [];

  for (let i = 0; i < spikes * 2; i++) {
    const angle = (i * Math.PI) / spikes;
    const isOuter = i % 2 === 0;
    const radius = isOuter
      ? 400 + seeded(i + 11) * 95
      : 200 + seeded(i + 51) * 70;
    points.push(`${r1(cx + Math.cos(angle) * radius)},${r1(cy + Math.sin(angle) * radius)}`);
  }

  return (
    <svg className={className} viewBox="0 0 1000 1000" fill="currentColor" aria-hidden>
      <polygon points={points.join(" ")} />
    </svg>
  );
};

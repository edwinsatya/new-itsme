/**
 * Recognizable tech marks for the RPG equipment grid, drawn in code so
 * they inherit `currentColor` — each gear slot tints its icon with the
 * item's rarity color, like tinted inventory sprites.
 */

const S = 1.5; // shared stroke width

const TechIcon = ({ name, size = 30 }: { name: string; size?: number }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true,
  } as const;
  const key = name.toLowerCase();

  if (key.includes("react"))
    return (
      <svg {...common} stroke="currentColor" strokeWidth={S}>
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none" />
      </svg>
    );

  if (key.includes("next"))
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth={S} />
        <path d="M9 16 V8 L16 17" stroke="currentColor" strokeWidth={S + 0.3} strokeLinecap="round" />
        <path d="M15.2 8 V13" stroke="currentColor" strokeWidth={S + 0.3} strokeLinecap="round" />
      </svg>
    );

  if (key.includes("typescript"))
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="3" fill="currentColor" />
        <text x="12" y="16.2" textAnchor="middle" fontSize="8.5" fontWeight="700" fontFamily="sans-serif" fill="#151824">
          TS
        </text>
      </svg>
    );

  if (key.includes("node"))
    return (
      <svg {...common}>
        <path d="M12 2 L20.6 7 V17 L12 22 L3.4 17 V7 Z" stroke="currentColor" strokeWidth={S} strokeLinejoin="round" />
        <text x="12" y="15.4" textAnchor="middle" fontSize="7" fontWeight="700" fontFamily="sans-serif" fill="currentColor">
          JS
        </text>
      </svg>
    );

  if (key.includes("vue"))
    return (
      <svg {...common}>
        <path d="M2.5 4.5 L12 20.5 L21.5 4.5 H17 L12 13 L7 4.5 Z" fill="currentColor" opacity="0.45" />
        <path d="M7 4.5 L12 13 L17 4.5 H13.6 L12 7.4 L10.4 4.5 Z" fill="currentColor" />
      </svg>
    );

  if (key.includes("angular"))
    return (
      <svg {...common}>
        <path d="M12 2 L21 5.4 L19.6 17.8 L12 22 L4.4 17.8 L3 5.4 Z" stroke="currentColor" strokeWidth={S} strokeLinejoin="round" />
        <text x="12" y="15.8" textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="sans-serif" fill="currentColor">
          A
        </text>
      </svg>
    );

  if (key.includes("tailwind"))
    return (
      <svg {...common}>
        <path
          d="M7 10 C8.4 6.9 10.6 5.5 13.6 6.1 C15.4 6.5 16.2 7.6 17.2 8.3 C18.9 9.4 20.4 9 21.5 7.9 C20.1 11 17.9 12.4 14.9 11.8 C13.1 11.4 12.3 10.3 11.3 9.6 C9.6 8.5 8.1 8.9 7 10 Z"
          fill="currentColor"
        />
        <path
          d="M2.5 16.4 C3.9 13.3 6.1 11.9 9.1 12.5 C10.9 12.9 11.7 14 12.7 14.7 C14.4 15.8 15.9 15.4 17 14.3 C15.6 17.4 13.4 18.8 10.4 18.2 C8.6 17.8 7.8 16.7 6.8 16 C5.1 14.9 3.6 15.3 2.5 16.4 Z"
          fill="currentColor"
        />
      </svg>
    );

  if (key.includes("mongo"))
    return (
      <svg {...common}>
        <path
          d="M12 2 C16 7 17 12 14.4 17 C13.5 18.8 12.8 20 12.3 22 H11.7 C11.2 20 10.5 18.8 9.6 17 C7 12 8 7 12 2 Z"
          fill="currentColor"
        />
        <path d="M12 8 V21" stroke="#151824" strokeWidth="1" />
      </svg>
    );

  if (key.includes("git"))
    return (
      <svg {...common} stroke="currentColor" strokeWidth={S} strokeLinecap="round">
        <circle cx="6.5" cy="6" r="2.3" />
        <circle cx="6.5" cy="18" r="2.3" />
        <circle cx="17.5" cy="8.5" r="2.3" />
        <path d="M6.5 8.3 V15.7" />
        <path d="M6.5 13 C6.5 10.5 12 12.5 15.6 10.2" />
      </svg>
    );

  if (key.includes("postgre") || key.includes("mysql")) {
    const label = key.includes("postgre") ? "PG" : "My";
    return (
      <svg {...common} stroke="currentColor" strokeWidth={S}>
        <ellipse cx="12" cy="5.6" rx="8" ry="2.9" />
        <path d="M4 5.6 V18 C4 19.7 7.6 21 12 21 C16.4 21 20 19.7 20 18 V5.6" />
        <text x="12" y="16.6" textAnchor="middle" fontSize="6.5" fontWeight="700" fontFamily="sans-serif" fill="currentColor" stroke="none">
          {label}
        </text>
      </svg>
    );
  }

  // fallback: generic item gem
  return (
    <svg {...common} stroke="currentColor" strokeWidth={S}>
      <path d="M12 3 L20 10 L12 21 L4 10 Z" strokeLinejoin="round" />
      <path d="M4 10 H20" opacity="0.6" />
    </svg>
  );
};

export default TechIcon;

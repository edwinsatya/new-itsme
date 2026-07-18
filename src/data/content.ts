/**
 * Single source of truth for every word on the site.
 * Components render from here — edit copy in this file only.
 */

export const site = {
  brand: "EDWIN.SATYA®",
  name: "Edwin Satya Yudistira",
  title: "Edwin Satya Yudistira — Full Stack Developer",
  description:
    "Independent full-stack developer in Lumajang, Indonesia — working globally. Fast, lucid web products: pixel-perfect interfaces on scalable systems, with AI where it actually helps.",
  email: "edwinsatyayudistira@gmail.com",
  github: "https://github.com/edwinsatya",
  linkedin: "https://www.linkedin.com/in/edwin-satya-yudistira/",
  cv: "https://drive.google.com/file/d/1lVwiO2EFELfN9PNNiT_h7xVXcecw5r7H/view?usp=drive_link",
  location: "Lumajang · working globally",
} as const;

export const nav = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
] as const;

export const hero = {
  microLeft: "Independent developer · Lumajang / Everywhere",
  microRight: "Scroll to explore ↓",
  eyebrow: "Full-stack · Frontend · AI integration",
  headline: ["Code with intent.", "Products with pulse."],
  description:
    "I'm Edwin Satya Yudistira — a full-stack developer crafting fast, lucid web products: pixel-perfect interfaces on scalable systems, with AI where it actually helps.",
  wordmark: "EDWIN.SATYA",
  status: "Open to work",
  video: "/media/hero-loop.mp4",
} as const;

export const portal = {
  wordLeft: "EDWIN",
  wordRight: "Satya",
  image: "/media/portal.jpg",
  overlay: ["Edwin", "Satya"],
  labels: [
    "Selected work / 2020–2026",
    "Systems in perpetual motion",
    "Lumajang · Worldwide",
  ],
} as const;

export const intro = {
  label: "About",
  statement: {
    before: "Welcome. I've spent 6+ years turning ambitious briefs into ",
    accent: "living products",
    after:
      " — from publishing platforms and logistics tools to AI-powered apps — as engineer, teammate, and occasional one-man studio.",
  },
  index: "Est. 2020",
  portrait: "/media/portrait.jpg",
} as const;

export const manifesto = {
  lines: [
    "I build software that",
    "works on day one",
    "& still moves on day one thousand.",
  ],
  sideIndex: "01 · Make it work, make it felt",
  stats: "6+ yrs · 10+ shipped · 5 teams",
} as const;

export type FeaturedProject = {
  index: string;
  title: string;
  meta: string;
  description: string;
  image: string | null;
  /** primary external link, when one exists */
  href: string | null;
  repo?: string;
  /** label inside the circular CTA */
  cta: string;
  /** tint used by the designed fallback art */
  tint: "ultra" | "ink" | "space";
};

export const featuredProjects: FeaturedProject[] = [
  {
    index: "01",
    title: "Weathernime",
    meta: "Next.js · Open-Meteo API",
    description:
      "A weather forecast that trades dashboards for an anime-editorial mood — fast data under a cinematic sky.",
    image: "/media/proj-weathernime.jpg",
    href: "https://weathernime.touchsimpledev.site",
    repo: "https://github.com/edwinsatya/weathernime",
    cta: "View project ↗",
    tint: "ultra",
  },
  {
    index: "02",
    title: "Happy Farm",
    meta: "Full-stack · Tola Solution",
    description:
      "An engaging farm-management platform — livestock, harvest and finance flows, built frontend to backend.",
    image: "/media/proj-happyfarm.jpg",
    href: null,
    cta: "Private build",
    tint: "ink",
  },
  {
    index: "03",
    title: "Magloft",
    meta: "Digital publishing platform",
    description:
      "Feature development and performance work at scale, across reader apps and publishing tools.",
    image: "/media/proj-magloft.jpg",
    href: "https://www.magloft.com",
    cta: "View project ↗",
    tint: "ultra",
  },
  {
    index: "04",
    title: "Signal: Bountie",
    meta: "Web apps · Gaming platform",
    description:
      "Web applications for a gaming platform, shipped with cross-functional teams across the region.",
    image: null,
    href: null,
    cta: "Sunset 2023",
    tint: "space",
  },
];

export const archive = [
  { num: "05", name: "Food Analyzer", desc: "AI-assisted nutrition analysis", tag: "Next.js" },
  { num: "06", name: "DeskLab", desc: "Workspace product site", tag: "Frontend" },
  { num: "07", name: "Pokedex", desc: "API-driven catalogue", tag: "Vue.js" },
  { num: "08", name: "MileApp", desc: "Logistics platform work", tag: "Full-stack" },
  { num: "09", name: "Mini-Google", desc: "Search engine clone", tag: "Node.js" },
  { num: "10", name: "Tola Web", desc: "Company platform", tag: "Full-stack" },
] as const;

export const services = {
  label: "What I do",
  title: "Capabilities",
  description:
    "Senior product engineering, assembled around your problem — not a department chart.",
  rows: [
    {
      num: "01",
      name: "Front-End Development",
      desc: "Interfaces that feel lucid, fast and alive.",
      tag: "React · Next.js · Vue · TypeScript",
    },
    {
      num: "02",
      name: "Full-Stack Engineering",
      desc: "From schema to deployment, built to maintain.",
      tag: "Node.js · PostgreSQL · MongoDB · APIs",
    },
    {
      num: "03",
      name: "AI Integration",
      desc: "Practical AI features that earn their place.",
      tag: "OpenAI · automation · agent workflows",
    },
    {
      num: "04",
      name: "Performance & Rescue",
      desc: "Audits, refactors and Core Web Vitals wins.",
      tag: "Profiling · DX · CI",
    },
  ],
} as const;

export const capabilities = [
  {
    theme: "ultra",
    title: "Interfaces, built to breathe",
    body: "Layouts with rhythm, motion with restraint — interfaces that stay legible at speed.",
  },
  {
    theme: "paper",
    title: "Systems beyond the brief",
    body: "Schemas, APIs and pipelines designed for the day after launch, not just the demo.",
  },
  {
    theme: "acid",
    title: "Momentum, measured",
    body: "Shipped, in production, still moving.",
  },
] as const;

export const experience = {
  label: "Career",
  title: "Five seasons, all podiums.",
  rows: [
    {
      period: "Nov 2025 — Mar 2026",
      company: "Tola Solution",
      role: "Full Stack Developer",
      note: "Happy Farm platform, frontend & backend.",
    },
    {
      period: "Jun 2023 — Feb 2025",
      company: "Magloft",
      role: "Full Stack Developer",
      note: "Digital publishing features & performance.",
    },
    {
      period: "May 2022 — Jun 2023",
      company: "Bountie",
      role: "Software Engineer",
      note: "Web apps with cross-functional teams.",
    },
    {
      period: "Mar 2020 — May 2022",
      company: "homecare24.id",
      role: "Front-end Developer",
      note: "UX and performance on the care platform.",
    },
    {
      period: "Sep 2013 — Jan 2014",
      company: "Telkom Indonesia",
      role: "Network Internship",
      note: "Fiber optic installation & maintenance.",
    },
  ],
  stats: [
    { value: 6, suffix: "+", label: "years shipping" },
    { value: 10, suffix: "+", label: "projects live" },
    { value: 5, suffix: "", label: "teams joined" },
  ],
  certs: ["Hacktiv8 Full Stack", "AWS Solutions Architect"],
} as const;

export const stack = [
  "React",
  "Next.js",
  "TypeScript",
  "Vue",
  "Node.js",
  "Tailwind",
  "PostgreSQL",
  "MongoDB",
  "MySQL",
  "Git",
  "Docker",
  "AWS",
] as const;

export const faq = {
  label: "Good questions",
  title: "Answers, without the fog.",
  items: [
    {
      q: "Are you available right now?",
      a: "Yes. I'm open to new work and can usually start within one to two weeks — sooner for a well-scoped sprint or rescue job.",
    },
    {
      q: "Do you work remote / across time zones?",
      a: "Remote-first from Lumajang, Indonesia (GMT+7). I keep a solid daily overlap with your team — real-time for APAC, evenings for Europe, async-by-default with clear write-ups for everyone else.",
    },
    {
      q: "Freelance project or full-time role?",
      a: "Both. I take end-to-end freelance builds and I'm equally open to the right full-time product team. What matters is ownership: a clear problem, real users, room to ship.",
    },
    {
      q: "What does working with you look like?",
      a: "A short discovery call, then a written plan with milestones. I ship in small reviewable increments — a staging link from week one, honest changelogs, no big-bang reveal at the end.",
    },
    {
      q: "Can you join an existing team & codebase?",
      a: "That's most of my career — Magloft, Bountie, homecare24. I read the codebase before I touch it, match its conventions, and aim to land my first merged PR within days, not weeks.",
    },
    {
      q: "Which stack do you reach for first?",
      a: "Next.js and TypeScript up front, Node.js with PostgreSQL or MongoDB behind it, deployed on AWS or Vercel. Pragmatism over fashion — I pick what your team can maintain.",
    },
  ],
} as const;

export const contact = {
  heading: ["There's always a first commit.", "Let's make yours "],
  accent: "impossible to ignore.",
  cta: "Start a conversation ↗",
  micro: "Average reply < 24 hours",
} as const;

export const footer = {
  marquee: "EDWIN.SATYA®",
  note: "© 2026 Edwin Satya Yudistira",
} as const;

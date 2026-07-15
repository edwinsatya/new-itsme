/**
 * Single source of truth for the runner's real-world record.
 * Content is factual — only the framing is cyberpunk.
 */

export const runner = {
  name: "Edwin Satya Yudistira",
  alias: "E.S.Y",
  role: "Full-Stack Developer",
  est: 2020,
  location: "Lumajang, Indonesia",
  coords: "8.13°S / 113.22°E",
  email: "edwinsatyayudistira@gmail.com",
  responseTime: "< 24 HOURS",
  bio: "You can call me Edwin. I'm a passionate web developer based in Indonesia, dedicated to crafting high-quality digital experiences — from pixel-perfect interfaces to scalable back-end systems.",
};

export const socials = [
  { label: "GitHub", href: "https://github.com/edwinsatya" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/edwin-satya-yudistira/" },
];

export const experiences = [
  {
    period: "Nov 2025 — Mar 2026",
    company: "Tola Solution — Happy Farm Project",
    position: "Full Stack Developer",
    description:
      "Played a key role in the development of the Happy Farm project, contributing to both frontend and backend development to create an engaging and efficient platform for users.",
  },
  {
    period: "Jun 2023 — Feb 2025",
    company: "Magloft",
    position: "Full Stack Developer",
    description:
      "Contributed to the development of Magloft's digital publishing platform, enhancing features and optimizing performance for a seamless user experience.",
  },
  {
    period: "May 2022 — Jun 2023",
    company: "Bountie",
    position: "Software Engineer",
    description:
      "Worked on developing and optimizing web applications, collaborating with cross-functional teams to deliver high-quality software solutions.",
  },
  {
    period: "Mar 2020 — May 2022",
    company: "homecare24.id",
    position: "Front-end Developer",
    description:
      "Developed and maintained the front-end of the homecare24.id platform, focusing on user experience and performance optimization.",
  },
  {
    period: "Sep 2013 — Jan 2014",
    company: "Telkom Indonesia",
    position: "Network Fiber Optic Internship",
    description:
      "Assisted in the installation and maintenance of fiber optic networks, ensuring optimal connectivity and performance.",
  },
];

export const skillGroups = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "Vue.js", "Angular.js", "TypeScript", "Tailwind CSS"],
    level: 90,
  },
  { category: "Backend", items: ["Node.js", "Express", "RestAPI", "Graphql"], level: 80 },
  { category: "Database", items: ["MongoDB", "PostgreSQL", "MySQL"], level: 80 },
  { category: "Tools", items: ["Git", "Docker", "AWS", "Figma", "VS Code"], level: 88 },
];

export const services = [
  {
    index: "01",
    title: "Front-End Development",
    description:
      "Building interactive and performant user interfaces using modern JavaScript frameworks and cutting-edge web technologies.",
    features: ["React / Next.js", "Vue.js", "TypeScript", "Modern CSS", "Web Performance"],
  },
  {
    index: "02",
    title: "Full-Stack Engineering",
    description:
      "Developing complete web applications from database design to deployment, ensuring scalable and maintainable code.",
    features: ["API Development", "Database Design", "Cloud Deployment"],
  },
  {
    index: "03",
    title: "AI Integration",
    description:
      "Exploring and integrating artificial intelligence technologies to create innovative solutions that enhance user experiences.",
    features: ["OpenAI", "ChatGPT", "AI Integration", "Automation"],
  },
];

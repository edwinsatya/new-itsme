import type { Metadata, Viewport } from "next";
import { Rajdhani, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

/* Two families site-wide: Rajdhani carries both display + body duty
   (AAA menu energy), IBM Plex Mono is the HUD/system voice. */
const rajdhani = Rajdhani({
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Edwin Satya Yudistira — Full Stack Developer",
  description:
    "Full Stack Web Developer specializing in React, Next.js, and modern web technologies. A portfolio built like a game console — every section is a different genre. Press start.",
  keywords: "web developer, full stack developer, react, next.js, typescript, portfolio",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png", sizes: "128x128" },
    ],
    apple: "/favicon.png",
  },
  authors: [{ name: "Edwin" }],
};

/* NOTE: exporting `viewport` replaces Next's defaults — width/scale must be
   declared explicitly or phones lay the page out at 980px and let the user
   pan sideways into empty space. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#07080c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rajdhani.variable} ${plexMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

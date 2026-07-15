import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Chakra_Petch, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const chakra = Chakra_Petch({
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
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
    "Full Stack Web Developer specializing in React, Next.js, and modern web technologies. Jack into the network — six years of shipped projects, from AI tools to web3 platforms.",
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

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bebas.variable} ${chakra.variable} ${plexMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

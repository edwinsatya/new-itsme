import type { Metadata } from "next";
import { Anton, Archivo, IBM_Plex_Mono, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const anton = Anton({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-body",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

const notoJp = Noto_Sans_JP({
  variable: "--font-jp",
  weight: ["700", "900"],
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Edwin Satya Yudistira — Full Stack Developer",
  description:
    "Full Stack Web Developer specializing in React, Next.js, and modern web technologies. A developer's story told as a shounen saga — every project a battle cleared.",
  keywords: "web developer, full stack developer, react, next.js, typescript, portfolio",
  icons: {
    icon: "/vscode.svg",
  },
  authors: [{ name: "Edwin Satya Yudistira" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${anton.variable} ${archivo.variable} ${plexMono.variable} ${notoJp.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

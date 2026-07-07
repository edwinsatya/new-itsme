import type { Metadata } from "next";
import { Archivo_Black, Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const archivoBlack = Archivo_Black({
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
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Edwin Satya Yudistira — Full Stack Developer",
  description:
    "Full Stack Web Developer specializing in React, Next.js, and modern web technologies. Creating beautiful, functional, and user-centered digital experiences.",
  keywords: "web developer, full stack developer, react, next.js, typescript, portfolio",
  icons: {
    icon: "/vscode.svg",
  },
  authors: [{ name: "Edwin" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${archivoBlack.variable} ${archivo.variable} ${plexMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "It's Me - Edwin",
  description:
    "Full Stack Web Developer specializing in React, Next.js, and modern web technologies. Creating beautiful, functional, and user-centered digital experiences.",
  keywords: "web developer, full stack developer, react, next.js, typescript, portfolio",
  icons: {
    icon: "/vscode.svg"
  },
  authors: [{ name: "Edwin" }]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}

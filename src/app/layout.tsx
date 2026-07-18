import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Space_Grotesk } from "next/font/google";
import { site } from "@/data/content";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: site.title,
    description: site.description,
    type: "website",
    locale: "en_US",
    siteName: site.brand,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0d",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* gate hidden-until-revealed styles behind JS being present.
            ?forceraf is a dev/testing escape hatch for headless viewers that
            report the page as hidden (rAF frozen): it drives rAF via timers. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');" +
              "if(location.search.indexOf('forceraf')>-1){" +
              "window.requestAnimationFrame=function(cb){return window.setTimeout(function(){cb(performance.now())},16)};" +
              "window.cancelAnimationFrame=function(id){clearTimeout(id)};" +
              "try{Object.defineProperty(document,'hidden',{get:function(){return false}});" +
              "Object.defineProperty(document,'visibilityState',{get:function(){return 'visible'}});}catch(e){}}" +
              "var atM=location.search.match(/[?&]at=(\\d+)/);" +
              "if(atM){var atY=+atM[1];history.scrollRestoration='manual';var atT=0;" +
              "var atIv=setInterval(function(){window.scrollTo({top:atY,behavior:'instant'});" +
              "if(Math.abs(window.scrollY-atY)<4||++atT>80){clearInterval(atIv)}},100);}" +
              "var shM=location.search.match(/[?&]shift=(\\d+)/);" +
              "if(shM){document.addEventListener('DOMContentLoaded',function(){" +
              "document.documentElement.style.marginTop=(-shM[1])+'px';" +
              "setTimeout(function(){var els=document.querySelectorAll('[data-reveal]');" +
              "for(var i=0;i<els.length;i++){els[i].classList.add('is-inview')}},2200)});}",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

import TheFrame from "@/components/TheFrame";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Portfolio from "@/components/Portfolio";
import Services from "@/components/Services";
import Resume from "@/components/Resume";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import ScrollProgress from "@/components/ScrollProgress";
import ThemeManager from "@/components/ThemeManager";

export default function Home() {
  return (
    <main className="min-h-screen">
      <SmoothScroll />
      <ThemeManager />
      <ScrollProgress />
      <Preloader />
      <Cursor />
      <div className="noise-overlay" />
      <TheFrame />
      <Hero />
      <About />
      <Portfolio />
      <Services />
      <Resume />
      <Contact />
      <Footer />
    </main>
  );
}

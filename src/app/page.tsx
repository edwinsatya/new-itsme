import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Portfolio from "@/components/Portfolio";
import Services from "@/components/Services";
import Resume from "@/components/Resume";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MatrixRain from "@/components/MatrixRain";
import LoadingScreen from "@/components/LoadingScreen";
import ScrollToTop from "@/components/ScrollToTop";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <LoadingScreen />
      <MatrixRain />
      <Header />
      <Hero />
      <About />
      <Portfolio />
      <Services />
      <Resume />
      <Contact />
      <Footer />
      <ScrollToTop />
    </main>
  );
}

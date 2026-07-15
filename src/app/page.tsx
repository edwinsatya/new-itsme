import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Origin from "@/components/Origin";
import Battles from "@/components/Battles";
import Abilities from "@/components/Abilities";
import TrainingArc from "@/components/TrainingArc";
import Summon from "@/components/Summon";
import EndCard from "@/components/EndCard";
import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import ScrollProgress from "@/components/ScrollProgress";

export default function Home() {
  return (
    <main className="min-h-screen">
      <SmoothScroll />
      <ScrollProgress />
      <Preloader />
      <Cursor />
      <div className="grain-overlay" />
      <Navbar />
      <Hero />
      <Origin />
      <Battles />
      <Abilities />
      <TrainingArc />
      <Summon />
      <EndCard />
    </main>
  );
}

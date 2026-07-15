import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import Scanlines from "@/components/Scanlines";
import ScrollProgress from "@/components/ScrollProgress";
import HUDFrame from "@/components/HUDFrame";
import Hero from "@/components/sections/Hero";
import Profile from "@/components/sections/Profile";
import Works from "@/components/sections/Works";
import Loadout from "@/components/sections/Loadout";
import RapSheet from "@/components/sections/RapSheet";
import CommLink from "@/components/sections/CommLink";
import Outro from "@/components/sections/Outro";

export default function Home() {
  return (
    <main className="min-h-screen">
      <SmoothScroll />
      <ScrollProgress />
      <Preloader />
      <Cursor />
      <Scanlines />
      <HUDFrame />
      <Hero />
      <Profile />
      <Works />
      <Loadout />
      <RapSheet />
      <CommLink />
      <Outro />
    </main>
  );
}

import SmoothScroll from "@/components/SmoothScroll";
import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import ScreenFX from "@/components/ScreenFX";
import ScrollProgress from "@/components/ScrollProgress";
import HUDFrame from "@/components/HUDFrame";
import LoadDirector from "@/components/fx/LoadDirector";
import ConsoleHome from "@/components/sections/ConsoleHome";
import Hero from "@/components/sections/Hero";
import Profile from "@/components/sections/Profile";
import Works from "@/components/sections/Works";
import Loadout from "@/components/sections/Loadout";
import Journey from "@/components/sections/Journey";
import Lobby from "@/components/sections/Lobby";
import Outro from "@/components/sections/Outro";

export default function Home() {
  return (
    <main className="min-h-screen">
      <SmoothScroll />
      <ScrollProgress />
      <Preloader />
      <Cursor />
      <ScreenFX />
      <HUDFrame />
      {/* the console library — LoadDirector plays a cartridge-load between zones */}
      <div id="zone-stage">
        <ConsoleHome />
        <Hero />
        <Profile />
        <Works />
        <Loadout />
        <Journey />
        <Lobby />
        <Outro />
      </div>
      <LoadDirector />
    </main>
  );
}

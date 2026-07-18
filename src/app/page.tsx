import Capabilities from "@/components/Capabilities";
import Contact from "@/components/Contact";
import Cursor from "@/components/Cursor";
import Experience from "@/components/Experience";
import FAQ from "@/components/FAQ";
import FeaturedProjects from "@/components/FeaturedProjects";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Interactions from "@/components/Interactions";
import IntroFold from "@/components/IntroFold";
import Loader from "@/components/Loader";
import Manifesto from "@/components/Manifesto";
import Portal from "@/components/Portal";
import ProjectIndex from "@/components/ProjectIndex";
import Services from "@/components/Services";
import Stack from "@/components/Stack";
import { featuredProjects, hero, intro, portal } from "@/data/content";
import { resolveMedia } from "@/lib/media";

export default function Page() {
  // media slots are checked on the server so missing files never 404 —
  // components render their designed fallbacks instead
  const heroVideo = resolveMedia(hero.video);
  const portalImage = resolveMedia(portal.image);
  const portraitImage = resolveMedia(intro.portrait);
  const projects = featuredProjects.map((project) => ({
    ...project,
    resolvedImage: resolveMedia(project.image),
  }));
  const manifestoMedia = {
    magloft: resolveMedia("/media/proj-magloft.jpg"),
    happyfarm: resolveMedia("/media/proj-happyfarm.jpg"),
  };

  return (
    <>
      <Loader />
      <Cursor />
      <Interactions />
      <Header />
      <main>
        <Hero hasVideo={!!heroVideo} />
        <Portal image={portalImage} />
        <IntroFold portrait={portraitImage} />
        <Manifesto media={manifestoMedia} />
        <FeaturedProjects projects={projects} />
        <ProjectIndex />
        <Services />
        <Capabilities />
        <Experience />
        <Stack />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

import AboutMeSection from "./components/home/about-me-section";
import ExperienceSection from "./components/home/experience-section";
import ProjectsSection from "./components/home/project-section";
import OtherStuffSection from "./components/home/other-stuff-section";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 pb-3 lg:pb-6 lg:px-24 lg:pt-16 bg-zinc-800 font-mono">
      <AboutMeSection />
      <ExperienceSection />
      <ProjectsSection />
      <OtherStuffSection />
    </main>
  );
}

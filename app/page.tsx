import AboutMeSection from "./components/home/about-me-section";
import ExperienceSection from "./components/home/experience-section";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 pb-3 lg:pb-6 lg:px-24 lg:pt-16 font-mono bg-stone-800">
      <AboutMeSection />
      <ExperienceSection />
    </main>
  );
}

import CTABar from '@/components/CTABar';
import Portrait from '@/components/Portrait';
import TimelineTabs, { ExperienceEntry, EducationEntry } from '@/components/TimelineTabs';
import { experiences, educations } from '@/data/timelineData';
import TechnicalExpertise from '@/components/TechnicalExpertise';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <section className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-start gap-8 md:gap-10">
        {/* Text Content */}
        <div className="order-last md:order-first">
          <h1 className="text-4xl font-bold mb-2">
            Hi, I&apos;m Meng Han{' '}
            <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-xl text-slate-600 mb-4">
            Computer Vision Engineer based in Singapore 🇸🇬.
          </p>

          {/* Open to Work Box */}
          <section className="bg-blue-50 rounded-lg p-6 border border-blue-200 mb-6">
            <h2 className="text-xl font-semibold mb-2">Open to Collaboration!</h2>
            <p className="text-slate-700">
              I&apos;m actively learning edge AI and electronics, and am open to projects, collaborations, or just chatting about AI and technology. Feel free to reach out!
            </p>
          </section>

          <CTABar />
        </div>

        {/* Portrait */}
        <div className="order-first md:order-last">
          <Portrait />
        </div>
      </section>

      <section>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 py-1">My Journey</h1>
          <TimelineTabs experiences={experiences} educations={educations} />
        </div>
      </section>

      <TechnicalExpertise />
    </div>
  );
}
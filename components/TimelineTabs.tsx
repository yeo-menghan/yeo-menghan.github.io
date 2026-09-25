"use client";

import Image from 'next/image';
import { useState } from 'react';

interface TimelineEntry {
  id: string;
  period: string;
  bullets: string[];
  logoUrl?: string;
}

export interface ExperienceEntry extends TimelineEntry {
  company: string;
  role: string;
}

export interface EducationEntry extends TimelineEntry {
  school: string;
  degree: string;
}

interface TimelineTabsProps {
  experiences: ExperienceEntry[];
  educations: EducationEntry[];
}

export default function TimelineTabs({ experiences, educations }: TimelineTabsProps) {
  const [activeTab, setActiveTab] = useState<'work' | 'education'>('work');

  const renderEntry = (entry: ExperienceEntry | EducationEntry) => {
    const { id, logoUrl, period, bullets } = entry;
    const title = 'school' in entry ? entry.school : entry.company;
    const subtitle = 'degree' in entry ? entry.degree : entry.role;

    return (
      <div key={id} className="flex gap-4 py-6 last:pb-0">
        {/* Logo */}
        <div className="relative flex-shrink-0 w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-slate-200">
          {logoUrl ? (
            <Image width={48} height={48} src={logoUrl} alt={`${title} logo`} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-slate-700">
              {title.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:items-start">
            <div className="min-w-0 sm:max-w-[65%]">
              <h3 className="font-semibold text-lg text-slate-900 leading-tight break-words">{title}</h3>
              <p className="text-blue-600 mt-1">{subtitle}</p>
            </div>
            <span className="text-sm text-slate-500 whitespace-nowrap sm:w-40 sm:flex-shrink-0 sm:text-right">{period}</span>
          </div>

          {/* Experience details */}
          <ul className="mt-3 space-y-1 text-slate-700 list-disc list-outside pl-5">
            {bullets.map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200">
      {/* Tabs */}
      <div className="flex mb-6 rounded-lg bg-slate-100 overflow-hidden">
        <button
          onClick={() => setActiveTab('work')}
          className={`flex-1 py-2 px-4 font-medium transition ${
            activeTab === 'work'
              ? 'bg-blue-600 text-white'
              : 'text-slate-700 hover:bg-slate-200'
          }`}
        >
          Work
        </button>
        <button
          onClick={() => setActiveTab('education')}
          className={`flex-1 py-2 px-4 font-medium transition ${
            activeTab === 'education'
              ? 'bg-blue-600 text-white'
              : 'text-slate-700 hover:bg-slate-200'
          }`}
        >
          Education
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'work' &&
          experiences.map((exp) => renderEntry(exp))}
        {activeTab === 'education' &&
          educations.map((edu) => renderEntry(edu))}
      </div>
    </div>
  );
}

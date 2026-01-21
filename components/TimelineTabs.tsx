// components/TimelineTabs.tsx
"use client";

import { useState } from 'react';

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  period: string;
  bullets: string[];
  logoUrl?: string;
  projectBadges?: string[];
}

export interface EducationEntry {
  id: string;
  school: string;
  degree: string;
  period: string;
  bullets: string[];
  logoUrl?: string;
  projectBadges?: string[];
}

interface TimelineTabsProps {
  experiences: ExperienceEntry[];
  educations: EducationEntry[];
}

export default function TimelineTabs({ experiences, educations }: TimelineTabsProps) {
  const [activeTab, setActiveTab] = useState<'work' | 'education'>('work');

  const renderEntry = (entry: any, isEducation = false) => {
    const { id, logoUrl, period, bullets, projectBadges } = entry;
    const title = isEducation ? entry.school : entry.company;
    const subtitle = isEducation ? entry.degree : entry.role;

    return (
      <div key={id} className="flex gap-4 py-6 last:pb-0">
        {/* Logo + Timeline Line */}
        <div className="relative flex-shrink-0 w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
          {logoUrl ? (
            <img src={logoUrl} alt={`${title} logo`} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {title.slice(0, 2).toUpperCase()}
            </span>
          )}
          {/* Vertical connector line */}
          <div className="absolute top-full left-1/2 w-0.5 h-full -translate-x-1/2 bg-slate-200 dark:bg-slate-700"></div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">{title}</h3>
              <p className="text-blue-600 dark:text-blue-400 mt-1">{subtitle}</p>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">{period}</span>
          </div>

          {/* Bullet points — aligned like your Experience Highlights */}
          <ul className="mt-3 space-y-1 text-slate-700 dark:text-slate-300 list-disc list-outside pl-5">
            {bullets.map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>

          {/* Project Badges */}
          {projectBadges && projectBadges.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {projectBadges.map((badge, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 00-9-9H9M9 3v2m3-2h3m3 2h3M9 17h3m3 2h3m3-2h3M9 12h3m3 2h3m3-2h3M9 9h3m3 2h3m3-2h3" />
                  </svg>
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-800">
      {/* Tabs */}
      <div className="flex mb-6 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <button
          onClick={() => setActiveTab('work')}
          className={`flex-1 py-2 px-4 font-medium transition ${
            activeTab === 'work'
              ? 'bg-blue-600 text-white'
              : 'text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700'
          }`}
        >
          Work
        </button>
        <button
          onClick={() => setActiveTab('education')}
          className={`flex-1 py-2 px-4 font-medium transition ${
            activeTab === 'education'
              ? 'bg-blue-600 text-white'
              : 'text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700'
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
          educations.map((edu) => renderEntry(edu, true))}
      </div>
    </div>
  );
}
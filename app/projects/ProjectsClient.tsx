'use client';

import { useState } from 'react';
import ProjectCard from '@/components/ProjectCard';
import { Filter } from 'lucide-react';

interface Project {
  slug: string;
  title: string;
  date: string;
  description?: string;
  tags: string[];
  github?: string;
  link?: string;
}

export default function ProjectsClient({ projects, allTags }: { projects: Project[], allTags: string[] }) {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');

  const filteredProjects = selectedTag === 'All' 
    ? projects 
    : projects.filter(p => p.tags?.includes(selectedTag));

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Projects</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          A collection of my work in AI, machine learning, and computer vision
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mb-8 items-center">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-slate-600 dark:text-slate-400" />
          <span className="text-sm font-medium">Filter:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag('All')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              selectedTag === 'All'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedTag === tag
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'title')}
            className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProjects.map(project => (
          <ProjectCard
            key={project.slug}
            title={project.title}
            description={project.description}
            date={project.date}
            tags={project.tags || []}
            slug={project.slug}
            github={project.github}
            link={project.link}
          />
        ))}
      </div>

      {sortedProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400">
            No projects found with the selected filters.
          </p>
        </div>
      )}
    </div>
  );
}
import Link from 'next/link';
import { Calendar, Tag, Github, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description?: string;
  date: string;
  tags: string[];
  slug: string;
  github?: string;
  link?: string;
}

export default function ProjectCard({
  title,
  description,
  date,
  tags,
  slug,
  github,
  link,
}: ProjectCardProps) {
  return (
    <div className="relative border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-lg dark:hover:shadow-slate-800/50 transition-all hover:border-blue-500 dark:hover:border-blue-500 group">
      {/* Full-card clickable overlay */}
      <Link
        href={`/projects/${slug}`}
        aria-label={`Open project: ${title}`}
        className="absolute inset-0 rounded-lg z-0"
      />

      {/* Let clicks pass through to the overlay by default */}
      <div className="relative pointer-events-none">
        <h3 className="text-xl font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>

        {(github || link) && (
          <div className="mt-2 flex flex-wrap gap-2 pointer-events-auto relative z-10">
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Github size={14} />
                GitHub
              </a>
            )}
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <ExternalLink size={14} />
                Link
              </a>
            )}
          </div>
        )}

        {description && (
          <p className="text-slate-600 dark:text-slate-400 mt-4 mb-4 line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <span>{date}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs"
            >
              <Tag size={12} />
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
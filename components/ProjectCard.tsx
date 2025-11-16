import Link from 'next/link';
import { Calendar, Tag } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description?: string;
  date: string;
  tags: string[];
  slug: string;
}

export default function ProjectCard({ title, description, date, tags, slug }: ProjectCardProps) {
  return (
    <Link href={`/projects/${slug}`}>
      <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-lg dark:hover:shadow-slate-800/50 transition-all hover:border-blue-500 dark:hover:border-blue-500 group">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        {description && (
          <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
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
          {tags.map(tag => (
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
    </Link>
  );
}
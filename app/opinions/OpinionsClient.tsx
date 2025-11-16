'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface Opinion {
  slug: string;
  title: string;
  excerpt?: string;
  date: string;
  readTime?: string;
}

export default function OpinionsClient({ opinions }: { opinions: Opinion[] }) {
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');

  const sortedOpinions = [...opinions].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-4">Opinions</h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              My thoughts on AI, technology, and software development
            </p>
          </div>
          <div>
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
      </div>

      <div className="space-y-6">
        {sortedOpinions.map(opinion => (
          <Link key={opinion.slug} href={`/opinions/${opinion.slug}`}>
            <article className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-lg dark:hover:shadow-slate-800/50 transition-all hover:border-blue-500 dark:hover:border-blue-500 group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {opinion.title}
                  </h2>
                  {opinion.excerpt && (
                    <p className="text-slate-600 dark:text-slate-400 mb-3">
                      {opinion.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{opinion.date}</span>
                    </div>
                    {opinion.readTime && (
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{opinion.readTime}</span>
                      </div>
                    )}
                  </div>
                </div>
                <ArrowRight className="text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0" size={20} />
              </div>
            </article>
          </Link>
        ))}
      </div>

      {sortedOpinions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400">
            No opinion articles yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
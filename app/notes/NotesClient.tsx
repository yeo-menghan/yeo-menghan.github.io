'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, FolderOpen, ArrowRight, FileText } from 'lucide-react';

interface Note {
  slug: string;
  title: string;
  date: string;
  updatedDate?: string;
  category: string;
  paper?: {
    title: string;
    authors: string;
    year: number;
    url: string;
  };
}

export default function NotesClient({ notes, categories }: { notes: Note[], categories: string[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredNotes = selectedCategory === 'All'
    ? notes
    : notes.filter(n => n.category === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Notes</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
          Research paper summaries, technical concepts, and learning notes
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              selectedCategory === 'All'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredNotes.map(note => (
          <Link key={note.slug} href={`/notes/${note.slug}`} className='block'>
            <article className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-lg dark:hover:shadow-slate-800/50 transition-all hover:border-blue-500 dark:hover:border-blue-500 group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {note.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-500">
                    <div className="flex items-center gap-1">
                      <FolderOpen size={16} />
                      <span>{note.category}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{note.date}</span>
                      {note.updatedDate && note.updatedDate !== note.date && (
                        <span className="text-sm text-slate-400 dark:text-slate-500">
                          • updated {note.updatedDate}
                        </span>
                      )}
                    </div>
                    {note.paper && (
                      <div className="flex items-center gap-1">
                        <FileText size={16} />
                        <span className="text-xs">
                          {note.paper.authors} ({note.paper.year})
                        </span>
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

      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400">
            No notes found in this category.
          </p>
        </div>
      )}
    </div>
  );
}
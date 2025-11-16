import { notFound } from 'next/navigation';
import { getContentByType, getContentBySlug } from '@/lib/content';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { Calendar, FolderOpen, ArrowLeft, FileText, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export async function generateStaticParams() {
  const notes = getContentByType('notes');
  return notes.map(note => ({
    slug: note.slug,
  }));
}

export default function NoteDetailPage({ params }: { params: { slug: string } }) {
  const note = getContentBySlug('notes', params.slug);

  if (!note) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link 
        href="/notes"
        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-8"
      >
        <ArrowLeft size={20} />
        Back to Notes
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{note.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-400 mb-6">
            <div className="flex items-center gap-2">
              <FolderOpen size={18} />
              <span>{note.category}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{note.date}</span>
            </div>
          </div>

          {note.paper && (
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-8">
              <div className="flex items-start gap-3">
                <FileText size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Paper Summary</h3>
                  <p className="text-slate-700 dark:text-slate-300 mb-1">
                    {note.paper.title}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {note.paper.authors} • {note.paper.year}
                  </p>
                  {note.paper.url && (
                    <a 
                      href={note.paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2"
                    >
                      Read Paper
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </header>

        <MarkdownRenderer content={note.content} />
      </article>
    </div>
  );
}
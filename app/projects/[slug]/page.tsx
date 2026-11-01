import { notFound } from 'next/navigation';
import { getContentByType, getContentBySlug, getArticleMetadata } from '@/lib/content';
import ArticleBody from '@/components/ArticleBody';
import { Calendar, Tag, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return getArticleMetadata('projects', params.slug);
}

export async function generateStaticParams() {
  const projects = await getContentByType('projects');
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getContentBySlug('projects', params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-8"
      >
        <ArrowLeft size={20} />
        Back to Projects
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{project.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-slate-600 mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{project.date}</span>
            </div>

            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:underline"
              >
                <ExternalLink size={18} />
                View on GitHub
              </a>
            )}

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:underline"
              >
                <ExternalLink size={18} />
                View Project
              </a>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tags?.map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
              >
                <Tag size={14} />
                {tag}
              </span>
            ))}
          </div>
        </header>

        <ArticleBody content={project.content} body={project.body} />
      </article>
    </div>
  );
}
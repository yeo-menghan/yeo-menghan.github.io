import { notFound } from 'next/navigation';
import { getContentByType, getContentBySlug, getArticleMetadata } from '@/lib/content';
import ArticleBody from '@/components/ArticleBody';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  return getArticleMetadata('opinions', params.slug);
}

export async function generateStaticParams() {
  const opinions = await getContentByType('opinions');
  return opinions.map(opinion => ({
    slug: opinion.slug,
  }));
}

export default async function OpinionDetailPage({ params }: { params: { slug: string } }) {
  const opinion = await getContentBySlug('opinions', params.slug);

  if (!opinion) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link 
        href="/opinions"
        className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-8"
      >
        <ArrowLeft size={20} />
        Back to Opinions
      </Link>

      <article className="prose prose-slate max-w-none">
        <header className="not-prose mb-8">
          <h1 className="text-4xl font-bold mb-4">{opinion.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{opinion.date}</span>
            </div>
            {opinion.readTime && (
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>{opinion.readTime}</span>
              </div>
            )}
          </div>
        </header>

        <ArticleBody content={opinion.content} body={opinion.body} />
      </article>
    </div>
  );
}
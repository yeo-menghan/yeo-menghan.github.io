import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import { parseArticleMarkdown } from './cms/frontmatter.mjs';
import { draftMode, cookies } from 'next/headers';
import { validPreviewSession } from './cms/preview-auth.mjs';
import type { PortableTextBlock } from '@portabletext/react';
import { cmsEnabled, contentTypes, type ContentType } from './cms/config';
import { sanityQuery } from './cms/sanity';

export type { ContentType } from './cms/config';
export interface ContentItem {
  slug: string;
  type?: ContentType;
  title: string;
  date: string;
  updatedDate?: string;
  content: string;
  body?: PortableTextBlock[];
  description?: string;
  excerpt?: string;
  tags?: string[];
  readTime?: string;
  github?: string;
  link?: string;
  category?: string;
  paper?: { title: string; authors: string; year: number; url: string };
}
export interface Project extends ContentItem { tags: string[] }
export interface Note extends ContentItem { category: string }

function isPreview() {
  return cmsEnabled() && draftMode().isEnabled && validPreviewSession(cookies().get('cms-preview')?.value, process.env.SANITY_PREVIEW_SECRET || '');
}

const contentDirectory = path.join(process.cwd(), 'content');
const projection = `{
  "slug": slug.current, "type": collection, title, date, updatedDate,
  description, excerpt, tags, readTime, github, link, category, paper,
  "content": "", body[]{..., _type == "articleImage" => {..., asset->{url}}}
}`;

function localArticle(type: ContentType, filename: string): ContentItem {
  const { metadata: data, content } = parseArticleMarkdown(fs.readFileSync(path.join(contentDirectory, type, filename), 'utf8'));
  return { ...data, title: data.title || '', date: data.date || '', updatedDate: data.updatedDate ?? data.date,
    slug: filename.slice(0, -3), type, content } as ContentItem;
}

export async function getContentByType(type: ContentType): Promise<ContentItem[]> {
  if (!contentTypes.includes(type)) throw new Error('Unknown content collection');
  if (cmsEnabled()) {
    return sanityQuery<ContentItem[]>(`*[_type == "article" && collection == $type] | order(date desc) ${projection}`, { type }, false);
  }
  const dir = path.join(contentDirectory, type);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(file => file.endsWith('.md')).map(file => localArticle(type, file))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getContentBySlug(type: ContentType, slug: string): Promise<ContentItem | null> {
  if (!contentTypes.includes(type) || !/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,119}$/.test(slug)) return null;
  if (cmsEnabled()) {
    return sanityQuery<ContentItem | null>(`*[_type == "article" && collection == $type && slug.current == $slug][0] ${projection}`, { type, slug }, isPreview());
  }
  const file = `${slug}.md`;
  if (!fs.existsSync(path.join(contentDirectory, type, file))) return null;
  // Parsing errors should fail visibly rather than masquerading as missing articles.
  return localArticle(type, file);
}

export async function getArticleMetadata(type: ContentType, slug: string): Promise<Metadata> {
  const article = await getContentBySlug(type, slug);
  if (!article) return { title: 'Article not found', robots: { index: false } };
  return {
    title: article.title,
    description: article.description || article.excerpt,
    alternates: { canonical: `/${type}/${slug}` },
    ...(isPreview() ? { robots: { index: false, follow: false } } : {}),
  };
}

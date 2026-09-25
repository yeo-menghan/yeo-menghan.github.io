import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export type ContentType = 'projects' | 'opinions' | 'notes';

export interface ContentItem {
  slug: string;
  title: string;
  date: string;
  updatedDate?: string; 
  content: string;
  description?: string;
  excerpt?: string;
  tags?: string[];
  readTime?: string;
  github?: string;
  link?: string;
  category?: string;
  paper?: {
    title: string;
    authors: string;
    year: number;
    url: string;
  };
}

export interface Project extends ContentItem {
  description?: string;
  tags: string[];
  github?: string;
  link?: string;
}

export interface Note extends ContentItem {
  category: string;
  paper?: {
    title: string;
    authors: string;
    year: number;
    url: string;
  };
}

export function getContentByType(type: ContentType): ContentItem[] {
  const dirPath = path.join(contentDirectory, type);
  
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const files = fs.readdirSync(dirPath);
  const items = files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const filePath = path.join(dirPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);
      
      const item: ContentItem = {
        slug: file.replace('.md', ''),
        title: data.title || '',
        date: data.date || '',
        updatedDate: data.updatedDate ?? data.date,
        content,
        description: data.description,
        excerpt: data.excerpt,
        tags: data.tags,
        readTime: data.readTime,
        github: data.github,
        link: data.link,
        category: data.category,
        paper: data.paper,
      };

      // Validate required fields based on type
      if (type === 'projects' && !data.description) {
        console.warn(`Warning: Project "${file}" is missing required field: description`);
      }
      if (type === 'notes' && !data.category) {
        console.warn(`Warning: Note "${file}" is missing required field: category`);
      }

      return item;
    });

  return items.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getContentBySlug(
  type: ContentType,
  slug: string
): ContentItem | null {
  try {
    const fullPath = path.join(contentDirectory, type, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      content,
      ...data,
    } as ContentItem;
  } catch (error) {
    return null;
  }
}

export function getAllTags(type: ContentType): string[] {
  const items = getContentByType(type);
  const tags = new Set<string>();
  
  items.forEach(item => {
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach((tag: string) => tags.add(tag));
    }
  });

  return Array.from(tags).sort();
}

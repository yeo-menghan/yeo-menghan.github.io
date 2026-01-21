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

export interface Opinion extends ContentItem {
  excerpt: string;
  readTime: string;
}

export interface Note extends ContentItem {
  category: string; // Required for notes
  paper?: {
    title: string;
    authors: string;
    year: number;
    url: string;
  };
}

export function getContentByType(type: ContentType): ContentItem[] {
  const dirPath = path.join(process.cwd(), 'content', type);
  
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
      
      // Build the base item
      const item: ContentItem = {
        slug: file.replace('.md', ''),
        title: data.title || '',
        date: data.date || '',
        updatedDate: data.updatedDate ?? data.date, // 👈 IMPORTANT
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

export function getAllCategories(type: 'notes'): string[] {
  const items = getContentByType(type);
  const categories = new Set<string>();
  
  items.forEach(item => {
    if (item.category) {
      categories.add(item.category);
    }
  });

  return Array.from(categories).sort();
}

export function getWebsiteContent(): string {
  const projects = getContentByType('projects');
  const opinions = getContentByType('opinions');
  const notes = getContentByType('notes');

  const aboutContent = `
About Yeo Meng Han:
- Currently pursuing Master of Science in Data Science and Machine Learning at NUS
- Bachelor of Engineering in Computer Engineering from NUS (First Class Honours, GPA 4.51/5.00)
- Engineering Scholarship Programme recipient
- Based in Singapore
- Email: yeomenghan1989@gmail.com

Work Experience:
1. Changi Airport Group - Machine Learning Engineer Intern (May-Aug 2025)
2. NUS Accelerated Digital Economy Lab - Computer Vision Research Assistant (Jan-May 2025)
3. Rockship (NUS Overseas College Vietnam) - AI & Computer Vision Engineer Intern (Jan-Jun 2024)
4. DSTA - Robotics Engineer Intern (May-Jul 2023)

Technical Skills:
- Programming: Python, C, C++
- Web: React.js, Next.js, Node.js, TypeScript
- AI/ML: PyTorch, TensorFlow, OpenCV, LangChain, LlamaIndex, RAG, LoRA
- Cloud: AWS, Google Cloud Platform
- DevOps: Docker, GitHub Actions
- Other: ROS, MQTT, Computer Networks

Interests:
- Deep learning and neural networks
- Large Language Models and Diffusion Models
- Computer Vision
- AI applications in real-world problems
  `;

  const projectsContent = projects.map(p => `
Project: ${p.title}
Date: ${p.date}
Tags: ${p.tags?.join(', ') || 'N/A'}
Description: ${p.description}
${p.content}
  `).join('\n\n');

  const opinionsContent = opinions.map(o => `
Opinion Article: ${o.title}
Date: ${o.date}
${o.content}
  `).join('\n\n');

  const notesContent = notes.map(n => `
Note: ${n.title}
Category: ${n.category}
Date: ${n.date}
${n.content}
  `).join('\n\n');

  return `
${aboutContent}

${projectsContent}

${opinionsContent}

${notesContent}
  `.trim();
}
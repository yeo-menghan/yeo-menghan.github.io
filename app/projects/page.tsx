export const metadata = { title: 'Projects', alternates: { canonical: '/projects' } };
import ProjectsClient from './ProjectsClient';
import { getContentByType, Project } from '@/lib/content';

export default async function ProjectsPage() {
  const projects = await getContentByType('projects') as Project[];
  const allTags = Array.from(new Set(projects.flatMap(project => project.tags || []))).sort();

  return <ProjectsClient projects={projects} allTags={allTags} />;
}
export const metadata = { title: 'Projects', alternates: { canonical: '/projects' } };
import ProjectsClient from './ProjectsClient';
import { getContentByType, Project } from '@/lib/content';

export default async function ProjectsPage() {
  const projects = await getContentByType('projects') as Project[];

  return <ProjectsClient projects={projects} />;
}

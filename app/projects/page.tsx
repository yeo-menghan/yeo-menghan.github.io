import ProjectsClient from './ProjectsClient';
import { getContentByType, getAllTags, Project } from '@/lib/content';

export default function ProjectsPage() {
  const projects = getContentByType('projects') as Project[];
  const allTags = getAllTags('projects');

  return <ProjectsClient projects={projects} allTags={allTags} />;
}
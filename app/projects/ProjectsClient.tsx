'use client';
import ProjectCarousel from '@/components/ProjectCarousel';
import { orderProjects } from '@/data/selected-projects';
export default function ProjectsClient({ projects }: { projects: {slug: string; title: string; description?: string; tags: string[]}[] }) {
  return <section className="project-section archive"><p className="eyebrow">EXPERIMENTS & EXPLORATIONS</p><h1>Projects<span>.</span></h1><p className="archive-intro">Things I’ve built, tested and learned from.</p><ProjectCarousel projects={orderProjects(projects)} /></section>;
}

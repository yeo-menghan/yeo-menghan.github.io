import Workshop from '@/components/workshop/Workshop';
import ProjectCarousel from '@/components/ProjectCarousel';
import { getContentByType } from '@/lib/content';
import { orderProjects } from '@/data/selected-projects';
export default async function HomePage() {
  const projects = orderProjects(await getContentByType('projects')).slice(0, 3);
  return <>
    <section className="rooftop-intro"><div><p className="eyebrow"><span className="status-dot" /> COMPUTER VISION ENGINEER · SINGAPORE</p><h1>Yeo Meng Han<span>.</span></h1><p>I build intelligent systems that connect software to the physical world.</p></div><a className="rooftop-index" href="#projects">Step inside the workshop <span>↓</span></a></section>
    <Workshop />
    <section id="projects" className="project-section" aria-labelledby="projects-heading" tabIndex={-1}><div className="section-heading"><div><p className="eyebrow">FROM THE WORKBENCH</p><h2 id="projects-heading">Selected experiments.</h2></div><a className="text-link" href="/projects">All projects ↗</a></div><ProjectCarousel projects={projects} /></section>
  </>;
}

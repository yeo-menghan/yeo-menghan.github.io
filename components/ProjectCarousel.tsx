'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { selectedProjects } from '@/data/selected-projects';
type Project = { slug: string; title: string; description?: string; tags?: string[] };
export default function ProjectCarousel({ projects }: { projects: Project[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    // Applied only after hydration: every project remains reachable without JS.
    track.current?.querySelectorAll<HTMLElement>('.project-slide').forEach((slide, i) => {
      if (i !== index && slide.contains(document.activeElement)) track.current?.focus({ preventScroll: true });
      slide.inert = i !== index;
      if (i !== index) slide.setAttribute('aria-hidden', 'true');
      else slide.removeAttribute('aria-hidden');
    });
  }, [index]);
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const resize = new ResizeObserver(() => {
      const active = element.querySelector<HTMLElement>('.project-slide:not([aria-hidden])');
      if (active) element.scrollLeft = active.offsetLeft - element.offsetLeft;
    });
    resize.observe(element);
    return () => resize.disconnect();
  }, []);
  function move(next: number) {
    const element = track.current;
    if (!element) return;
    const bounded = Math.max(0, Math.min(projects.length - 1, next));
    element.scrollTo({ left: bounded * element.clientWidth, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  if (!projects.length) return <p>Projects are being prepared.</p>;
  return <div className="project-carousel" role="region" aria-roledescription="carousel" aria-label="Projects" onKeyDown={event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(index + (event.key === 'ArrowRight' ? 1 : -1)); }
  }}>
    <div className="project-track" ref={track} tabIndex={0} aria-label="Swipe or use arrow keys to browse projects" onScroll={() => {
      if (track.current) setIndex(Math.round(track.current.scrollLeft / track.current.clientWidth));
    }}>
      {projects.map((project, i) => {
        const selected = selectedProjects[project.slug];
        return <article className="project-slide" key={project.slug} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${projects.length}: ${project.title}`}>
          <div className={`study-art ${selected?.diagram || 'route'}`}><span className="study-art-label">{String(i + 1).padStart(2, '0')} / SYSTEM STUDY</span>
            <svg viewBox="0 0 500 270" fill="none" aria-hidden="true">
              {selected?.diagram === 'vision' ? <><path d="M170 55h-35v35m195-35h35v35M135 180v35h35m195-35v35h-35" /><ellipse cx="250" cy="135" rx="63" ry="86" /><path d="M223 112h9m37 0h9m-29 12-8 30h15m-29 20q23 14 46 0M163 135h174" /><circle cx="226" cy="112" r="3" /><circle cx="274" cy="112" r="3" /></> : selected?.diagram === 'pose' ? <><circle cx="119" cy="79" r="18" /><path d="m136 94 88 44 92 12 79 64m-171-76-12 76h-43m147-64 22 64h57" />{[[136,94],[224,138],[316,150],[212,214],[338,214]].map(([x,y])=><circle key={x} cx={x} cy={y} r="6" />)}</> : <><path d="m85 185 80-100 85 95 85-95 80 85" strokeDasharray="7 7" />{[[85,185],[165,85],[250,180],[335,85],[415,170]].map(([x,y],j)=><g key={x}><circle cx={x} cy={y} r="19" /><text x={x} y={y+5} textAnchor="middle">{j+1}</text></g>)}</>}
            </svg><span className="study-art-caption">ILLUSTRATIVE DIAGRAM</span></div>
          <div className="study-copy"><p className="eyebrow">{selected?.kind || 'PROJECT ARCHIVE'}</p><h3>{project.title}</h3><p>{selected?.description || project.description}</p><p className="study-tags">{project.tags?.slice(0,4).join(' / ')}</p><Link className="text-link" href={`/projects/${project.slug}`}>View project ↗</Link></div>
        </article>;
      })}
    </div><div className="carousel-controls"><span aria-live="polite" aria-atomic="true">{String(index + 1).padStart(2,'0')} / {String(projects.length).padStart(2,'0')}</span><div><button aria-label="Previous project" disabled={index === 0} onClick={() => move(index - 1)}>←</button><button aria-label="Next project" disabled={index === projects.length - 1} onClick={() => move(index + 1)}>→</button></div></div>
  </div>;
}

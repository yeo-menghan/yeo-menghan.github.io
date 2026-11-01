'use client';
import { Component, useCallback, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { workshopObjects, type WorkshopId } from '@/data/workshop';
const Scene = dynamic(() => import('./WorkshopScene'), { ssr: false, loading: () => <span className="rooftop-loading" role="status">Opening the workshop…</span> });
export type SceneCommand = { id: number; action: 'drone' | 'debug_switch' };
export default function Workshop() {
  const [entered, setEntered] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const [vision, setVision] = useState(false);
  const [debug, setDebug] = useState(false);
  const [message, setMessage] = useState('A little curiosity goes a long way.');
  const [selected, setSelected] = useState<WorkshopId | null>(null);
  const [command, setCommand] = useState<SceneCommand | null>(null);
  const error = useCallback(() => { setFailed(true); setEntered(false); setReady(false); }, []);
  const onReady = useCallback(() => setReady(true), []);
  const onStatus = useCallback((status: string) => setMessage(status), []);
  const activate = useCallback((id: string) => {
    if (id === 'monitor') { const projects = document.getElementById('projects'); projects?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); projects?.focus({ preventScroll: true }); return; }
    if (id === 'camera') { setVision(value => !value); setMessage('Illustrative vision overlay. No camera or tracking data is used.'); return; }
    if (id === 'debug_switch') { setDebug(value => !value); setCommand(value => ({ id: (value?.id || 0) + 1, action: 'debug_switch' })); return; }
    if (id === 'drone') { setCommand(value => ({ id: (value?.id || 0) + 1, action: 'drone' })); return; }
    setSelected(id as WorkshopId);
  }, []);
  const object = workshopObjects.find(item => item.id === selected);
  return <section className="rooftop-workshop" aria-label="After-hours rooftop robotics workshop">
    <div className="rooftop-scene">
      <picture><source media="(max-width: 600px)" srcSet="/images/workshop-poster-mobile.webp" /><img className="rooftop-poster" src="/images/workshop-poster.webp" alt="A miniature rooftop workshop at night: a quadcopter on its landing pad, tools and a glowing terminal beneath a timber canopy, overlooking a city." fetchPriority="high" /></picture>
      <div className="rooftop-scene-label"><span><i className="status-dot" /> THE ROOFTOP LAB</span><span>01 / AFTER HOURS</span></div>
      {entered && <Boundary onError={error}><Scene onReady={onReady} onError={error} onSelect={activate} onStatus={onStatus} command={command} paused={paused} /></Boundary>}
      {vision && <div className="vision-overlay" aria-hidden="true"><span className="vision-box drone-box">QUADCOPTER / ILLUSTRATION</span><span className="vision-box bench-box">WORKBENCH / ILLUSTRATION</span><span className="vision-disclaimer">ILLUSTRATIVE VISION MODE · NO LIVE INPUT</span></div>}
      <div className="rooftop-scene-actions">{!entered ? <button onClick={() => { setEntered(true); setFailed(false); setPaused(false); setDebug(false); setCommand(null); }}>{failed ? 'Retry interactive scene ↗' : 'Explore in 3D ↗'}</button> : <><button onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? 'Resume' : 'Pause'}</button><button onClick={() => { setEntered(false); setReady(false); setDebug(false); }}>Return to still ×</button></>}</div>
      {entered && !ready && <span className="rooftop-loading" role="status">Loading the workshop…</span>}
    </div>
    <div className="rooftop-toolbar"><span className="rooftop-caption">A place for ideas to take flight.</span><div aria-label="Workshop interactions"><button disabled={!ready || paused} onClick={() => activate('drone')}>Launch drone ↗</button><button aria-pressed={vision} onClick={() => activate('camera')}>Vision {vision ? 'on' : 'off'}</button><button onClick={() => activate('monitor')}>Open projects ↓</button><details><summary aria-label="Discover more workshop controls">···</summary><div className="workshop-more"><button disabled={!ready} aria-pressed={debug} onClick={() => activate('debug_switch')}>Diagnostics {debug ? 'on' : 'off'}</button><a href="/about#experience">Robotics experience ↗</a><a href="/notes">Open notebook ↗</a></div></details></div></div>
    <p className="workshop-status" role="status">{failed ? '3D unavailable. The workshop image, projects and links remain available.' : message} <span>Scene interactions are playful illustrations.</span></p>
    {object && <div className="rooftop-detail"><button aria-label="Close object details" onClick={() => setSelected(null)}>×</button><p>{object.detail}</p><a href={object.href}>Explore {object.name.toLowerCase()} ↗</a></div>}
    <noscript><p>Browse <a href="#projects">projects</a> or <a href="/about#experience">robotics experience</a>. Interactive 3D requires JavaScript.</p></noscript>
  </section>;
}
class Boundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

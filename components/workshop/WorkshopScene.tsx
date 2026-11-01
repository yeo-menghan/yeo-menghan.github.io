'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import type { SceneCommand } from './Workshop';
type Props = { onReady: () => void; onError: () => void; onSelect: (id: string) => void; onStatus: (message: string) => void; command: SceneCommand | null; paused: boolean };
function dispose(root: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  root.traverse(object => { if (object instanceof THREE.Mesh) { geometries.add(object.geometry); (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material)); } });
  materials.forEach(material => { Object.values(material).forEach(value => { if (value instanceof THREE.Texture) textures.add(value); }); material.dispose(); });
  textures.forEach(texture => { const data = texture.source?.data; if (typeof ImageBitmap !== 'undefined' && data instanceof ImageBitmap) data.close(); texture.dispose(); });
  geometries.forEach(geometry => geometry.dispose());
}
export default function WorkshopScene(props: Props) {
  const mount = useRef<HTMLDivElement>(null);
  const latest = useRef(props); latest.current = props;
  const run = useRef<(action: SceneCommand['action']) => void>();
  useEffect(() => { if (props.command) run.current?.(props.command.action); }, [props.command]);
  useEffect(() => {
    const host = mount.current!;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' }); } catch { latest.current.onError(); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.3;
    renderer.domElement.setAttribute('aria-label', 'Interactive miniature workshop; equivalent controls are below');
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene(); scene.background = new THREE.Color('#111d2b');
    scene.add(new THREE.HemisphereLight(0x9acaff, 0x18201c, 2.2));
    const moon = new THREE.DirectionalLight(0xadcfff, 3); moon.position.set(2,10,3); scene.add(moon);
    const warm = new THREE.PointLight(0xffb26b, 35, 10, 2); warm.position.set(-2,2.8,-2); scene.add(warm);
    const fill = new THREE.DirectionalLight(0x9ad4ca, 1.5); fill.position.set(2,4,8); scene.add(fill);
    const camera = new THREE.OrthographicCamera(-7,7,4.375,-4.375,.1,100); camera.position.set(12,12,17); camera.lookAt(0,1.1,-1);
    let alive = true, visible = true, model: THREE.Group | undefined, mixer: THREE.AnimationMixer | undefined;
    let flight: THREE.AnimationAction[] = [], flying = false, wireframe = false, frame = 0, previous = 0, flightTime = 0, dirty = true;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const resize = () => { const w=host.clientWidth, h=host.clientHeight; if (!w || !h) return; renderer.setSize(w,h); const halfHeight = w/h < 1 ? 7.5 : 7 / (w/h); camera.left=-halfHeight*w/h; camera.right=halfHeight*w/h; camera.top=halfHeight; camera.bottom=-halfHeight; camera.updateProjectionMatrix(); dirty=true; };
    const observer = new ResizeObserver(resize); observer.observe(host); resize();
    const intersection = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }); intersection.observe(host);
    const lost = (event: Event) => { event.preventDefault(); latest.current.onError(); };
    renderer.domElement.addEventListener('webglcontextlost', lost);
    new GLTFLoader().load('/models/workshop.glb', gltf => {
      if (!alive) { dispose(gltf.scene); return; }
      model=gltf.scene; scene.add(model); mixer=new THREE.AnimationMixer(model);
      flight=gltf.animations.map(clip => { const action=mixer!.clipAction(clip); action.setLoop(THREE.LoopOnce,1); action.clampWhenFinished=true; return action; });
      renderer.render(scene,camera); host.classList.add('is-ready'); latest.current.onReady();
    }, undefined, () => { if (alive) latest.current.onError(); });
    run.current = action => {
      if (!model) return;
      dirty=true;
      if (action === 'debug_switch') { wireframe=!wireframe; model.traverse(object => { if (object instanceof THREE.Mesh) (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => { if ('wireframe' in material) material.wireframe=wireframe; }); }); latest.current.onStatus(wireframe ? 'Diagnostics on. Toggle again to restore materials.' : 'Diagnostics off. Back to the night shift.'); return; }
      if (flying) return;
      if (reduced.matches) { latest.current.onStatus('Drone systems checked. Ready on the pad. Reduced motion keeps it grounded.'); return; }
      if (!flight.length) { latest.current.onStatus('Drone animation unavailable. Still safely on the pad.'); return; }
      flying=true; flightTime=0; flight.forEach(action => action.reset().play()); latest.current.onStatus('A quick inspection flight. Back in six seconds.');
    };
    const raycaster=new THREE.Raycaster(); const pointer=new THREE.Vector2();
    const pick = (event: PointerEvent) => { if (!model || latest.current.paused) return; const rect=renderer.domElement.getBoundingClientRect(); pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1); raycaster.setFromCamera(pointer,camera); const hit=raycaster.intersectObject(model,true)[0]; let object: THREE.Object3D | null=hit?.object || null; while(object) { if (['drone','camera','edge','bench','monitor','notebook','debug_switch'].includes(object.name)) { latest.current.onSelect(object.name); return; } object=object.parent; } };
    renderer.domElement.addEventListener('pointerup',pick);
    const render = (time: number) => { if (!alive) return; frame=requestAnimationFrame(render); const dt=Math.min((time-previous)/1000,.05); previous=time; if (document.hidden || !visible || latest.current.paused) return;
      if (flying && reduced.matches) { flight.forEach(action => action.stop()); flying=false; dirty=true; latest.current.onStatus('Drone returned to its pad. Reduced motion enabled.'); }
      if (flying) { mixer?.update(dt); flightTime+=dt; if (flightTime>=6) { flying=false; dirty=true; flight.forEach(action => action.stop()); latest.current.onStatus('Inspection complete. Back on the pad.'); } }
      if (flying || dirty) { renderer.render(scene,camera); dirty=false; }
    }; frame=requestAnimationFrame(render);
    return () => { alive=false; run.current=undefined; cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect(); renderer.domElement.removeEventListener('pointerup',pick); renderer.domElement.removeEventListener('webglcontextlost',lost); mixer?.stopAllAction(); if(model) { mixer?.uncacheRoot(model); dispose(model); } renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove(); };
  }, []);
  return <div className="rooftop-canvas" ref={mount} />;
}

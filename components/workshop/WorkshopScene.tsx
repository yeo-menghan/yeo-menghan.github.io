"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { WorkshopId } from "@/data/workshop";

export default function WorkshopScene({
  onSelect,
  onError,
}: {
  onSelect: (id: WorkshopId) => void;
  onError: () => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const pauseRef = useRef(false);
  useEffect(() => {
    pauseRef.current = paused;
  }, [paused]);
  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      onError();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x101d28);
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x101d28, 22, 65);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    const target = new THREE.Vector3(0, 1, 0);
    let angle = 0.72;
    const positionCamera = () => {
      camera.position.set(Math.sin(angle) * 16, 11, Math.cos(angle) * 16);
      camera.lookAt(target);
    };
    positionCamera();
    scene.add(new THREE.HemisphereLight(0xc3e6df, 0x17202b, 2.5));
    const sun = new THREE.DirectionalLight(0xffd3a4, 3);
    sun.position.set(-5, 10, 6);
    scene.add(sun);
    const mint = new THREE.PointLight(0x71e4ce, 25, 12);
    mint.position.set(0, 4, 0);
    scene.add(mint);
    const clickables: THREE.Object3D[] = [];
    function box(
      w: number,
      h: number,
      d: number,
      x: number,
      y: number,
      z: number,
      color: number,
      parent: THREE.Object3D = scene,
      glow = false,
    ) {
      const material = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.72,
        metalness: 0.25,
        ...(glow ? { emissive: color, emissiveIntensity: 0.7 } : {}),
      });
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
      mesh.position.set(x, y, z);
      parent.add(mesh);
      return mesh;
    }
    function group(id: WorkshopId, x: number, y: number, z: number) {
      const g = new THREE.Group();
      g.position.set(x, y, z);
      g.userData.id = id;
      scene.add(g);
      clickables.push(g);
      return g;
    }
    box(10, 0.45, 8, 0, -0.3, 0, 0x253e43);
    const grid = new THREE.GridHelper(10, 20, 0x46706c, 0x304a4c);
    grid.position.y = -0.06;
    grid.scale.z = 0.8;
    scene.add(grid);
    // Low parapets and rails leave the front of the diorama open.
    box(10, 0.5, 0.15, 0, 0.2, -4, 0x546963);
    box(0.15, 0.5, 8, -5, 0.2, 0, 0x546963);
    for (let i = 0; i < 6; i++) {
      box(0.05, 1.1, 0.05, -5 + i * 2, 0.8, -4, 0x8caaa0);
    }
    box(10, 0.05, 0.05, 0, 1.35, -4, 0x8caaa0);
    // Compact workshop, open on the visitor-facing side.
    box(5, 3, 0.15, -1, 1.5, -2.9, 0x2c444b);
    box(0.15, 3, 3, -3.5, 1.5, -1.4, 0x2c444b);
    box(5.4, 0.22, 3.3, -1, 3.1, -1.5, 0x4d6866);
    box(3, 0.04, 0.05, -1, 2.9, -2.75, 0x79ddc6, scene, true);
    box(1.8, 1.1, 0.05, -2, 1.7, -2.79, 0x408f85, scene, true);
    const bench = group("bench", -1, 0.0, -1.25);
    box(4, 0.18, 1.2, 0, 1.15, 0, 0x8b9a83, bench);
    for (const x of [-1.7, 1.7])
      for (const z of [-0.4, 0.4])
        box(0.09, 1.1, 0.09, x, 0.55, z, 0x576a68, bench);
    box(0.7, 0.06, 0.45, -1, 1.3, 0.2, 0x659868, bench);
    for (let i = 0; i < 5; i++)
      box(0.06, 0.07, 0.15, -1.2 + i * 0.1, 1.36, 0.2, 0xd4bb82, bench);
    const monitor = group("monitor", -0.7, 1.25, -1.45);
    box(1.2, 0.85, 0.12, 0, 0.55, 0, 0x0b1723, monitor);
    box(1.05, 0.68, 0.02, 0, 0.55, 0.07, 0x4fc1b1, monitor, true);
    box(0.08, 0.3, 0.1, 0, 0.05, 0, 0x789b93, monitor);
    for (let i = 0; i < 4; i++)
      box(
        0.7 - i * 0.1,
        0.03,
        0.02,
        -0.06,
        0.75 - i * 0.12,
        0.09,
        0x182e39,
        monitor,
      );
    const edge = group("edge", 0.6, 1.4, -1.2);
    box(0.6, 0.45, 0.6, 0, 0, 0, 0x202f39, edge);
    for (let i = 0; i < 5; i++)
      box(0.04, 0.5, 0.65, -0.24 + i * 0.12, 0.03, 0, 0x6c8581, edge);
    box(0.04, 0.04, 0.02, 0.2, 0, 0.32, 0x86e1af, edge, true);
    const cam = group("camera", -2.7, 1.5, 0.5);
    box(0.6, 0.4, 0.35, 0, 0, 0, 0x829890, cam);
    box(0.28, 0.28, 0.24, 0, 0, 0.25, 0x182d38, cam);
    const lens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 0.08, 16),
      new THREE.MeshStandardMaterial({ color: 0x69d9ce, emissive: 0x34786c }),
    );
    lens.rotation.x = Math.PI / 2;
    lens.position.z = 0.4;
    cam.add(lens);
    box(0.06, 1.3, 0.06, 0, -0.8, 0, 0x66817b, cam);
    const notebook = group("notebook", -1.5, 0.15, 2.4);
    const book = box(0.8, 0.12, 0.6, 0, 0, 0, 0xd3ba8b, notebook);
    book.rotation.y = -0.2;
    box(0.03, 0.13, 0.6, 0, 0.01, 0, 0x675c4d, notebook);
    const drone = group("drone", 2.8, 1.1, 1.6);
    box(0.55, 0.24, 0.6, 0, 0, 0, 0x96aaa0, drone);
    box(0.12, 0.1, 0.12, 0, -0.12, 0.35, 0x71e9d5, drone, true);
    const rotors: THREE.Mesh[] = [];
    for (const x of [-0.65, 0.65])
      for (const z of [-0.65, 0.65]) {
        const arm = box(1.6, 0.06, 0.07, 0, 0, 0, 0x66887e, drone);
        arm.rotation.y = x * z > 0 ? Math.PI / 4 : -Math.PI / 4;
        const rotor = new THREE.Mesh(
          new THREE.TorusGeometry(0.38, 0.025, 6, 24),
          new THREE.MeshStandardMaterial({
            color: 0x72ddc4,
            emissive: 0x24594e,
          }),
        );
        rotor.rotation.x = Math.PI / 2;
        rotor.position.set(x, 0.06, z);
        drone.add(rotor);
        const blade = box(0.65, 0.025, 0.07, x, 0.09, z, 0xabc3b4, drone);
        rotors.push(blade);
      }
    // Deterministic skyline; no external models or textures.
    for (let i = 0; i < 25; i++) {
      const x = ((i % 9) - 4) * 3.2;
      const z = -8 - Math.floor(i / 9) * 5;
      const h = 2 + ((i * 7) % 11) * 0.65;
      box(2, h, 2, x, h / 2 - 3, z, 0x1d303d);
      for (let row = 0; row < Math.floor(h); row++)
        for (let col = 0; col < 3; col++)
          if ((i + row + col) % 3)
            box(
              0.12,
              0.3,
              0.02,
              x - 0.6 + col * 0.6,
              row - 2,
              z + 1.02,
              (i + row) % 4 === 0 ? 0x72b0a0 : 0xa68c69,
              scene,
              true,
            );
    }
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      render();
    };
    const ray = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    function hit(event: PointerEvent) {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        (-(event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      ray.setFromCamera(pointer, camera);
      let node: THREE.Object3D | undefined = ray.intersectObjects(
        clickables,
        true,
      )[0]?.object;
      while (node && !node.userData.id) node = node.parent || undefined;
      return node?.userData.id as WorkshopId | undefined;
    }
    const select = (event: PointerEvent) => {
      const id = hit(event);
      if (id) onSelect(id);
    };
    const hover = (event: PointerEvent) => {
      renderer.domElement.style.cursor = hit(event) ? "pointer" : "default";
    };
    const lost = (event: Event) => {
      event.preventDefault();
      onError();
    };
    renderer.domElement.addEventListener("pointerup", select);
    renderer.domElement.addEventListener("pointermove", hover);
    renderer.domElement.addEventListener("webglcontextlost", lost);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    let frame = 0;
    let time = 0;
    let previous = 0;
    function render() {
      renderer.render(scene, camera);
    }
    function animate(now: number) {
      frame = requestAnimationFrame(animate);
      if (now - previous < 33) return;
      previous = now;
      if (document.hidden || !visible) return;
      if (!motion.matches && !pauseRef.current) {
        time += 0.033;
        drone.position.y = 1.1 + Math.sin(time * 1.5) * 0.1;
        rotors.forEach((rotor) => (rotor.rotation.y += 0.4));
      }
      render();
    }
    const rotate = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        angle += event.key === "ArrowLeft" ? -0.15 : 0.15;
        positionCamera();
        render();
      }
    };
    container.addEventListener("keydown", rotate);
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    const visibility = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
    });
    visibility.observe(container);
    resize();
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      container.removeEventListener("keydown", rotate);
      renderer.domElement.removeEventListener("pointerup", select);
      renderer.domElement.removeEventListener("pointermove", hover);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      scene.traverse((node) => {
        if (node instanceof THREE.Mesh) {
          node.geometry.dispose();
          const materials = Array.isArray(node.material)
            ? node.material
            : [node.material];
          materials.forEach((material) => material.dispose());
        }
        if (node instanceof THREE.GridHelper) {
          node.geometry.dispose();
          (node.material as THREE.Material).dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onSelect, onError]);
  return (
    <div className="live-scene">
      <div
        ref={host}
        className="canvas-host"
        tabIndex={0}
        role="img"
        aria-label="3D rooftop workshop. Left and right arrow keys rotate the view. Select objects using the buttons below."
      />
      <div className="scene-controls">
        <span>← → rotate · select an object</span>
        <button aria-pressed={paused} onClick={() => setPaused(!paused)}>
          {paused ? "Resume motion" : "Pause motion"}
        </button>
      </div>
    </div>
  );
}

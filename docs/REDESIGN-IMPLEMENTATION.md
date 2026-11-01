# Rooftop redesign implementation — 1 November 2026

Implemented the scene-first direction in `REDESIGN-HANDOFF.md`. No commits, publishing, CMS imports, production configuration changes or deployments were performed.

## Delivered

- New original Blender rooftop diorama, editable source, reproducible builder, desktop/mobile posters and GLB. Detailed independent quadcopter hierarchy, motors, rotors, gimbal, landing gear, terminal, keyboard, PCB, tools, storage, ventilation, canopy and layered skyline.
- Concise home with name, role and positioning sentence. Four navigation destinations: About, Projects, Résumé, Contact. About introduction shortened; experience and all existing article slugs retained.
- Shared manual HTML scroll-snap carousel on home and Projects. Three selected experiments first, remaining projects in the archive. Arrows, scoped keyboard control, native touch scrolling, live position announcement, reduced-motion scrolling and inactive-slide focus protection after hydration. All slides retain regular links and native scrolling without JavaScript. No autoplay, search, filters or sort controls.
- On-request GLB loading, poster retained until a real rendered frame, error boundary/retry, pause/resume, return to still, and pointer picking. Fixed camera intentionally keeps composition stable. Essential navigation and project browsing are HTML.
- Drone inspection flight through exported AnimationMixer clips; repeated launch ignored while flying; reduced motion gives a grounded status response. Illustrative vision overlay without camera access. Reversible wireframe diagnostic mode in the discoverable more menu. Monitor focuses the existing carousel.
- Static scene renders only when dirty or during flight; hidden/offscreen/paused rendering skips work. Pixel ratio capped at 1.5. Renderer/context, geometry, materials, textures, animation cache, observers and listeners are cleaned up on exit. Late model loads are disposed after unmount.
- Removed obsolete homepage/blockout CSS; article theme and CMS adapter preserved.

## Verification completed

- Blender 5.2.3 LTS background startup and reproducible source/export/render completed.
- Desktop and mobile Cycles posters visually inspected. Mobile contains the complete rooftop and readable drone silhouette.
- Actual GLTFLoader parse and AnimationMixer validation: 47 meshes, 59 nodes, 5 animation clips, all 7 interaction parents present; flight lifts the drone in glTF Y-up, leaves the workbench stationary and restores the original pose on stop. Re-run with `node scripts/verify-workshop.mjs`.
- TypeScript and Next.js lint passed. Production build passed on portable Node 22.16.0; system Node 16 is too old. Dependency versions and lockfile unchanged.
- Production HTTP 200 for home, About, Projects, all three selected case studies, notes, opinions, résumé and GLB.
- GLB 3,827,936 bytes; desktop WebP 85,780 bytes; mobile WebP 50,854 bytes; blend 745,655 bytes. No external model/texture dependencies or decoders.

## Remaining manual acceptance checks

Browser interaction QA could not be completed. Browser access host was unavailable; native Chrome computer-use then stopped because its safety check could not identify the current browser URL confidently. No further UI input was attempted.

Desktop/mobile WebGL appearance, pointer picking, keyboard/touch carousel behavior, reduced-motion behavior, failed-load/context-loss recovery and repeated entry/exit still need browser acceptance checks. No physical phone FPS or memory measurements were obtained. Exported geometry and animation validation does not prove browser rendering performance. Runtime lighting is recreated in Three.js and differs from the Cycles poster; compare them in-browser before publishing.

Assets are original; see `assets/workshop/ATTRIBUTIONS.md` and the adjacent README for rebuild instructions. The Blender GUI document was not changed. Local production preview uses `http://localhost:3000`.

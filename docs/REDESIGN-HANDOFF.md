# Portfolio redesign — continuation plan

**Read this first when continuing on the other PC.**

Branch: `feat/sanity-publishing-migration`
Repository: `https://github.com/yeo-menghan/yeo-menghan.github.io`
Handoff date: 1 November 2026
Status: existing portfolio prototype and CMS work checkpointed; the revised scene-first design below is approved but **not implemented yet**.

## 1. What the user wants now

The first implementation lacked flair. It is a conventional portfolio with an optional 3D widget, and its procedural primitive shapes do not meet the desired visual quality. Treat that scene as a blockout, not the final artwork.

The user approved this new direction:

- Make a distinctive, detailed rooftop robotics workshop the main experience.
- Use Blender-authored assets exported as GLB and displayed in Three.js.
- Reduce homepage copy substantially: name, role, one positioning sentence, navigation, projects.
- Navigation: **About · Projects · Résumé · Contact**. Remove Writing from navigation.
- Present projects in a **manual carousel** with arrows, swipe and keyboard controls. No search, tag filters, sort controls or automatic rotation.
- Add a few discoverable, small Easter eggs.
- Keep readable HTML, mobile support, reduced motion, fallbacks and stable case-study URLs.

This document supersedes the visual direction in `docs/portfolio-redesign.md`. That file records the previous prototype and its verification, rather than the target design.

### References and what to learn from them

- [Three.js animation/keyframes example](https://threejs.org/examples/#webgl_animation_keyframes): cohesive animated asset, finished materials, lighting and composition. [Official example source](https://github.com/mrdoob/three.js/blob/dev/examples/webgl_animation_keyframes.html).
- [Jesse’s Ramen](https://jesse-zhou.com/): a memorable place with objects that invite interaction. [Creator’s case study](https://jesse-zhou.medium.com/jesses-ramen-case-study-77bae77ab5f0).
- [Samsy Ninja / Communication Arts](https://www.commarts.com/webpicks/samsy-ninja): immersive Japanese/cyberpunk atmosphere and exploration.

Borrow principles, not somebody else’s shop or assets. Do not copy the ramen-shop scene. Multiplayer, quests, a large world and game mechanics remain out of scope.

## 2. Identity and content guardrails

Yeo Meng Han is a Computer Vision Engineer in Singapore. Positioning:

> I build intelligent systems that connect software to the physical world.

Interests: computer vision, edge AI, robotics, drones, electronics, deployed software and creative web development. Established experience and learning experiments must be distinguishable. Electronics / ESP32 are learning interests, not an implied completed hardware portfolio.

Current selected case studies:

1. `/projects/eKYC-facial` — facial liveness and AWS deployment **proof of concept**; hosted demo retired. Keep its documented security limitations visible in the case study.
2. `/projects/ippt-trainer` — **personal training experiment**, MediaPipe/OpenCV, AI-assisted implementation; no formal counting benchmark claimed.
3. `/projects/grain-project` — LLM scheduling **take-home experiment**, used provisionally because no suitable public drone/edge case study is in the repository.

Do not invent a drone case study, metrics, screenshots or production deployments. The drone can link to `/about#experience` until suitable public work exists. Preserve existing project slugs and public article URLs. Remove the Writing nav link without deleting `/notes` or `/opinions` content. No Substack migration has been approved.

## 3. Current code and verification state

Stack: Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, vanilla Three.js. Keep this stack; no framework migration is needed.

| File / area | Current purpose / next action |
| --- | --- |
| `app/page.tsx` | Wordy conventional home with selected-project grid. Replace with minimal scene-first composition and shared carousel. |
| `components/workshop/Workshop.tsx` | Optional dynamic 3D loader, SVG fallback, object descriptions, error boundary. Rework around the new asset and layout. |
| `components/workshop/WorkshopScene.tsx` | Procedural blockout. Replace its geometry construction with GLTFLoader and authored animation. |
| `data/workshop.ts` | Object-to-content mapping. Keep content separate from geometry; shorten labels and update interactions. |
| `components/Navigation.tsx` | Remove Writing; keep About, Projects, Résumé, Contact visible on mobile and desktop. |
| `app/projects/ProjectsClient.tsx` | Existing tag filters and sorting. Replace with shared manual carousel; do not retain search/filter UI. |
| `app/projects/[slug]/page.tsx` | Existing shareable case-study pages. Preserve. |
| `app/about/page.tsx` | Experience, education and skills from the original home. Keep experience accessible; make the main introduction concise. |
| `app/globals.css` | Contains old utilities plus prototype theme. Consolidate obsolete homepage/workshop styles when replacing them. |
| `lib/content.ts`, `lib/cms/`, `studio/`, `tools/` | Existing publishing/CMS work. Preserve; see `docs/sanity-migration.md`. |

Verified for the **previous prototype**: production build, lint, TypeScript checks, HTTP 200 for home/About/Projects/résumé, and semantic HTML heading checks. Chrome showed the homepage and project section correctly. Full live 3D, mobile and reduced-motion interaction QA was **not completed** because native browser control repeatedly timed out. Do not describe these checks as completed for the new design.

Blender 3.5.1 was found on the first Mac, but its background startup crashed with exit 139. A proposed retry outside the sandbox was interrupted by the user. **No new Blender source, GLB model, render, carousel or Easter eggs were created.** Do not assume these assets exist. No production deployment was performed.

## 4. Set up on the new PC

### Get the checkpoint

In a new checkout:

```sh
git clone --branch feat/sanity-publishing-migration https://github.com/yeo-menghan/yeo-menghan.github.io.git
cd yeo-menghan.github.io
```

For an existing clean checkout:

```sh
git fetch origin
git switch feat/sanity-publishing-migration
git pull --ff-only
```

Inspect `git status` first; preserve any local changes instead of resetting them.

### Node, dependencies and Three.js

Install a supported Node.js LTS release from [nodejs.org](https://nodejs.org/en/download). Node 22.12+ is the existing Studio/import baseline; use a supported LTS meeting that baseline and check the lockfile’s engine warnings. Install Git and Blender separately.

```sh
node --version
npm --version
npm ci
npm ls three @types/three
npm run dev
```

Open `http://localhost:3000`. Three.js is already declared in `package.json` (`three` and `@types/three` currently `^0.187.0`) and resolved by `package-lock.json`. **`npm ci` installs it; no global Three.js installation, CDN script, import map or separate Three.js server is needed.** Commit dependency changes only if deliberately changing versions.

For a future intentional dependency repair/addition, the commands are:

```sh
npm install three
npm install --save-dev @types/three
```

Do not run those merely to set up this checkout: they can change the lockfile.

Three.js browser code belongs in client components. Keep its dynamic import out of essential server-rendered content. Example imports for the planned implementation:

```ts
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// Add postprocessing only after a convincing base composition works:
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
```

These addons ship with `three`; do not install separate packages for them. Official references: [installation](https://threejs.org/manual/#en/installation), [GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html), [OrbitControls](https://threejs.org/docs/pages/OrbitControls.html), [UnrealBloomPass](https://threejs.org/docs/pages/UnrealBloomPass.html).

`public/models/workshop.glb` will be fetched as `/models/workshop.glb`. Serve through Next.js rather than opening the page as a `file://` URL. A current browser with hardware-accelerated WebGL is needed for 3D; essential content must remain available without it.

### Environment and optional CMS

`.env.local`, credentials and local drafts are intentionally not committed. A fresh checkout can use the default Markdown source without Sanity credentials. Use `.env.example` as a template if environment configuration is needed; never overwrite an existing local env file blindly.

Studio is optional for visual work:

```sh
npm --prefix studio ci
npm run studio
```

Studio requires its own public project/dataset configuration. Follow `docs/sanity-migration.md`; do not import, publish or switch production content sources as part of this redesign. The local publishing dashboard can write to GitHub main, so **do not use its Publish action to preview design changes**.

### Blender installation and smoke test

Install a current stable Blender from [blender.org](https://www.blender.org/download/) and verify both GUI startup and background execution. No Blender Python pip package is needed: asset scripts run using Blender’s bundled Python.

```sh
blender --version
blender --background --factory-startup --python-expr "import bpy; print(bpy.app.version_string)"
```

If `blender` is not on PATH, use the executable’s absolute path. Typical macOS path: `/Applications/Blender.app/Contents/MacOS/Blender`; on Windows use the installed `blender.exe` path (PowerShell invokes a quoted executable with `&`). Record the actual working Blender version in the asset README. Do not repeatedly reuse the crashing 3.5.1 binary from the first Mac.

## 5. Art direction and asset contract

### The place

An after-hours rooftop robotics workshop overlooking a Japanese-inspired city. A compact, composed diorama with a partially open front is preferable to a large navigable world.

- **Hero object:** a recognisable quadcopter on a charging/landing pad, with detailed arms, motors, propellers, camera/gimbal and status indicators.
- **Workbench:** monitor, edge computer, soldering station, circuit board, loose wires, tools, equipment case and a half-finished device.
- **Architecture:** industrial floor, weathered surfaces, rails, vents, cables, practical lamps, small signage and layered city silhouettes.
- **Personality:** restrained stickers, a mug, notebook and other small evidence of somebody working here.
- **Lighting:** warm task lights against a cool night sky, restrained cyan/teal accents, selective emissive signage. Avoid neon on every surface.
- **Composition:** one strong camera angle, readable silhouette, clear focal hierarchy and negative space for HTML UI. Test narrow screens before detailing the whole scene.

The key quality improvement is authored silhouettes, bevels, textures/materials, believable proportions, lighting and environmental detail. Exporting the current boxes to GLB would not satisfy the brief.

### Proposed files (create during implementation)

```text
assets/workshop/workshop.blend          editable source
assets/workshop/README.md               Blender version, build/export steps, credits
assets/workshop/ATTRIBUTIONS.md         sources/licenses for any third-party assets
scripts/build-workshop.py              optional reproducible Blender builder/exporter
public/models/workshop.glb              runtime asset
public/images/workshop-poster.webp      render of the same scene, desktop
public/images/workshop-poster-mobile.webp  matching mobile composition if needed
```

These are proposed paths, not existing files. Keep source and final runtime assets in the handoff; inspect size before committing. Use Git LFS only if actually necessary and configured on both PCs. Keep intermediates and huge raw texture downloads out of Git. If reusing models, verify redistribution rights and retain required attribution; use coherent materials so it feels like one environment.

### Blender → GLB

1. Model a composition draft; verify its render before extensive detail work.
2. Set consistent units and apply mesh scale/rotation where appropriate, while preserving intentional animated parent transforms.
3. Organise interactive objects under stable, explicitly named parent nodes. Suggested IDs: `drone`, `camera`, `edge`, `bench`, `monitor`, `notebook`, `debug_switch`. Map these to application actions separately from geometry.
4. Keep the drone in an independent parent hierarchy so its flight does not move the workshop. Name rotor children consistently.
5. Use exportable Principled BSDF / metallic-roughness materials. Bake procedural details into textures where necessary. Blender procedural shaders/compositor effects do not automatically transfer to glTF.
6. Author named animation clips such as `Drone_Inspect`; verify exported clips in the browser with AnimationMixer. Use the export options appropriate to the installed Blender version, and confirm actions/NLA tracks survive export.
7. Export glTF 2.0 as binary GLB, including required textures and animation. Blender is Z-up and glTF is Y-up; use exporter conversion and verify orientation instead of adding arbitrary compensating rotations.
8. Export the intended camera or record its transform/target. Recreate and tune lighting in Three.js as necessary: a Blender render is not automatically reproduced by importing its meshes.
9. Render a matching still for the fallback and convert to WebP. Check scene/poster alignment, lighting and framing at desktop and mobile sizes.
10. Re-import the exported GLB into an empty scene and inspect it in Three.js for missing textures, bad pivots, unexpected scale and animation problems.

Initial performance targets, to measure rather than claim in advance: approximately 5 MB or less for the runtime scene where feasible, 1K/2K texture sizes, shared materials, low draw-call count, capped pixel density and a simplified mobile path. Revisit targets based on actual device measurements. Introduce compression only when useful, and ship any needed decoders locally.

## 6. Interaction and layout plan

### Main experience

The workshop should occupy most of the first viewport, with concise HTML around it. Retain direct About, Projects, Résumé and Contact navigation at all times. Avoid a long stack of repeated introductory sections and decorative labels.

Use the rendered poster immediately, then lazy-load the scene. Loading must not block navigation or project content. Choose a lightweight poster-to-3D entry/progressive enhancement based on actual mobile and performance testing; keep a clear static fallback and the ability to pause or leave 3D.

A short About panel may give a concise introduction and link to the full experience page. If implemented as a dialog, support labelled headings, Escape, focus trapping and focus restoration. No essential experience or contact information should require finding an object.

### Projects carousel

Create one reusable HTML carousel for the homepage and `/projects`. Feature the three selected case studies first; allow browsing remaining existing projects on `/projects` without search or filters. Display one main project at a time, with:

- Genuine image/video where available; explicitly illustrative artwork otherwise.
- Title, short description and a readable project/experiment label.
- A regular “View project” link to `/projects/[slug]`.
- Previous/next buttons, position indicator, swipe support and keyboard controls.

Do not auto-advance. Respect reduced motion, announce slide changes appropriately, and avoid focusing hidden slide content. Scope arrow-key handling to the carousel so it does not conflict with scene controls. Keep projects reachable with JavaScript disabled, for example through a native scroll-snap track with regular links. Clicking the scene monitor should open or focus this same carousel rather than create a separate project inventory.

### Three small Easter eggs

| Trigger | Result | Requirements |
| --- | --- | --- |
| Drone / accessible “Launch drone” control | Power on, lift off, brief inspection flight, return to pad | Prevent overlapping flights; reduced-motion equivalent; do not imply an actual engineering demo. |
| Camera / equivalent control | Toggle a stylised vision overlay with tracking boxes | Clearly illustrative, no webcam permission or personal-data collection. |
| Hidden debug switch / discoverable equivalent | Temporary wireframe or diagnostic mode | Reversible, no navigation dependency, preserve normal materials when disabled. |

Keep discoveries playful and brief. Avoid loud unsolicited audio, fullscreen requests, scores, accounts and quests. Additional interactions can wait until the composition and core browsing are convincing.

## 7. Implementation sequence and completion gates

- [ ] **A. Establish the artwork:** make Blender work; build one scene draft; render it; review camera, lighting, drone silhouette and mobile crop. Do not add detail to an unconvincing composition.
- [ ] **B. Finish/export assets:** refine materials and props, name interactive nodes, author drone animation, save source, GLB, poster and credits.
- [ ] **C. Integrate the GLB:** replace procedural blockout; add loading/error states, camera limits, pointer picking and keyboard equivalents. Keep the poster until a real first frame is ready.
- [ ] **D. Simplify the UI:** scene-first home, minimal copy, four nav destinations, shared manual carousel; remove gallery filters/sorting. Preserve article URLs and content adapter.
- [ ] **E. Add the three Easter eggs:** make them reversible and reduced-motion aware; avoid coupling content to Blender edits.
- [ ] **F. Verify and document:** production checks, browser/device QA, asset sizes and attribution. Update the implementation notes with actual outcomes.

On unmount or scene exit: cancel animation frames, dispose renderer/controls/postprocessing, geometry, materials and textures, and disconnect observers/listeners. Handle a model finishing its download after unmount. Pause work in hidden tabs/offscreen scenes; avoid WebGL context leaks after repeated entry/exit. Treat WebGL creation failure, lost context, model 404 and failed dynamic import as recoverable fallback paths.

### Verification

```sh
npm run typecheck
npm run lint
npm run build
npm start
```

Do not run development and production builds simultaneously against the same `.next` directory. Test the optional CMS separately if touching its implementation; redesign work should not require changes to the migration/publisher subsystem.

Manual acceptance checks:

- [ ] Scene quality visibly exceeds the primitive blockout; poster matches the actual asset.
- [ ] Name, role and four navigation destinations are easy to find; homepage is concise.
- [ ] Carousel arrows, swipe, keyboard, position announcement and case-study links work. No search/filter/sort UI or autoplay remains.
- [ ] Monitor opens/focuses the carousel; drone flight, vision overlay and debug toggle work and recover cleanly.
- [ ] Desktop and narrow touch viewports work without overflow or essential occlusion.
- [ ] Keyboard-only browsing, visible focus, reduced motion and pause controls work.
- [ ] JavaScript disabled / WebGL unavailable / model loading failure all retain usable content.
- [ ] Slow loading does not reveal a blank scene or block contact/résumé access.
- [ ] Repeated entry/exit, route changes and resizing do not leak contexts or break rendering.
- [ ] Measure asset transfer size and frame rate on a representative phone; record tested device/browser.
- [ ] Existing project, About, notes/opinions URLs and résumé still resolve; no fabricated evidence or confidential details were introduced.

Commit progress to this feature branch. Review the diff before publishing or merging; no production deployment is part of this handoff request.

## 8. Suggested prompt to resume

> Continue the portfolio redesign on this branch. Read `docs/REDESIGN-HANDOFF.md` first. The existing Three.js primitive scene is only a blockout. Implement the approved scene-first rooftop robotics workshop using a detailed Blender-authored GLB, concise HTML, a manual projects carousel without search/filters, and the three small Easter eggs. Preserve the current Next.js/CMS setup, stable project URLs, accessibility, mobile and fallback paths. Start by verifying Blender on this PC and creating a convincing scene composition. Do not publish to production.

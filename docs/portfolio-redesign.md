# Rooftop portfolio — previous prototype

**Continuation:** the user approved a different, scene-first direction. Read [REDESIGN-HANDOFF.md](REDESIGN-HANDOFF.md) for the current plan, setup instructions and remaining work. This document records the earlier implementation.

The existing Next.js App Router, Markdown content and optional Sanity integration are retained. No hosting or publishing configuration was changed.

- `/` introduces the engineer, selects three existing case studies and offers the optional workshop.
- `/about` preserves the original experience and education timeline.
- `/projects` and `/projects/[slug]` retain stable case-study URLs.
- `/notes` links to technical notes and the existing `/opinions` collection. No Substack migration is assumed.

## Updating the workshop

`data/workshop.ts` maps six object IDs to readable descriptions and regular URLs. It contains no article bodies. Update Markdown under `content/` or use the existing CMS; editing geometry is not required to update case studies. Homepage editorial selections live in `app/page.tsx` and are shown only when the corresponding article exists in the active content source.

The drone links to public experience rather than implying an unpublished drone case study. The workbench explicitly describes electronics as a learning interest. Grain is the third selected case study until suitable public drone/edge work is available.

## Progressive enhancement

The rooftop SVG is a lightweight, code-native illustration. Three.js is dynamically imported only after the visitor requests 3D. All main navigation and case studies remain usable without JavaScript or WebGL. The 3D view uses procedural meshes, capped pixel density and 30 fps rendering; rendering skips hidden tabs and offscreen scenes. Geometry, materials, renderer, observers and event listeners are disposed on exit.

Select objects with pointer/touch or the HTML buttons below the view. Focus the scene and use left/right arrows to rotate. Motion honours the system preference and has a pause control. If WebGL creation fails or its context is lost, the illustration and HTML object controls remain available.

Homepage system studies are illustrative diagrams, not screenshots or measured output. Original case-study metrics remain attributed to the original write-up. Add genuine demo media and reproducible evaluation evidence when available; do not substitute invented media or results.

## Local checks

Run `npm run typecheck`, `npm run lint`, and `npm run build`. Preview with `npm run dev`. Review at narrow widths and with reduced motion enabled; verify 3D entry, object links, pause, rotation, exit and retry on a WebGL-capable browser.

## Verification performed

- Production build completed successfully, including Next.js lint and TypeScript checks.
- Main pages and the résumé returned HTTP 200 from a local production server.
- Prerendered HTML for home, About, Projects, Writing and the three selected case studies contains one top-level heading and a résumé link. Homepage destinations are present before JavaScript runs.
- Chrome displayed the homepage and selected-project section correctly. The 3D entry reached its loading state, but native browser-control timeouts prevented completing interaction, mobile and reduced-motion QA. These remain manual checks before publication.

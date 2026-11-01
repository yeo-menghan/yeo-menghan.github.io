# Meng Han's personal website

Personal portfolio built with Next.js 14, React, TypeScript, and Tailwind CSS.

## Development

Use Node.js 20 or newer and npm. `package-lock.json` is the dependency lockfile used locally and in CI.

```sh
npm ci
npm run dev
```

Open http://localhost:3000.

## Local publishing dashboard

On the `publisher` branch, run `npm run publisher` and open http://127.0.0.1:4317.
The dashboard edits local drafts and publishes selected articles and images directly to GitHub `main`, triggering the existing Vercel deployment. It does not merge the dashboard branch or publish other code changes.

See [the publisher guide](tools/publisher/README.md) for GitHub login, publishing, draft storage, and conflict handling.

## Checks and production build

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

GitHub Pages uses `NEXT_OUTPUT_EXPORT=true npm run build` to generate `out/`.
The default build supports Vercel and `npm start`.

## Content and assets

- `app/`: routes, layouts, and page components.
- `components/`: shared UI components.
- `data/timelineData.ts`: work and education history.
- `content/projects/`, `content/notes/`, `content/opinions/`: published Markdown articles; filenames become URL slugs.
- `content/archive/`: unpublished writing retained for reference, with its referenced images preserved.
- `public/`: referenced images, the downloadable resume, favicon, and Google site verification file. The verification file is consumed externally even though no component links to it.

Markdown supports GitHub-style tables and task lists, KaTeX math, and raw HTML. Only trusted, locally authored Markdown should be added because raw HTML is rendered.

## Browser-based CMS migration

The `feat/sanity-publishing-migration` branch adds a standalone Sanity writing Studio, structured equations, private draft previews, signed publish webhooks, and a dry-run-first Markdown importer. The default content source remains Markdown. Follow [the migration runbook](docs/sanity-migration.md) to configure the private dataset, verify imports, and switch Vercel to Sanity.

## Portfolio redesign handoff

Continue the approved scene-first Blender/Three.js redesign using [the handoff plan and setup guide](docs/REDESIGN-HANDOFF.md). The current procedural workshop is a prototype; the new model, carousel and Easter eggs remain to be implemented.

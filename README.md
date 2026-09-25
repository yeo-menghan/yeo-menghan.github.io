# Meng Han's personal website

Personal portfolio built with Next.js 14, React, TypeScript, and Tailwind CSS.

## Development

Use Node.js 20 or newer and npm. `package-lock.json` is the dependency lockfile used locally and in CI.

```sh
npm ci
npm run dev
```

Open http://localhost:3000.

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

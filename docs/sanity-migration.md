# Browser publishing migration

Branch: `feat/sanity-publishing-migration`. The existing local publisher and unpublished `.publisher/` drafts are preserved. Nothing is uploaded or published by a build or dry run.

## Architecture

- GitHub stores website/Studio code; Sanity stores articles, cloud drafts, and new images.
- `studio/` is a standalone React 19 Sanity Studio, independently built/hosted. The website stays on Next.js 14 / React 18.
- `CONTENT_SOURCE=markdown` (default) reads the existing repository. `sanity` reads a private dataset using a server-only Viewer token. A Sanity error fails visibly; it never silently falls back to stale local articles.
- `studio/shared/math.mjs` (re-exported by `lib/cms/math.mjs`) centralizes KaTeX configuration for the Studio equation input, migration validation, and public structured content. Preview opens the actual website article, rather than a second approximate renderer.
- Sanity stores Portable Text, inline equation objects, display equation objects, code, and images. LaTeX values have no `$` delimiters. This is an equation-aware visual text editor; the equation field itself accepts LaTeX and shows live output, rather than offering a graphical equation keyboard.
- Existing raw HTML, tables, task lists, or unsupported constructs are retained verbatim in clearly labelled legacy Markdown blocks and reported for review. Markdown remains supported for those blocks and for rollback.
- New images are hosted by Sanity. Imported images retain their existing public paths; keep `public/` assets after cutover.
- All published content queries use the published perspective. Draft detail previews require both Next draft mode and a signed, one-hour HTTP-only preview session. Listing pages and sitemap always query published documents.
- Signed Sanity webhooks expire the content cache and all collection/detail/sitemap routes, including on unpublish/delete. Cached fetches also revalidate after five minutes. A publish means content is saved; the next website request regenerates affected cached data.

## 1. Create the Sanity project

Use a Sanity account you own. In https://www.sanity.io/manage create a project and a **private** dataset named `production`. Use a separate test dataset if experimenting. Restrict project membership to intended editors.

Create a **Viewer** API token for the website and a temporary **Editor** token for importing. Never put either into `SANITY_STUDIO_*`, `NEXT_PUBLIC_*`, Git, screenshots, or chat. Studio authenticates editors through Sanity's own login; it needs no embedded token.

Copy `.env.example` to `.env.local` and fill in the project ID, dataset, and tokens. Generate two independent random secrets of at least 32 characters (for example `openssl rand -hex 32`). Set the preview and webhook secrets. Do not change `CONTENT_SOURCE` yet. Existing environment variables can remain alongside these.

For the standalone Studio, copy `studio/.env.example` to `studio/.env.local`, set the same project/dataset, and set the website URL to localhost for local work or your Vercel preview URL for testing. Studio environment values are public; keep secrets exclusively in the website environment.

## 2. Install and inspect locally

Use Node **22.12+** for the Studio and import command. The website itself still supports Node 20+, but `--env-file-if-exists` in the migration script needs a recent Node version.

```sh
npm ci
npm --prefix studio ci
npm run dev
# In a second terminal:
npm run studio
```

Authorize Studio's localhost origin in Sanity's API/CORS settings with credentials allowed. After deployment, allow only the exact Studio hosting origin as well. Do not use wildcard credentialed CORS.

Studio provides visual rich-text editing, image upload, inline/block equation insertion, automatic cloud draft saving, Publish, Unpublish, and **Preview on website**. Saving a draft never replaces the published article.

## 3. Prepare the import (no network writes)

```sh
npm run test:migration
npm run migrate:content
```

Inspect `.migration/report.json` and `.migration/articles.ndjson`. All active `content/notes`, `content/opinions`, and `content/projects` articles are included; archive articles and unsent local publisher drafts are deliberately excluded. Review/back up `.publisher/` separately and copy any unfinished writing into Studio manually.

The converter parses Markdown syntax trees, preserving equation source, inline/display distinction, formatting, links, list nesting, code, slugs (including case), metadata, and existing image URLs. Standalone single-line `$$...$$` becomes display math. Unsupported content becomes a lossless compatibility block; invalid KaTeX aborts preparation. Unknown frontmatter is preserved in `legacyMetadata`. Generated IDs and block keys are deterministic. Outputs are ignored by Git.

## 4. Import drafts, then verify

```sh
npm run migrate:content -- --apply
```

This explicitly performs remote writes using `SANITY_API_WRITE_TOKEN`. It checks existing published/draft IDs and slugs before an atomic `createIfNotExists` batch. Rerunning skips existing articles, including articles already published, instead of recreating stale drafts or overwriting edits. Existing slugs in documents created manually with different IDs must be reconciled first; use an empty target dataset for the initial import.

Set `CONTENT_SOURCE=sanity` **only in a local or Vercel preview environment** to test draft articles. The public article lists will initially be empty because the import creates drafts. Open each article from Studio with **Preview on website**. The `/preview` login uses `SANITY_PREVIEW_SECRET`; the password is sent in a POST body, never a URL. For local HTTP preview use development mode; production preview cookies require HTTPS.

Verify all three collections and preserved links, image paths, nested lists, code, research metadata, and mobile layout. In particular compare `notes/transformers` and `projects/kaggle-monet-gan`, and inspect every reported compatibility block. Equations must render without errors. Use **Exit preview** before checking public content. Preview access is a private shared password in this first version; Studio login remains separate. Rotate it if access changes.

Publish verified drafts using Studio. This retains any changes made during review. A bulk import of the original Markdown as published documents is also available, but only for an empty dataset when no reviewed draft edits need promotion:

```sh
npm run migrate:content -- --apply --published
```

The bulk command creates missing published originals; it refuses to run over existing drafts and does **not** promote edited drafts or overwrite existing published documents. Do not use it as an update/synchronization tool.

## 5. Set up webhook and deploy

In Sanity project settings create a GROQ webhook:

- URL: `https://<website-host>/api/revalidate`
- Method: POST; triggers: Create, Update, Delete
- Filter: `_type == "article" && !(_id in path("drafts.**")) && !(_id in path("versions.**"))`
- Projection: `{_id, _type}` (include pre-delete fields for deletion events; Sanity evaluates delete payloads against the document before deletion)
- Secret: the value of `SANITY_REVALIDATE_SECRET`
- Draft/version triggers: off

The route verifies `sanity-webhook-signature` with Sanity's maintained verification library. Do not send a secret in a query parameter. Webhook retries are safe: invalidation is idempotent. Check Sanity webhook delivery logs after publishing and unpublishing.

Build and host Studio with Sanity's hosting or as a separate static Vercel project rooted at `studio/`:

```sh
npm run studio:build
# Authenticate with your Sanity account, then deploy the Studio:
npm --prefix studio exec -- sanity login
npm --prefix studio run deploy
```

The deploy command prompts for a Studio hostname. If self-hosting, build command is `npm run build` and output is `dist` in the standalone Studio project. Ensure `SANITY_STUDIO_WEBSITE_URL` targets the matching website environment. Studio is visible on its own URL; document access still requires Sanity login and membership. A private dataset prevents anonymous draft reads.

On the website's Vercel project, add `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_READ_TOKEN`, `SANITY_REVALIDATE_SECRET`, `SANITY_PREVIEW_SECRET`, and finally `CONTENT_SOURCE=sanity`. **Do not deploy the import write token.** Ensure Vercel uses the server build (`NEXT_OUTPUT_EXPORT` unset), then deploy this branch to a Vercel preview first.

The repository's GitHub Pages workflow remains usable for the Markdown source. Sanity mode deliberately rejects static export: runtime previews and revalidation require Vercel's Next.js server. Once Vercel is the confirmed production target, disable the separate Pages deployment in repository settings to avoid maintaining two differently updated sites. That external setting is not changed by this branch.

## 6. Cutover, recovery, and ownership

Only enable production Sanity mode after every expected article is published and compared. Check public lists, direct article URLs, sitemap entries, a new slug published after deployment, an edit, an unpublish, and an expired preview session. Confirm a signed webhook refreshes content and an unsigned one returns 401.

Back up the Sanity dataset with Sanity's export tooling before bulk operations and periodically after cutover. Revoke the temporary import Editor token. Keep original Markdown/public assets as the initial snapshot. New CMS articles and updates will not exist in that snapshot; before rollback export any work you need to preserve.

To roll back the data source, set `CONTENT_SOURCE=markdown` and redeploy. To roll back article content after cutover, restore it within Sanity and publish again. Do not keep editing/publishing the same article through both the old dashboard and Sanity: there is no bidirectional synchronization.

## Related refactors

The content adapter now uses one local parser for both lists and detail pages, preserves consistent `updatedDate` defaults, validates slug paths, and surfaces malformed files instead of returning a misleading 404. Routes await the provider so switching storage does not change page components. Project tag filters derive from already-loaded articles. Sitemap includes article URLs and actual modification dates.

## Verification commands

```sh
npm run test:migration
npm run typecheck
npm run lint
npm run build
NEXT_OUTPUT_EXPORT=true npm run build
npm --prefix studio run typecheck
npm run studio:build
```

Studio build/typecheck requires configured public project/dataset values; a plausible placeholder project ID can check compilation, but cannot verify a real account, API permissions, webhook delivery, hosted login, or imported articles. Those need your configured Sanity project and deployed environment.

# Local publisher

A local writing dashboard for this website. Published articles and images remain in the existing GitHub repository. Drafts stay on this laptop. The dashboard does not deploy to Vercel and needs no hosted database.

## Start

Use Node.js 20 or newer, install the website dependencies with `npm ci`, and install [GitHub CLI](https://cli.github.com/) if it is not already available.

```sh
git switch publisher
gh auth login
npm run publisher
```

Open **http://127.0.0.1:4317**. Use the printed address rather than `localhost`; the server checks its Host header. To use another port:

```sh
PUBLISHER_PORT=4318 npm run publisher
```

The existing `origin` remote determines the GitHub repository. GitHub CLI supplies authentication on the local server. Tokens are never sent to the editor UI or committed to the repository. `gh auth status` can diagnose connection problems. Repository contents write access is needed to publish; repository branch protections still apply.

## Branch workflow

- **`publisher`** holds the dashboard and is the branch you work on locally.
- **`main`** holds the live website and receives content publications.
- **Publish does not merge `publisher` into `main`.** It creates a new single-parent commit on the latest reviewed `main`, containing only the selected article and its referenced images/files that are missing from `main`.
- Existing website code, dashboard code, other articles, the local index, and unrelated working-tree changes are never included.
- The server requires the local `publisher` branch for Review and Publish. Draft editing is available on other branches.

Publishing uses GitHub's API directly. It does not switch local branches, run `git add`, commit the local working tree, push the dashboard branch, or pull changes into your checkout. When you return to developing the website, fetch and integrate `origin/main` using your usual Git workflow. The dashboard can load current content directly from GitHub without synchronizing the checkout first.

Commit and push the dashboard implementation to the remote `publisher` branch separately when you want to back up the tool itself. Do not merge the whole branch just to publish an article.

## Write and publish

1. Click **Connect GitHub** to read the current contents of `main`. This is read-only.
2. Open an existing article, or click **New** and choose Notes, Opinions, or Projects.
3. Edit the title, dates, tags, and Markdown. Nested metadata such as paper details is preserved in **Additional metadata**.
4. Use **+ Image** to upload PNG, JPEG, GIF, or WebP files up to 5 MB. Add descriptive alternative text. Images receive stable content-based names.
5. Click **Save draft** (or Cmd/Ctrl+S). This saves only on your laptop. There is no autosave; unsaved edits produce a navigation warning.
6. Click **Review & publish**. This saves the draft, validates it against `main`, and lists the exact files to be published. Expand **Compare Markdown** to inspect the existing and proposed versions.
7. Click **Publish to main** to create the commit. The review expires after ten minutes or whenever a draft is saved again. If `main` changes, review again.
8. Use **Check Vercel** under Recent publications to check the commit's Vercel status. **Saved to GitHub** and **deployed successfully** are separate results.

The website keeps its current `content/notes/`, `content/opinions/`, and `content/projects/` structure. New image uploads publish into `public/uploads/publisher/`. A changed image should be uploaded as a new image; the publisher leaves existing media on `main` unchanged.

## Drafts and conflicts

Local state lives under `.publisher/`, which is Git-ignored:

```text
.publisher/
  drafts/<collection>/<slug>.json
  uploads/<content-hash>.<extension>
  publications/<commit-sha>.json
```

Drafts are not in GitHub, are not public, and are not backed up by Git. Back up this directory if you need to preserve unpublished writing across laptops.

Each draft records the GitHub blob SHA (or the local HEAD blob SHA when opened offline) of the article it started from. If that article changes remotely, publication stops instead of overwriting it. Copy any draft text you want to retain, use **Load from main**, reconcile the text, and save again. Loading from main leaves the saved draft on disk until you explicitly save its replacement.

For a brand-new article, publication verifies that its path does not already exist on `main`. If branch protection requires a PR, direct publishing is rejected; this first version does not bypass the rule or create/merge pull requests.

## Vercel

The existing Vercel GitHub integration must target this repository and use `main` as its production branch, with automatic deployments enabled. The publisher does not change Vercel settings. An additional Vercel token is not needed to publish; deployment status is read from GitHub's Vercel checks/statuses when available.

The repository also contains a GitHub Pages workflow triggered by updates to `main`. It is independent of Vercel and may also run after a publication. Decide separately whether that second deployment is still useful.

## Implementation and verification

- `server.mjs`: loopback-only HTTP server, drafts, review plans, and publication endpoints.
- `content.mjs`: metadata validation, safe file access, and image handling.
- `github.mjs`: GitHub CLI transport, atomic content commits, conflict checks, and Vercel status.
- `preview.mjs`: the same Markdown/GFM/math rendering libraries used by the website.
- `ui/`: standalone browser UI; it is not part of the public Next.js application.

The article preview uses a script-disabled sandboxed iframe. Mutating API requests require the local session token and pass origin checks. Publishing uses a non-forced GitHub reference update, and never includes unreviewed paths.

```sh
npm run test:publisher
npm run lint
npm run typecheck
npm run build
```

Publisher tests use temporary directories and a simulated GitHub API. They never publish to the real repository. HTTP tests need permission to listen on local loopback ports.

The current preview reproduces the article typography and Markdown features, not the entire website layout. The editor has no scheduled publishing, cross-device draft syncing, or automatic deployment rollback.

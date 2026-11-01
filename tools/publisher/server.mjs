import http from 'node:http';
import { randomBytes, randomUUID } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { contentPath, blobSha, parseArticle, validateDraft, serializeDraft, atomicJSON, readJSON, readWithin, saveImage, listLocalArticles, fail } from './content.mjs';
import { run, repositoryFromOrigin, githubAPI, mainSnapshot, readGitHubArticle, verifyBaseline, publishFiles, deploymentStatus } from './github.mjs';
import { renderPreview, publicReferences } from './preview.mjs';

const TOOL_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
export const REPOSITORY_ROOT = path.resolve(TOOL_DIRECTORY, '../..');
const MIMES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf' };

export async function buildPlan({ root, stateDirectory, api, draft }) {
  const valid = validateDraft(draft, true);
  const snapshot = await mainSnapshot(api);
  verifyBaseline(snapshot, valid.path, valid.baseSha);
  const articleBytes = Buffer.from(serializeDraft(valid));
  const files = [{ path: valid.path, bytes: articleBytes, previousSha: valid.baseSha }];
  for (const relative of publicReferences(valid.content)) {
    const remoteFile = snapshot.files.get(`public/${relative}`);
    if (remoteFile) {
      if (remoteFile.mode !== '100644' && remoteFile.mode !== '100755') fail(`Unsupported media file on main: ${relative}`);
      continue;
    }
    let bytes;
    try {
      bytes = relative.startsWith('uploads/publisher/')
        ? await readWithin(path.join(stateDirectory, 'uploads'), relative.slice('uploads/publisher/'.length))
        : await readWithin(path.join(root, 'public'), relative);
    } catch (error) {
      if (error.code === 'ENOENT') fail(`Referenced image or file is missing: /${relative}`);
      throw error;
    }
    files.push({ path: `public/${relative}`, bytes, previousSha: null });
  }
  if (files.reduce((total, file) => total + file.bytes.length, 0) > 20 * 1024 * 1024) fail('A publication must be under 20 MB. Use smaller images.');
  if (files.length === 1 && blobSha(articleBytes) === valid.baseSha) fail('This article already matches main. There is nothing to publish.');
  const before = valid.baseSha ? (await readGitHubArticle(api, snapshot, valid.path)).text : '';
  return { id: randomUUID(), createdAt: Date.now(), headSha: snapshot.sha, treeSha: snapshot.treeSha, articlePath: valid.path, title: valid.metadata.title, draft: valid, files, before, after: articleBytes.toString('utf8') };
}

async function readBody(request) {
  if (!request.headers['content-type']?.startsWith('application/json')) fail('Use a JSON request.', 415);
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 8 * 1024 * 1024) fail('Request is too large.', 413);
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { fail('Invalid JSON request.'); }
}

export async function createPublisher({ root = REPOSITORY_ROOT, repository, api, branchReader } = {}) {
  repository ??= await repositoryFromOrigin(root);
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository)) fail('Invalid repository configuration.');
  api ??= githubAPI(root, repository);
  branchReader ??= async () => (await run('git', ['branch', '--show-current'], { cwd: root })).trim();
  const stateDirectory = path.join(root, '.publisher');
  const token = randomBytes(32).toString('hex');
  const plans = new Map();
  let connectedSnapshot = null;
  let publishing = false;
  const draftFile = draft => path.join(stateDirectory, 'drafts', draft.type, `${draft.slug}.json`);

  async function saveDraft(input) {
    const draft = validateDraft(input);
    const saved = { ...draft, updatedAt: new Date().toISOString() };
    await atomicJSON(draftFile(draft), saved);
    plans.clear();
    return saved;
  }

  async function articleList() {
    const articles = new Map((await listLocalArticles(root, stateDirectory)).map(item => [contentPath(item.type, item.slug), item]));
    if (connectedSnapshot) {
      for (const articlePath of connectedSnapshot.files.keys()) {
        const match = articlePath.match(/^content\/(notes|opinions|projects)\/([a-zA-Z0-9_-]+)\.md$/);
        if (!match) continue;
        const [, type, slug] = match;
        const existing = articles.get(articlePath);
        articles.set(articlePath, { ...existing, type, slug, title: existing?.title || slug, date: existing?.date || '', onMain: true });
      }
    }
    return [...articles.values()];
  }

  async function getArticle(type, slug, source) {
    const articlePath = contentPath(type, slug);
    const saved = await readJSON(draftFile({ type, slug }));
    if (saved && source !== 'github') return saved;
    if (source === 'github' || connectedSnapshot?.files.has(articlePath)) {
      const snapshot = await mainSnapshot(api);
      const remote = await readGitHubArticle(api, snapshot, articlePath);
      return { type, slug, ...parseArticle(remote.text), baseSha: remote.sha, source: 'main' };
    }
    const text = (await readWithin(path.join(root, 'content'), `${type}/${slug}.md`)).toString('utf8');
    let baseSha = null;
    try { baseSha = (await run('git', ['rev-parse', `HEAD:${articlePath}`], { cwd: root })).trim(); }
    catch { /* Untracked articles have no published baseline; review checks for collisions. */ }
    return { type, slug, ...parseArticle(text), baseSha, source: 'local checkout' };
  }

  const server = http.createServer(async (request, response) => {
    const origin = `http://127.0.0.1:${server.address().port}`;
    const headers = {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; frame-src 'self' about:; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'self'",
    };
    const send = (value, status = 200) => {
      response.writeHead(status, { ...headers, 'Content-Type': 'application/json' });
      response.end(JSON.stringify(value));
    };
    const sendFile = (bytes, extension) => {
      response.writeHead(200, { ...headers, 'Content-Type': MIMES[extension] || 'application/octet-stream' });
      response.end(bytes);
    };
    try {
      // Binding to loopback is not sufficient: reject foreign hosts/origins and
      // require a per-process token so other websites cannot publish through localhost.
      if (request.headers.host !== `127.0.0.1:${server.address().port}`) fail('Open the publisher using its printed 127.0.0.1 address.', 403);
      if (request.headers.origin && request.headers.origin !== origin && request.headers.origin !== 'null') fail('Foreign origin rejected.', 403);
      const url = new URL(request.url, origin);
      const route = url.pathname;
      const method = request.method;
      if (route === '/api/session' && method === 'GET') return send({ token, repository, target: 'main', branch: await branchReader(), connected: Boolean(connectedSnapshot) });
      if (route.startsWith('/api/')) {
        if (request.headers['x-publisher-token'] !== token) fail('Refresh the dashboard to restore its local session.', 403);
        if (request.headers.origin === 'null') fail('Sandboxed content cannot access the editor API.', 403);
        if (publishing && method !== 'GET') fail('A publication is in progress. Wait for it to finish.', 409);
        if (method === 'GET' && route === '/api/articles') return send(await articleList());
        if (method === 'GET' && route === '/api/article') return send(await getArticle(url.searchParams.get('type'), url.searchParams.get('slug'), url.searchParams.get('source')));
        if (method === 'GET' && route === '/api/deployment') return send(await deploymentStatus(api, url.searchParams.get('sha')));
        if (method === 'GET' && route === '/api/publications') {
          let files = [];
          try { files = await readdir(path.join(stateDirectory, 'publications')); }
          catch (error) { if (error.code !== 'ENOENT') throw error; }
          const receipts = await Promise.all(files.filter(file => /^[a-f0-9]{40}\.json$/.test(file)).map(file => readJSON(path.join(stateDirectory, 'publications', file))));
          return send(receipts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 10));
        }
        if (method !== 'POST') fail('Endpoint not found.', 404);
        const body = await readBody(request);
        if (route === '/api/connect') {
          connectedSnapshot = await mainSnapshot(api);
          return send({ repository, head: connectedSnapshot.sha, articles: await articleList() });
        }
        if (route === '/api/draft') return send(await saveDraft(body));
        if (route === '/api/upload') return send(await saveImage(stateDirectory, body.base64));
        if (route === '/api/preview') return send({ html: renderPreview(validateDraft(body)) });
        if (route === '/api/review') {
          if (await branchReader() !== 'publisher') fail('Switch to the publisher branch before reviewing a publication.', 409);
          await saveDraft(body);
          const plan = await buildPlan({ root, stateDirectory, api, draft: body });
          plans.set(plan.id, plan);
          return send({ id: plan.id, repository, target: 'main', title: plan.title, before: plan.before, after: plan.after, files: plan.files.map(file => ({ path: file.path, bytes: file.bytes.length, action: file.previousSha ? 'Update' : 'Add' })) });
        }
        if (route === '/api/publish') {
          if (await branchReader() !== 'publisher') fail('Switch to the publisher branch before publishing.', 409);
          const plan = plans.get(body.id);
          if (!plan || Date.now() - plan.createdAt > 10 * 60 * 1000) fail('The publication review expired or the draft changed. Review again.', 409);
          publishing = true;
          plans.delete(body.id);
          try {
            const result = await publishFiles(api, plan);
            const receipt = { ...result, title: plan.title, type: plan.draft.type, slug: plan.draft.slug, publishedAt: new Date().toISOString(), commitUrl: `https://github.com/${repository}/commit/${result.sha}`, checksUrl: `https://github.com/${repository}/commit/${result.sha}/checks` };
            // Publication has succeeded at this point. Local bookkeeping failure
            // must not report it as a failed publication or encourage duplicate retries.
            try {
              await atomicJSON(path.join(stateDirectory, 'publications', `${result.sha}.json`), receipt);
              await saveDraft({ ...plan.draft, baseSha: result.articleSha });
            } catch { receipt.warning = 'Published successfully, but the local draft or receipt could not be saved. Reload the article from GitHub before editing again.'; }
            connectedSnapshot = null;
            return send(receipt);
          } finally { publishing = false; }
        }
        fail('Endpoint not found.', 404);
      }
      if (method !== 'GET') fail('Method not allowed.', 405);
      const staticFiles = new Map([['/', 'index.html'], ['/app.js', 'app.js'], ['/styles.css', 'styles.css'], ['/preview.css', 'preview.css']]);
      if (staticFiles.has(route)) {
        const file = staticFiles.get(route);
        return sendFile(await readFile(path.join(TOOL_DIRECTORY, 'ui', file)), path.extname(file));
      }
      if (route.startsWith('/katex/')) {
        const relative = decodeURIComponent(route.slice('/katex/'.length));
        // The sandboxed preview has an opaque origin. Only public font/style
        // assets opt into CORS; authenticated editor APIs never do.
        headers['Access-Control-Allow-Origin'] = '*';
        return sendFile(await readWithin(path.join(REPOSITORY_ROOT, 'node_modules/katex/dist'), relative), path.extname(relative));
      }
      if (route.startsWith('/media/')) {
        const relative = decodeURIComponent(route.slice('/media/'.length));
        if (!/\.(png|jpe?g|gif|webp|svg)$/i.test(relative)) fail('Unsupported media.', 404);
        let bytes;
        try {
          bytes = relative.startsWith('uploads/publisher/')
            ? await readWithin(path.join(stateDirectory, 'uploads'), relative.slice('uploads/publisher/'.length))
            : await readWithin(path.join(root, 'public'), relative);
        } catch (error) {
          if (error.code !== 'ENOENT') throw error;
          const snapshot = connectedSnapshot;
          const entry = snapshot?.files.get(`public/${relative}`);
          if (!entry) fail('Image is not available locally. Connect to GitHub to load published images.', 404);
          const blob = await api(`git/blobs/${entry.sha}`);
          bytes = Buffer.from(blob.content, 'base64');
        }
        // SVGs are only served as images, with no script execution on direct navigation.
        headers['Content-Security-Policy'] = "default-src 'none'; sandbox";
        return sendFile(bytes, path.extname(relative));
      }
      fail('Not found.', 404);
    } catch (error) {
      const status = error.status || (error.code === 'ENOENT' ? 404 : 500);
      send({ error: status === 500 ? 'The local publisher encountered an error. Check file permissions and try again.' : error.message }, status);
      if (status === 500) console.error(error.message);
    }
  });
  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  if (process.env.VERCEL || process.env.CI) throw new Error('The publisher only runs locally.');
  const port = Number(process.env.PUBLISHER_PORT || 4317);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('PUBLISHER_PORT must be between 1024 and 65535.');
  const server = await createPublisher();
  server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? `Port ${port} is in use. Set PUBLISHER_PORT to another port.` : error.message); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`\nLocal publisher: http://127.0.0.1:${port}\nDrafts stay on this laptop. Review & Publish sends only selected content to GitHub main.\n`));
}

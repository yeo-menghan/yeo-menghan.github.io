import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm, symlink } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { contentPath, blobSha, parseArticle, serializeDraft, validateDraft, saveImage, readWithin, readJSON } from './content.mjs';
import { publishFiles, verifyBaseline, deploymentStatus } from './github.mjs';
import { buildPlan, createPublisher } from './server.mjs';
import { publicReferences, renderPreview } from './preview.mjs';

const HEAD = 'a'.repeat(40);
const TREE = 'b'.repeat(40);
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64');
const ARTICLE = '---\ntitle: Original\ndate: "2026-01-01"\ncategory: Learning\n---\n\nOriginal body.\n';
const articlePath = 'content/notes/example.md';
const makeDraft = (extra = {}) => ({ type: 'notes', slug: 'example', metadata: { title: 'Updated', date: '2026-01-02', category: 'Learning' }, content: 'Updated body.', baseSha: blobSha(ARTICLE), ...extra });

function mockGitHub(initial = { [articlePath]: ARTICLE }) {
  const blobs = new Map();
  let files = new Map();
  for (const [name, value] of Object.entries(initial)) {
    const bytes = Buffer.from(value);
    const sha = blobSha(bytes);
    blobs.set(sha, bytes);
    files.set(name, { path: name, type: 'blob', mode: '100644', sha });
  }
  let head = HEAD;
  let pendingTree;
  const calls = [];
  const api = async (endpoint, method = 'GET', body) => {
    calls.push({ endpoint, method, body });
    if (method === 'GET') {
      if (endpoint === 'git/ref/heads/main') return { object: { sha: head } };
      if (endpoint.startsWith('git/commits/')) return { tree: { sha: TREE } };
      if (endpoint.startsWith('git/trees/')) return { tree: [...files.values()], truncated: false };
      if (endpoint.startsWith('git/blobs/')) return { encoding: 'base64', content: blobs.get(endpoint.slice('git/blobs/'.length)).toString('base64') };
      if (endpoint.endsWith('/status')) return { statuses: [] };
      if (endpoint.endsWith('/check-runs')) return { check_runs: [] };
    }
    if (endpoint === 'git/blobs' && method === 'POST') {
      const bytes = Buffer.from(body.content, body.encoding);
      const sha = blobSha(bytes);
      blobs.set(sha, bytes);
      return { sha };
    }
    if (endpoint === 'git/trees' && method === 'POST') {
      pendingTree = new Map(files);
      for (const entry of body.tree) pendingTree.set(entry.path, entry);
      return { sha: 'c'.repeat(40) };
    }
    if (endpoint === 'git/commits' && method === 'POST') return { sha: 'd'.repeat(40) };
    if (endpoint === 'git/refs/heads/main' && method === 'PATCH') {
      assert.equal(body.force, false);
      head = body.sha;
      files = pendingTree;
      return { object: { sha: head } };
    }
    throw new Error(`Unexpected API call: ${method} ${endpoint}`);
  };
  return { api, calls, setHead: value => { head = value; } };
}

async function fixture(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'personal-publisher-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, 'content/notes'), { recursive: true });
  await mkdir(path.join(root, 'public'), { recursive: true });
  await writeFile(path.join(root, articlePath), ARTICLE);
  return { root, stateDirectory: path.join(root, '.publisher') };
}

test('content paths reject traversal, unsupported collections, and empty slugs', () => {
  for (const [type, slug] of [['archive', 'test'], ['notes', '../secret'], ['notes', 'a/b'], ['notes', ''], ['projects', 'a\\b']]) assert.throws(() => contentPath(type, slug));
  assert.equal(contentPath('projects', 'eKYC-facial'), 'content/projects/eKYC-facial.md');
});

test('frontmatter round-trip preserves nested paper metadata and normalizes dates', () => {
  const parsed = parseArticle('---\ntitle: Paper\ndate: 2026-01-01\ncategory: ML\npaper:\n  title: Attention\n  year: 2017\n---\nMath: $x^2$\n');
  assert.equal(parsed.metadata.date, '2026-01-01');
  const result = parseArticle(serializeDraft(makeDraft(parsed)));
  assert.deepEqual(result.metadata.paper, { title: 'Attention', year: 2017 });
  assert.match(result.content, /\$x\^2\$/);
});

test('incomplete drafts can be saved but cannot be published', () => {
  const draft = makeDraft({ metadata: {}, content: '' });
  assert.doesNotThrow(() => validateDraft(draft));
  assert.throws(() => serializeDraft(draft), /title/);
  assert.throws(() => serializeDraft(makeDraft({ metadata: { title: 'Test', date: '2026-02-30', category: 'Learning' } })), /date/);
  assert.throws(() => serializeDraft(makeDraft({ metadata: { title: 'Test', date: '2026-01-01' } })), /category/);
});

test('new projects receive the tags array expected by the website', () => {
  const draft = makeDraft({ type: 'projects', metadata: { title: 'Test', date: '2026-01-01', description: 'Description' } });
  assert.deepEqual(parseArticle(serializeDraft(draft)).metadata.tags, []);
});

test('public references include reference-style Markdown and raw HTML images', () => {
  const references = publicReferences('![Inline](/a.png)\n![Reference][photo]\n\n[photo]: /b.jpg\n\n<img src="/c.webp">\n\n[PDF](/resume.pdf)\n[Article](/notes/test)\n![External](https://example.com/x.jpg)');
  assert.deepEqual(references.sort(), ['a.png', 'b.jpg', 'c.webp', 'resume.pdf']);
});

test('preview supports math, task lists, and HTML without executing it', () => {
  const html = renderPreview(makeDraft({ content: '- [x] done\n\n$x^2$\n\n<mark>highlight</mark>\n\n![Photo](/photo.jpg)' }));
  assert.match(html, /type="checkbox"/);
  assert.match(html, /class="katex"/);
  assert.match(html, /<mark>highlight<\/mark>/);
  assert.match(html, /src="\/media\/photo.jpg"/);
});

test('image upload uses validated image bytes and a stable content-derived path', async t => {
  const { stateDirectory } = await fixture(t);
  const one = await saveImage(stateDirectory, PNG.toString('base64'));
  const two = await saveImage(stateDirectory, PNG.toString('base64'));
  assert.equal(one.url, two.url);
  assert.match(one.url, /^\/uploads\/publisher\/[a-f0-9]{24}\.png$/);
  await assert.rejects(saveImage(stateDirectory, Buffer.from('<svg onload="alert(1)">').toString('base64')), /PNG/);
});

test('media reads reject traversal and symlinks outside the public directory', async t => {
  const { root } = await fixture(t);
  await writeFile(path.join(root, 'secret.txt'), 'secret');
  await symlink(path.join(root, 'secret.txt'), path.join(root, 'public/escape.png'));
  await assert.rejects(readWithin(path.join(root, 'public'), '../secret.txt'));
  await assert.rejects(readWithin(path.join(root, 'public'), 'escape.png'), /outside/);
});

test('review includes only the article and referenced missing images, never code', async t => {
  const options = await fixture(t);
  const github = mockGitHub();
  await writeFile(path.join(options.root, 'public/photo.png'), PNG);
  await writeFile(path.join(options.root, 'public/unused.png'), PNG);
  await writeFile(path.join(options.root, 'package.json'), '{"unrelated":"change"}');
  const plan = await buildPlan({ ...options, api: github.api, draft: makeDraft({ content: '![Photo](/photo.png)' }) });
  assert.deepEqual(plan.files.map(file => file.path), [articlePath, 'public/photo.png']);
  assert.equal(github.calls.every(call => call.method === 'GET'), true);
});

test('review includes staged uploads and leaves existing GitHub images alone', async t => {
  const options = await fixture(t);
  const upload = await saveImage(options.stateDirectory, PNG.toString('base64'));
  const github = mockGitHub({ [articlePath]: ARTICLE, 'public/existing.png': PNG });
  const plan = await buildPlan({ ...options, api: github.api, draft: makeDraft({ content: `![New](${upload.url})\n![Old](/existing.png)` }) });
  assert.deepEqual(plan.files.map(file => file.path), [articlePath, `public${upload.url}`]);
});

test('review rejects missing images and concurrent article changes', async t => {
  const options = await fixture(t);
  await assert.rejects(buildPlan({ ...options, api: mockGitHub().api, draft: makeDraft({ content: '![Missing](/missing.png)' }) }), /missing/);
  await assert.rejects(buildPlan({ ...options, api: mockGitHub({ [articlePath]: 'Changed remotely' }).api, draft: makeDraft() }), /differs/);
});

test('new articles cannot overwrite an existing article without its baseline', () => {
  assert.throws(() => verifyBaseline({ files: new Map([[articlePath, { sha: blobSha(ARTICLE) }]]) }, articlePath, null), /differs/);
});

test('publication creates one content commit and never merges or force-pushes', async t => {
  const options = await fixture(t);
  const github = mockGitHub();
  const plan = await buildPlan({ ...options, api: github.api, draft: makeDraft() });
  const result = await publishFiles(github.api, plan);
  const commitCalls = github.calls.filter(call => call.endpoint === 'git/commits');
  assert.equal(commitCalls.length, 1);
  assert.deepEqual(commitCalls[0].body.parents, [HEAD]);
  const updates = github.calls.filter(call => call.method === 'PATCH');
  assert.equal(updates.length, 1);
  assert.equal(updates[0].endpoint, 'git/refs/heads/main');
  assert.equal(updates[0].body.force, false);
  assert.equal(result.articleSha, blobSha(serializeDraft(makeDraft())));
});

test('main changing after review aborts before any remote writes', async t => {
  const options = await fixture(t);
  const github = mockGitHub();
  const plan = await buildPlan({ ...options, api: github.api, draft: makeDraft() });
  github.setHead('e'.repeat(40));
  await assert.rejects(publishFiles(github.api, plan), /changed since/);
  assert.equal(github.calls.some(call => call.method !== 'GET'), false);
});

test('publication refuses an unexpected code file in its plan', async t => {
  const options = await fixture(t);
  const github = mockGitHub();
  const plan = await buildPlan({ ...options, api: github.api, draft: makeDraft() });
  plan.files.push({ path: 'app/page.tsx', bytes: Buffer.from('oops') });
  await assert.rejects(publishFiles(github.api, plan), /unsupported/);
  assert.equal(github.calls.some(call => call.method !== 'GET'), false);
});

test('a racing update rejected by GitHub never gets retried with force', async t => {
  const options = await fixture(t);
  const github = mockGitHub();
  const plan = await buildPlan({ ...options, api: github.api, draft: makeDraft() });
  let attempts = 0;
  const api = async (endpoint, method, body) => {
    if (method === 'PATCH') { attempts++; assert.equal(body.force, false); throw new Error('Not a fast forward'); }
    return github.api(endpoint, method, body);
  };
  await assert.rejects(publishFiles(api, plan), /fast forward/);
  assert.equal(attempts, 1);
});

test('deployment status ignores unrelated successful checks', async () => {
  const api = async endpoint => endpoint.endsWith('/status') ? { statuses: [{ context: 'CI', state: 'success' }] } : { check_runs: [] };
  assert.equal((await deploymentStatus(api, HEAD)).state, 'unknown');
});

test('deployment status recognizes Vercel failures and successes', async () => {
  for (const [state, expected] of [['success', 'ready'], ['failure', 'failed'], ['pending', 'building']]) {
    const api = async endpoint => endpoint.endsWith('/status') ? { statuses: [{ context: 'Vercel', state, target_url: 'https://vercel.com/test' }] } : { check_runs: [] };
    assert.equal((await deploymentStatus(api, HEAD)).state, expected);
  }
});

async function runningServer(t, options = {}) {
  const fixtureOptions = await fixture(t);
  const github = mockGitHub();
  const server = await createPublisher({ root: fixtureOptions.root, repository: 'owner/site', api: github.api, branchReader: async () => options.branch || 'publisher' });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  t.after(() => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); }));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const session = await (await fetch(`${origin}/api/session`)).json();
  const request = (route, body, headers = {}) => fetch(`${origin}${route}`, { method: body === undefined ? 'GET' : 'POST', headers: { 'X-Publisher-Token': session.token, ...(body === undefined ? {} : { 'Content-Type': 'application/json' }), ...headers }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
  return { ...fixtureOptions, github, origin, request };
}

test('HTTP API requires the session token and rejects foreign origins and hosts', async t => {
  const { origin, request } = await runningServer(t);
  assert.equal((await fetch(`${origin}/api/articles`)).status, 403);
  assert.equal((await request('/api/draft', makeDraft(), { Origin: 'https://evil.example' })).status, 403);
  assert.equal((await request('/api/draft', makeDraft(), { Origin: 'null' })).status, 403);
  // fetch normalizes Host, so use the HTTP client to send an actual foreign Host.
  const foreignHostStatus = await new Promise((resolve, reject) => {
    http.get(`${origin}/api/session`, { headers: { Host: 'evil.example' } }, response => { response.resume(); resolve(response.statusCode); }).on('error', reject);
  });
  assert.equal(foreignHostStatus, 403);
  assert.equal((await request('/api/draft', makeDraft(), { Origin: origin })).status, 200);
});

test('HTTP draft saves survive reload without modifying content or GitHub', async t => {
  const { root, request, github } = await runningServer(t);
  const saved = await request('/api/draft', makeDraft());
  assert.equal(saved.status, 200);
  const loaded = await (await request('/api/article?type=notes&slug=example')).json();
  assert.equal(loaded.metadata.title, 'Updated');
  assert.equal(await readFile(path.join(root, articlePath), 'utf8'), ARTICLE);
  assert.equal(github.calls.length, 0);
});

test('HTTP publication requires review, updates its draft baseline, and records a receipt', async t => {
  const { request, stateDirectory } = await runningServer(t);
  assert.equal((await request('/api/publish', { id: 'invented' })).status, 409);
  const review = await (await request('/api/review', makeDraft())).json();
  assert.ok(review.id);
  assert.equal(review.files.length, 1);
  const published = await request('/api/publish', { id: review.id });
  assert.equal(published.status, 200);
  const receipt = await published.json();
  const savedDraft = await readJSON(path.join(stateDirectory, 'drafts/notes/example.json'));
  assert.equal(savedDraft.baseSha, receipt.articleSha);
  assert.equal((await (await request('/api/publications')).json()).length, 1);
  assert.equal((await request('/api/publish', { id: review.id })).status, 409);
});

test('changing a saved draft invalidates its publication review', async t => {
  const { request, github } = await runningServer(t);
  const review = await (await request('/api/review', makeDraft())).json();
  await request('/api/draft', makeDraft({ content: 'Changed after reviewing' }));
  assert.equal((await request('/api/publish', { id: review.id })).status, 409);
  assert.equal(github.calls.some(call => call.method !== 'GET'), false);
});

test('publishing requires the publisher branch, while drafting works on other branches', async t => {
  const { request, github } = await runningServer(t, { branch: 'main' });
  assert.equal((await request('/api/draft', makeDraft())).status, 200);
  assert.equal((await request('/api/review', makeDraft())).status, 409);
  assert.equal(github.calls.length, 0);
});

test('the editor is sandboxed and does not expose arbitrary repository files', async t => {
  const { origin } = await runningServer(t);
  const response = await fetch(origin);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /sandbox=""/);
  assert.match(response.headers.get('content-security-policy'), /script-src 'self'/);
  assert.equal((await fetch(`${origin}/.env.local`)).status, 404);
  assert.equal((await fetch(`${origin}/media/../package.json`)).status, 404);
});

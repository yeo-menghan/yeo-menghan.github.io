import { spawn } from 'node:child_process';
import { blobSha, fail } from './content.mjs';

export function run(command, args, { cwd, input, timeout = 30000 } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, shell: false, stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '', stderr = '';
    const timer = setTimeout(() => { child.kill(); reject(new Error(`${command} timed out. Check your connection and retry.`)); }, timeout);
    child.stdout.on('data', chunk => {
      stdout += chunk;
      if (stdout.length > 24 * 1024 * 1024) { child.kill(); reject(new Error('Command response is too large.')); }
    });
    child.stderr.on('data', chunk => { if (stderr.length < 8192) stderr += chunk; });
    child.on('error', error => { clearTimeout(timer); reject(error); });
    child.on('close', code => {
      clearTimeout(timer);
      if (code === 0) resolve(stdout);
      else reject(Object.assign(new Error(`${command} failed.`), { stderr, code }));
    });
    child.stdin.on('error', () => {});
    child.stdin.end(input);
  });
}

export async function repositoryFromOrigin(root) {
  const origin = (await run('git', ['remote', 'get-url', 'origin'], { cwd: root })).trim();
  const match = origin.match(/^(?:https:\/\/github\.com\/|git@github\.com:)([\w.-]+\/[\w.-]+?)(?:\.git)?$/);
  if (!match) fail('The origin remote must point to a GitHub repository.', 500);
  return match[1];
}

export function githubAPI(root, repository) {
  return async (endpoint, method = 'GET', body) => {
    const args = ['api', '--hostname', 'github.com', `repos/${repository}/${endpoint}`, '--method', method, '-H', 'Accept: application/vnd.github+json'];
    if (body !== undefined) args.push('--input', '-');
    try {
      return JSON.parse(await run('gh', args, { cwd: root, input: body === undefined ? undefined : JSON.stringify(body) }));
    } catch (error) {
      if (error.code === 'ENOENT') fail('Install GitHub CLI, then run gh auth login before connecting.', 503);
      const status = Number(error.stderr?.match(/HTTP (\d{3})/)?.[1]);
      if (status === 404) fail('GitHub could not find this file, repository, or branch. Check repository access.', 404);
      if (status === 409 || status === 422) fail('GitHub rejected this update. The branch may have changed or require a pull request. Refresh and review again; no force-push was attempted.', 409);
      if (status === 403) fail('GitHub denied access. Check repository permissions, branch rules, and API limits.', 403);
      fail('Could not access GitHub. Run gh auth login, check your connection, and try again.', 503);
    }
  };
}

export async function mainSnapshot(api) {
  const ref = await api('git/ref/heads/main');
  const commit = await api(`git/commits/${ref.object.sha}`);
  const tree = await api(`git/trees/${commit.tree.sha}?recursive=1`);
  if (tree.truncated) fail('Repository tree is too large to inspect safely.', 422);
  return { sha: ref.object.sha, treeSha: commit.tree.sha, files: new Map(tree.tree.filter(item => item.type === 'blob').map(item => [item.path, item])) };
}

export async function readGitHubArticle(api, snapshot, articlePath) {
  const file = snapshot.files.get(articlePath);
  if (!file) fail('This article does not exist on main.', 404);
  const blob = await api(`git/blobs/${file.sha}`);
  if (blob.encoding !== 'base64') fail('GitHub returned an unsupported file encoding.', 422);
  return { text: Buffer.from(blob.content, 'base64').toString('utf8'), sha: file.sha };
}

export function verifyBaseline(snapshot, articlePath, expectedSha) {
  const actual = snapshot.files.get(articlePath)?.sha ?? null;
  if (actual !== expectedSha) fail('This article on main differs from the version you started editing. Your draft is safe. Load the main version and reconcile the changes before publishing.', 409);
}

export async function publishFiles(api, plan) {
  // The review pins a main commit. A changed branch requires a fresh review, even if
  // only another article changed; the commit must contain exactly what was reviewed.
  const current = await api('git/ref/heads/main');
  if (current.object.sha !== plan.headSha) fail('main changed since your review. Review the publication again.', 409);
  for (const file of plan.files) {
    const allowed = file.path === plan.articlePath || /^public\/.+\.(png|jpe?g|gif|webp|svg|pdf)$/i.test(file.path);
    if (!allowed || file.path.split('/').some(part => part === '.' || part === '..') || file.path.includes('\\')) fail('Publication contains an unsupported file path.', 403);
  }
  const treeEntries = [];
  for (const file of plan.files) {
    const blob = await api('git/blobs', 'POST', { content: file.bytes.toString('base64'), encoding: 'base64' });
    treeEntries.push({ path: file.path, mode: '100644', type: 'blob', sha: blob.sha });
  }
  const tree = await api('git/trees', 'POST', { base_tree: plan.treeSha, tree: treeEntries });
  const commit = await api('git/commits', 'POST', { message: `Publish: ${plan.title}`, tree: tree.sha, parents: [plan.headSha] });
  // Never merge publisher into main. A single-parent content commit plus a
  // non-forced ref update prevents unrelated code or concurrent work being lost.
  await api('git/refs/heads/main', 'PATCH', { sha: commit.sha, force: false });
  return { sha: commit.sha, articleSha: blobSha(plan.files.find(file => file.path === plan.articlePath).bytes) };
}

export async function deploymentStatus(api, sha) {
  if (!/^[a-f0-9]{40}$/.test(sha)) fail('Invalid commit.');
  const [statuses, checks] = await Promise.allSettled([
    api(`commits/${sha}/status`), api(`commits/${sha}/check-runs`),
  ]);
  const signals = [];
  if (statuses.status === 'fulfilled') {
    for (const status of statuses.value.statuses ?? []) {
      if (/vercel/i.test(status.context)) signals.push({ state: status.state === 'success' ? 'ready' : ['failure', 'error'].includes(status.state) ? 'failed' : 'building', url: status.target_url });
    }
  }
  if (checks.status === 'fulfilled') {
    for (const check of checks.value.check_runs ?? []) {
      if (/vercel/i.test(`${check.name} ${check.app?.slug}`)) signals.push({ state: check.status !== 'completed' ? 'building' : check.conclusion === 'success' ? 'ready' : 'failed', url: check.details_url });
    }
  }
  if (!signals.length) return { state: 'unknown', message: 'Saved to GitHub. Vercel status is not available yet; check the deployment in Vercel.' };
  return signals.find(item => item.state === 'failed') ?? signals.find(item => item.state === 'building') ?? signals[0];
}

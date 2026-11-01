import { createHash, randomUUID } from 'node:crypto';
import { readFile, writeFile, mkdir, rename, readdir, realpath } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

export const TYPES = ['notes', 'opinions', 'projects'];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function fail(message, status = 400) {
  throw Object.assign(new Error(message), { status });
}

export function contentPath(type, slug) {
  if (!TYPES.includes(type) || typeof slug !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,119}$/.test(slug)) {
    fail('Choose a valid collection and a slug containing only letters, numbers, hyphens, or underscores.');
  }
  return `content/${type}/${slug}.md`;
}

export function blobSha(bytes) {
  const buffer = Buffer.from(bytes);
  return createHash('sha1').update(`blob ${buffer.length}\0`).update(buffer).digest('hex');
}

export function parseArticle(text) {
  const { data, content } = matter(text);
  // YAML can parse unquoted dates as Date objects; form fields need ISO strings.
  const metadata = JSON.parse(JSON.stringify(data));
  for (const key of ['date', 'updatedDate']) {
    if (typeof metadata[key] === 'string') metadata[key] = metadata[key].slice(0, 10);
  }
  return { metadata, content };
}

export function validateDraft(input, forPublish = false) {
  const articlePath = contentPath(input.type, input.slug);
  if (!input.metadata || typeof input.metadata !== 'object' || Array.isArray(input.metadata)) fail('Article metadata must be an object.');
  if (typeof input.content !== 'string' || Buffer.byteLength(input.content) > 1024 * 1024) fail('Article content must be text under 1 MB.');
  if (input.baseSha !== null && !/^[a-f0-9]{40}$/.test(input.baseSha ?? '')) fail('Missing article baseline. Reopen the article first.');
  if (forPublish) {
    if (typeof input.metadata.title !== 'string' || !input.metadata.title.trim()) fail('Add an article title before publishing.');
    for (const key of ['date', 'updatedDate']) {
      const value = input.metadata[key];
      if (key === 'updatedDate' && !value) continue;
      if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value) {
        fail(`Use a valid YYYY-MM-DD value for ${key}.`);
      }
    }
    if (!input.content.trim()) fail('Write some article content before publishing.');
    if (input.type === 'notes' && !String(input.metadata.category ?? '').trim()) fail('Notes need a category.');
    if (input.type === 'projects' && !String(input.metadata.description ?? '').trim()) fail('Projects need a description.');
    if (input.metadata.tags !== undefined && (!Array.isArray(input.metadata.tags) || input.metadata.tags.some(tag => typeof tag !== 'string'))) fail('Tags must be a list of text values.');
    for (const key of ['github', 'link']) {
      if (input.metadata[key] && !/^https?:\/\//.test(input.metadata[key])) fail(`${key} must be an HTTP or HTTPS URL.`);
    }
  }
  return { type: input.type, slug: input.slug, path: articlePath, metadata: input.metadata, content: input.content, baseSha: input.baseSha };
}

export function serializeDraft(draft) {
  validateDraft(draft, true);
  const metadata = { ...draft.metadata };
  if (draft.type === 'projects') metadata.tags ??= [];
  return matter.stringify(draft.content.trimEnd() + '\n', metadata);
}

export async function atomicJSON(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  const temporary = `${file}.${randomUUID()}.tmp`;
  await writeFile(temporary, JSON.stringify(value, null, 2) + '\n', { mode: 0o600 });
  await rename(temporary, file);
}

export async function readJSON(file, fallback = null) {
  try { return JSON.parse(await readFile(file, 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return fallback; throw error; }
}

// Check real paths too, so a symlink cannot expose a file outside an allowed directory.
export async function readWithin(directory, relative) {
  if (typeof relative !== 'string' || relative.includes('\\') || relative.split('/').some(part => !part || part === '.' || part === '..')) fail('Invalid file path.');
  const base = await realpath(directory);
  const target = await realpath(path.join(base, relative));
  if (!target.startsWith(base + path.sep)) fail('File is outside the allowed directory.', 403);
  return readFile(target);
}

export function imageExtension(bytes) {
  if (!bytes.length || bytes.length > MAX_IMAGE_BYTES) fail('Images must be between 1 byte and 5 MB.');
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return 'png';
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpg';
  if (['GIF87a', 'GIF89a'].includes(bytes.subarray(0, 6).toString())) return 'gif';
  if (bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP') return 'webp';
  fail('Choose a PNG, JPEG, GIF, or WebP image.');
}

export async function saveImage(stateDirectory, base64) {
  if (typeof base64 !== 'string' || !/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) fail('Invalid image upload.');
  const bytes = Buffer.from(base64, 'base64');
  const extension = imageExtension(bytes);
  const name = `${createHash('sha256').update(bytes).digest('hex').slice(0, 24)}.${extension}`;
  const directory = path.join(stateDirectory, 'uploads');
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, name), bytes);
  return { url: `/uploads/publisher/${name}`, bytes: bytes.length };
}

export async function listLocalArticles(root, stateDirectory) {
  const entries = new Map();
  for (const type of TYPES) {
    for (const [directory, isDraft] of [[path.join(root, 'content', type), false], [path.join(stateDirectory, 'drafts', type), true]]) {
      let files;
      try { files = await readdir(directory); }
      catch (error) { if (error.code === 'ENOENT') continue; throw error; }
      for (const file of files.filter(name => name.endsWith(isDraft ? '.json' : '.md'))) {
        const slug = file.slice(0, isDraft ? -5 : -3);
        const articlePath = contentPath(type, slug);
        const article = isDraft ? await readJSON(path.join(directory, file)) : parseArticle(await readFile(path.join(directory, file), 'utf8'));
        entries.set(articlePath, { type, slug, title: article.metadata.title || slug, date: article.metadata.date || '', draft: isDraft });
      }
    }
  }
  return [...entries.values()].sort((a, b) => b.date.localeCompare(a.date));
}

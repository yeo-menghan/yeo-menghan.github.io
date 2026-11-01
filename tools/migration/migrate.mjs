import fs from 'node:fs/promises';
import path from 'node:path';
import { parseArticleMarkdown } from '../../lib/cms/frontmatter.mjs';
import { planImport } from './import-plan.mjs';
import { convertMarkdown, articleId } from './convert.mjs';

const args = new Set(process.argv.slice(2));
for (const arg of args) if (!['--apply', '--published'].includes(arg)) throw new Error(`Unknown option ${arg}`);
if (args.has('--published') && !args.has('--apply')) throw new Error('--published requires --apply');
const root = process.cwd();
const documents = [];
const report = [];
for (const collection of ['notes', 'opinions', 'projects']) {
  const directory = path.join(root, 'content', collection);
  for (const filename of (await fs.readdir(directory)).filter(file => file.endsWith('.md')).sort()) {
    const slug = filename.slice(0, -3);
    if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,119}$/.test(slug)) throw new Error(`Unsupported slug ${slug}`);
    const { metadata: data, content } = parseArticleMarkdown(await fs.readFile(path.join(directory, filename), 'utf8'));
    if (!data.title || (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || Number.isNaN(Date.parse(data.date)) || new Date(data.date).toISOString().slice(0, 10) !== data.date)) throw new Error(`Invalid title/date in ${filename}`);
    const { body, warnings } = convertMarkdown(content);
    const known = ['title', 'date', 'updatedDate', 'description', 'excerpt', 'tags', 'readTime', 'github', 'link', 'category', 'paper'];
    const metadata = Object.fromEntries(Object.entries(data).filter(([key]) => known.includes(key)));
    const extra = Object.fromEntries(Object.entries(data).filter(([key]) => !known.includes(key)));
    documents.push({ _id: `${args.has('--published') ? '' : 'drafts.'}${articleId(collection, slug)}`, _type: 'article',
      collection, slug: { _type: 'slug', current: slug }, ...metadata,
      updatedDate: data.updatedDate || data.date, body,
      ...(Object.keys(extra).length ? { legacyMetadata: JSON.stringify(extra, null, 2) } : {}) });
    report.push({ path: `${collection}/${slug}`, blocks: body.length, warnings });
  }
}
const output = path.join(root, '.migration');
await fs.mkdir(output, { recursive: true });
await fs.writeFile(path.join(output, 'articles.ndjson'), documents.map(doc => JSON.stringify(doc)).join('\n') + '\n');
await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(`Prepared ${documents.length} articles; ${report.reduce((n, item) => n + item.warnings.length, 0)} compatibility blocks. Review .migration/report.json and articles.ndjson.`);
if (!args.has('--apply')) {
  console.log('Dry run only. No remote writes. Use --apply to create missing drafts.');
} else {
  const project = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!project || !/^[a-z0-9]+$/.test(project) || !dataset || !/^[a-z0-9_-]+$/.test(dataset) || !token) {
    throw new Error('Set SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_WRITE_TOKEN');
  }
  const query = '*[_type == "article" && !(_id in path("versions.**"))]{_id, collection, slug}';
  const existingResponse = await fetch(`https://${project}.api.sanity.io/v2025-02-19/data/query/${dataset}?perspective=raw&query=${encodeURIComponent(query)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!existingResponse.ok) throw new Error(`Cannot check existing articles (${existingResponse.status})`);
  const existingData = await existingResponse.json();
  if (!Array.isArray(existingData.result)) throw new Error('Cannot read existing articles; import cancelled');
  const pending = planImport(documents, existingData.result, args.has('--published'));
  if (!pending.length) { console.log('All articles already exist; no remote writes.'); process.exit(0); }
  const response = await fetch(`https://${project}.api.sanity.io/v2025-02-19/data/mutate/${dataset}`, {
    method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ mutations: pending.map(doc => ({ createIfNotExists: doc })) }),
  });
  if (!response.ok) throw new Error(`Import failed (${response.status}). No existing documents are replaced.`);
  console.log(`Import completed (${args.has('--published') ? 'published originals' : 'drafts'}). Existing IDs were preserved. Verify in Studio before switching CONTENT_SOURCE.`);
}

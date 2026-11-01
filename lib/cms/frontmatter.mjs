import matter from 'gray-matter';

export function parseArticleMarkdown(source) {
  const { data, content } = matter(source);
  // YAML's unquoted dates become Date objects; UI props must remain serializable.
  const metadata = JSON.parse(JSON.stringify(data));
  for (const field of ['date', 'updatedDate']) {
    if (typeof metadata[field] === 'string') metadata[field] = metadata[field].slice(0, 10);
  }
  return { metadata, content };
}

export function planImport(documents, existing, published = false) {
  const ids = new Set(existing.map(doc => doc._id));
  return documents.filter(doc => {
    const id = doc._id.replace(/^drafts\./, '');
    const conflict = existing.some(item => item.collection === doc.collection && item.slug?.current === doc.slug.current && item._id.replace(/^drafts\./, '') !== id);
    if (conflict) throw new Error(`Existing article has a different ID at ${doc.collection}/${doc.slug.current}; reconcile it before importing`);
    if (published && ids.has(`drafts.${id}`)) throw new Error('Drafts already exist. Publish reviewed drafts in Studio instead of bulk-importing the original Markdown.');
    return !ids.has(id) && !ids.has(`drafts.${id}`);
  });
}

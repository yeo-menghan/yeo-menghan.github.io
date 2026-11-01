export const contentTypes = ['projects', 'notes', 'opinions'] as const;
export type ContentType = typeof contentTypes[number];

export function cmsEnabled() {
  const source = process.env.CONTENT_SOURCE || 'markdown';
  if (!['markdown', 'sanity'].includes(source)) throw new Error('CONTENT_SOURCE must be markdown or sanity');
  if (source === 'sanity' && process.env.NEXT_OUTPUT_EXPORT === 'true') {
    throw new Error('Sanity publishing requires the server build. Disable NEXT_OUTPUT_EXPORT and use Vercel.');
  }
  return source === 'sanity';
}

export function sanityConfig() {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET;
  if (!projectId || !/^[a-z0-9]+$/.test(projectId) || !dataset || !/^[a-z0-9_-]+$/.test(dataset)) {
    throw new Error('Set SANITY_PROJECT_ID and SANITY_DATASET before enabling Sanity');
  }
  return { projectId, dataset, apiVersion: '2025-02-19' };
}

import { sanityConfig } from './config';

export async function sanityQuery<T>(query: string, params: Record<string, string> = {}, preview = false): Promise<T> {
  const { projectId, dataset, apiVersion } = sanityConfig();
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!token) throw new Error('SANITY_API_READ_TOKEN is required for the private Sanity dataset');
  const url = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
  url.searchParams.set('query', query);
  url.searchParams.set('perspective', preview ? 'drafts' : 'published');
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(`$${key}`, JSON.stringify(value)));
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    ...(preview ? { cache: 'no-store' as const } : { next: { revalidate: 300, tags: ['articles'] } }),
  });
  if (!response.ok) throw new Error(`Sanity content request failed (${response.status})`);
  const data = await response.json();
  if (data.error) throw new Error('Sanity returned a query error');
  return data.result as T;
}

import { MetadataRoute } from 'next';
import { getContentByType } from '@/lib/content';
import { contentTypes } from '@/lib/cms/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yeo-menghan.com';
  const collections = await Promise.all(contentTypes.map(async type => ({ type, articles: await getContentByType(type) })));
  return [
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: baseUrl, changeFrequency: 'monthly', priority: 1 },
    ...collections.flatMap(({ type, articles }) => [
      { url: `${baseUrl}/${type}`, changeFrequency: 'weekly' as const, priority: 0.7 },
      ...articles.map(article => ({
        url: `${baseUrl}/${type}/${article.slug}`,
        lastModified: new Date(article.updatedDate || article.date),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
    ]),
  ];
}

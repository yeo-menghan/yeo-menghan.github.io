import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook';
import { revalidateTag, revalidatePath } from 'next/cache';
import { cmsEnabled, contentTypes } from '@/lib/cms/config';

export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!cmsEnabled() || !secret) return new Response('CMS is not configured', { status: 503 });
  const body = await request.text();
  const signature = request.headers.get(SIGNATURE_HEADER_NAME);
  if (!signature || !(await isValidSignature(body, signature, secret))) {
    return new Response('Invalid webhook signature', { status: 401 });
  }
  let event;
  try { event = JSON.parse(body); } catch { return new Response('Invalid JSON', { status: 400 }); }
  if (event?._type !== 'article' || typeof event._id !== 'string' || event._id.startsWith('drafts.') || event._id.startsWith('versions.')) {
    return new Response('Expected a published article event', { status: 400 });
  }
  revalidateTag('articles');
  // Invalidate all article routes to cover deletes, unpublishes, and old slugs.
  for (const type of contentTypes) {
    revalidatePath(`/${type}`);
    revalidatePath(`/${type}/[slug]`, 'page');
  }
  revalidatePath('/sitemap.xml');
  return Response.json({ revalidated: true });
}

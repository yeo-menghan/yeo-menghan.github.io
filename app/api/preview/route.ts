import { cookies, draftMode } from 'next/headers';
import { equalSecret, previewSession, validPreviewSession } from '@/lib/cms/preview-auth.mjs';
import { cmsEnabled, contentTypes } from '@/lib/cms/config';

export async function POST(request: Request) {
  if (!cmsEnabled()) return new Response('CMS is not enabled', { status: 503 });
  // Form submissions originate from the website; prevent cross-site preview login.
  const requestURL = new URL(request.url);
  // Next can expose an internal localhost URL behind its server/proxy.
  const host = request.headers.get('host');
  if (host) requestURL.host = host;
  const protocol = request.headers.get('x-forwarded-proto');
  if (protocol === 'http' || protocol === 'https') requestURL.protocol = `${protocol}:`;
  if (request.headers.get('origin') !== requestURL.origin) return new Response('Invalid origin', { status: 403 });
  const form = await request.formData();
  if (form.get('action') === 'exit') {
    draftMode().disable();
    cookies().delete('cms-preview');
    return Response.redirect(new URL('/', requestURL.origin), 303);
  }
  const secret = process.env.SANITY_PREVIEW_SECRET;
  if (!secret || secret.length < 32) return new Response('Configure a preview secret of at least 32 characters', { status: 503 });
  const supplied = String(form.get('secret') || '');
  const existing = cookies().get('cms-preview')?.value;
  if (!validPreviewSession(existing, secret) && !equalSecret(supplied, secret)) return new Response('Invalid preview secret', { status: 401 });
  const type = String(form.get('type') || '');
  const slug = String(form.get('slug') || '');
  if (!contentTypes.includes(type as typeof contentTypes[number]) || !/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,119}$/.test(slug)) {
    return new Response('Invalid article path', { status: 400 });
  }
  draftMode().enable();
  cookies().set('cms-preview', previewSession(secret, Date.now() + 3600000), {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 3600,
  });
  return Response.redirect(new URL(`/${type}/${slug}`, requestURL.origin), 303);
}

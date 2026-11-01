import { draftMode, cookies } from 'next/headers';
import { cmsEnabled } from '@/lib/cms/config';
import { validPreviewSession } from '@/lib/cms/preview-auth.mjs';

export default function PreviewBanner() {
  if (!cmsEnabled() || !draftMode().isEnabled || !validPreviewSession(cookies().get('cms-preview')?.value, process.env.SANITY_PREVIEW_SECRET || '')) return null;
  return <aside className="bg-amber-100 text-amber-950 p-3 text-center">
    You are viewing unpublished drafts. <a href="/preview" className="underline">Preview controls / exit</a>
  </aside>;
}

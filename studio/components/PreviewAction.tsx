import type { DocumentActionComponent } from 'sanity';

export const PreviewAction: DocumentActionComponent = props => {
  const doc = props.draft || props.published;
  const slug = (doc?.slug as { current?: string } | undefined)?.current;
  const collection = doc?.collection as string | undefined;
  const origin = process.env.SANITY_STUDIO_WEBSITE_URL;
  return {
    label: 'Preview on website', disabled: !origin || !slug || !collection,
    onHandle: () => {
      const url = new URL('/preview', origin);
      url.searchParams.set('type', collection!);
      url.searchParams.set('slug', slug!);
      window.open(url.toString(), '_blank', 'noopener,noreferrer');
      props.onComplete();
    },
  };
};

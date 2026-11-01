import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';

function markdown(content, extra = {}) {
  return React.createElement(ReactMarkdown, {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeRaw, rehypeKatex],
    ...extra,
  }, content);
}

export function publicReferences(content) {
  const paths = new Set();
  function collect() {
    return tree => {
      function visit(node) {
        const value = node.tagName === 'img' ? node.properties?.src : node.tagName === 'a' ? node.properties?.href : null;
        if (typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')) {
          const clean = decodeURIComponent(value.split(/[?#]/)[0]);
          if (/\.(png|jpe?g|gif|webp|svg|pdf)$/i.test(clean)) paths.add(clean.slice(1));
        }
        node.children?.forEach(visit);
      }
      visit(tree);
    };
  }
  renderToStaticMarkup(markdown(content, { rehypePlugins: [rehypeRaw, collect] }));
  return [...paths];
}

export function renderPreview(draft) {
  const article = React.createElement('article', null,
    React.createElement('header', null,
      React.createElement('p', { className: 'eyebrow' }, draft.type),
      React.createElement('h1', null, draft.metadata.title || 'Untitled'),
      React.createElement('p', { className: 'date' }, [draft.metadata.date, draft.metadata.category].filter(Boolean).join(' · ')),
    ),
    markdown(draft.content, {
      components: {
        img: ({ src, alt }) => React.createElement('img', {
          src: src?.startsWith('/') && !src.startsWith('//') ? `/media${src}` : src,
          alt: alt || '',
        }),
      },
    }),
  );
  // Preview HTML is placed in a sandboxed iframe with scripts disabled. This keeps
  // raw article HTML out of the authenticated editor's document.
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/preview.css"><link rel="stylesheet" href="/katex/katex.min.css"></head><body>${renderToStaticMarkup(article)}</body></html>`;
}

import { PortableText, type PortableTextComponents, type PortableTextBlock } from '@portabletext/react';
import MarkdownRenderer from './MarkdownRenderer';
import { renderMath } from '@/lib/cms/math.mjs';
import 'katex/dist/katex.min.css';

function Equation({ latex, display }: { latex: string; display?: boolean }) {
  try {
    const html = renderMath(latex, !!display);
    return display
      ? <div className="overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} />
      : <span dangerouslySetInnerHTML={{ __html: html }} />;
  } catch {
    return <code role="alert">Equation could not be rendered: {latex}</code>;
  }
}

const components: PortableTextComponents = {
  types: {
    inlineEquation: ({ value }) => <Equation latex={value.latex} />,
    equation: ({ value }) => <Equation latex={value.latex} display />,
    codeBlock: ({ value }) => <pre><code className={value.language ? `language-${value.language}` : undefined}>{value.code}</code></pre>,
    divider: () => <hr />,
    // Migrated images keep their original URLs. New uploads use Sanity assets.
    articleImage: ({ value }) => {
      const src = value.asset?.url || value.url;
      // eslint-disable-next-line @next/next/no-img-element
      return src ? <figure><img src={src} alt={value.alt || ''} />{value.caption && <figcaption>{value.caption}</figcaption>}</figure> : null;
    },
    markdownFallback: ({ value }) => <MarkdownRenderer content={value.source} />,
  },
  marks: {
    highlight: ({ children }) => <mark>{children}</mark>,
    link: ({ value, children }) => {
      const href = value?.href || '';
      return /^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(href) ? <a href={href}>{children}</a> : <span>{children}</span>;
    },
  },
};

export default function ArticleBody({ content, body }: { content: string; body?: PortableTextBlock[] }) {
  if (!body) return <MarkdownRenderer content={content} />;
  return <div className="prose prose-slate max-w-none"><PortableText value={body} components={components} /></div>;
}

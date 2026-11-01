import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import { createHash } from 'node:crypto';
import { validateMath } from '../../lib/cms/math.mjs';

export function convertMarkdown(source) {
  const tree = unified().use(remarkParse).use(remarkGfm).use(remarkMath).parse(source);
  function validateEquations(node) {
    if (node.type === 'math' || node.type === 'inlineMath') {
      const result = validateMath(node.value);
      if (result !== true) throw new Error(`Invalid equation on line ${node.position?.start.line}: ${result}`);
    }
    node.children?.forEach(validateEquations);
  }
  validateEquations(tree);
  const definitions = new Map(tree.children.filter(node => node.type === 'definition').map(node => [node.identifier, node]));
  const definitionSource = tree.children.filter(node => node.type === 'definition').map(node => source.slice(node.position.start.offset, node.position.end.offset)).join('\n');
  function resolveReferences(node) {
    if (node.type === 'linkReference' || node.type === 'imageReference') {
      const definition = definitions.get(node.identifier);
      if (definition) Object.assign(node, { type: node.type === 'linkReference' ? 'link' : 'image', url: definition.url, title: definition.title });
    }
    node.children?.forEach(resolveReferences);
  }
  resolveReferences(tree);
  const warnings = [];
  let counter = 0;
  const key = () => `k${counter++}`;
  const text = (value, marks = []) => ({ _type: 'span', _key: key(), text: value, marks });
  const body = [];
  function formula(node, block) {
    const result = validateMath(node.value);
    if (result !== true) throw new Error(`Invalid equation on line ${node.position?.start.line}: ${result}`);
    return { _type: block ? 'equation' : 'inlineEquation', _key: key(), latex: node.value };
  }
  function block(node, options = {}) {
    const markDefs = [];
    function inline(n, marks = []) {
      switch (n.type) {
        case 'text': return [text(n.value, marks)];
        case 'break': return [text('\n', marks)];
        case 'inlineCode': return [text(n.value, [...marks, 'code'])];
        case 'inlineMath': return [formula(n, false)];
        case 'strong': case 'emphasis': case 'delete':
          return n.children.flatMap(child => inline(child, [...marks, { strong: 'strong', emphasis: 'em', delete: 'strike-through' }[n.type]]));
        case 'link': {
          const id = key(); markDefs.push({ _key: id, _type: 'link', href: n.url });
          return n.children.flatMap(child => inline(child, [...marks, id]));
        }
        default: throw new Error(`Inline ${n.type}`);
      }
    }
    return { _type: 'block', _key: key(), style: node.type === 'heading' ? `h${node.depth}` : 'normal',
      ...options, markDefs, children: node.children.flatMap(n => inline(n)) };
  }
  function convert(node, options = {}) {
    if (node.type === 'paragraph' && node.children.length === 1) {
      const child = node.children[0];
      if (child.type === 'image') return [{ _type: 'articleImage', _key: key(), url: child.url, alt: child.alt || '' }];
      // Existing articles use a complete line of $$...$$ as a display equation.
      if (child.type === 'inlineMath' && source.slice(node.position.start.offset, node.position.end.offset).trim().startsWith('$$')) return [formula(child, true)];
    }
    switch (node.type) {
      case 'heading': case 'paragraph': return [block(node, options)];
      case 'math': return [formula(node, true)];
      case 'code': return [{ _type: 'codeBlock', _key: key(), code: node.value, language: node.lang || '' }];
      case 'thematicBreak': return [{ _type: 'divider', _key: key() }];
      case 'blockquote': return node.children.flatMap(n => {
        if (n.type !== 'paragraph') throw new Error('Complex blockquote');
        return [block(n, { style: 'blockquote' })];
      });
      case 'list':
        if (node.start && node.start !== 1) throw new Error('Numbered list starting after 1');
        return node.children.flatMap(item => {
          if (item.checked != null) throw new Error('Task list');
          return item.children.flatMap((n, index) => {
            if (n.type === 'list') return convert(n, { level: (options.level || 1) + 1 });
            if (n.type !== 'paragraph' || index > 0) throw new Error('Complex list item');
            return [block(n, { listItem: node.ordered ? 'number' : 'bullet', level: options.level || 1 })];
          });
        });
      default: throw new Error(`Block ${node.type}`);
    }
  }
  for (const node of tree.children) {
    if (node.type === 'definition') continue;
    try { body.push(...convert(node)); }
    catch (error) {
      if (String(error.message).startsWith('Invalid equation')) throw error;
      // Preserve unsupported syntax verbatim; report it for a human review.
      warnings.push(`Line ${node.position.start.line}: ${error.message}; preserved as a Markdown compatibility block`);
      body.push({ _type: 'markdownFallback', _key: key(), source: source.slice(node.position.start.offset, node.position.end.offset) + (definitionSource ? `\n\n${definitionSource}` : '') });
    }
  }
  return { body, warnings };
}

export function articleId(collection, slug) {
  // Slugs are kept exactly in URLs; IDs are deterministic even for unusual filenames.
  return `article.${collection}.${createHash('sha256').update(slug).digest('hex').slice(0, 24)}`;
}

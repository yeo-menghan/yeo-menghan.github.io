import { defineType, defineField, defineArrayMember } from 'sanity';
import { EquationInput } from '../components/EquationInput';
import { validateMath } from '../shared/math.mjs';

const equationFields = [defineField({ name: 'latex', title: 'Equation', type: 'text',
  components: { input: EquationInput }, validation: rule => rule.required().custom(value => validateMath(value || '')) })];
const equationPreview = { select: { title: 'latex' }, prepare: ({ title }: { title?: string }) => ({ title: title || 'Empty equation' }) };
const metadataNames = ['description', 'excerpt', 'readTime', 'github', 'link', 'category'];

export const schemaTypes = [
  defineType({ name: 'equation', title: 'Block equation', type: 'object', fields: equationFields, preview: equationPreview }),
  defineType({ name: 'inlineEquation', title: 'Inline equation', type: 'object', fields: equationFields, preview: equationPreview }),
  defineType({ name: 'codeBlock', title: 'Code', type: 'object', fields: [
    defineField({ name: 'language', type: 'string' }),
    defineField({ name: 'code', type: 'text', validation: rule => rule.required() }),
  ], preview: { select: { title: 'language', subtitle: 'code' } } }),
  defineType({ name: 'divider', title: 'Divider', type: 'object', fields: [
    defineField({ name: 'label', type: 'string', initialValue: 'Divider', hidden: true }),
  ], preview: { prepare: () => ({ title: '———' }) } }),
  defineType({ name: 'markdownFallback', title: 'Legacy Markdown', type: 'object', description: 'Preserved during migration. Review before replacing with visual blocks.', fields: [
    defineField({ name: 'source', type: 'text', validation: rule => rule.required() }),
  ], preview: { select: { title: 'source' } } }),
  defineType({ name: 'articleImage', title: 'Image', type: 'image', options: { hotspot: false }, fields: [
    defineField({ name: 'alt', title: 'Alternative text', type: 'string', validation: rule => rule.required() }),
    defineField({ name: 'caption', type: 'string' }),
    defineField({ name: 'url', title: 'Migrated image URL', type: 'string', readOnly: true }),
  ], validation: rule => rule.custom(value => value?.asset || value?.url ? true : 'Upload an image') }),
  defineType({ name: 'article', title: 'Article', type: 'document', fields: [
    defineField({ name: 'title', type: 'string', validation: rule => rule.required() }),
    defineField({ name: 'collection', type: 'string', options: { list: [
      { title: 'Note', value: 'notes' }, { title: 'Opinion', value: 'opinions' }, { title: 'Project', value: 'projects' },
    ] }, initialValue: 'notes', validation: rule => rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title', maxLength: 120 },
      description: 'Keep existing slugs unchanged to preserve links.',
      validation: rule => rule.required().custom(value => !value?.current || /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,119}$/.test(value.current) ? true : 'Use letters, numbers, underscores, or hyphens; maximum 120 characters') }),
    defineField({ name: 'date', title: 'Publication date', type: 'date', initialValue: () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Singapore' }), validation: rule => rule.required() }),
    defineField({ name: 'updatedDate', title: 'Last updated', type: 'date' }),
    ...metadataNames.map(name => defineField({ name, type: 'string',
      validation: rule => rule.custom((value, context) => {
        if ((name === 'category' && context.document?.collection === 'notes') || (name === 'description' && context.document?.collection === 'projects')) {
          return value?.trim() ? true : `${name} is required for this collection`;
        }
        return true;
      }),
    })),
    defineField({ name: 'tags', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({ name: 'paper', title: 'Research paper', type: 'object', fields: [
      defineField({ name: 'title', type: 'string' }), defineField({ name: 'authors', type: 'string' }),
      defineField({ name: 'year', type: 'number' }), defineField({ name: 'url', type: 'url' }),
    ] }),
    defineField({ name: 'body', title: 'Article', type: 'array', validation: rule => rule.required().min(1), of: [
      defineArrayMember({ type: 'block', styles: [
        { title: 'Paragraph', value: 'normal' }, ...[1, 2, 3, 4, 5, 6].map(level => ({ title: `Heading ${level}`, value: `h${level}` })),
        { title: 'Quote', value: 'blockquote' },
      ], lists: [{ title: 'Bullet list', value: 'bullet' }, { title: 'Numbered list', value: 'number' }],
      marks: { decorators: [
        { title: 'Bold', value: 'strong' }, { title: 'Italic', value: 'em' },
        { title: 'Code', value: 'code' }, { title: 'Strike through', value: 'strike-through' }, { title: 'Highlight', value: 'highlight' },
      ], annotations: [{ name: 'link', type: 'object', fields: [defineField({ name: 'href', type: 'string', validation: rule => rule.required().custom(value => /^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(value || '') ? true : 'Use an https, mailto, relative, or anchor URL') })] }] },
      of: [{ type: 'inlineEquation' }] }),
      ...['equation', 'articleImage', 'codeBlock', 'divider', 'markdownFallback'].map(type => defineArrayMember({ type })),
    ] }),
    defineField({ name: 'legacyMetadata', type: 'text', readOnly: true, hidden: ({ value }) => !value }),
  ], preview: { select: { title: 'title', subtitle: 'collection' } }, orderings: [{ title: 'Newest first', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }] }),
];

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import matter from 'gray-matter';
import { convertMarkdown, articleId } from './convert.mjs';

test('preserves math as distinct inline and display objects', () => {
  const { body, warnings } = convertMarkdown('A value $x_1$ and **bold**.\n\n$$\\frac{a}{b}$$\n\n$$\nc = \\sqrt{d}\n$$');
  assert.equal(body[0].children[1]._type, 'inlineEquation');
  assert.equal(body[0].children[1].latex, 'x_1');
  assert.deepEqual(body.slice(1).map(n => n._type), ['equation', 'equation']);
  assert.equal(warnings.length, 0);
});

test('preserves unsupported content verbatim instead of silently dropping it', () => {
  const source = '<mark>important</mark>\n\n| A | B |\n| - | - |\n| 1 | 2 |';
  const { body, warnings } = convertMarkdown(source);
  assert.equal(warnings.length, 2);
  assert.equal(body[0].source, '<mark>important</mark>');
  assert.equal(body[1].source, '| A | B |\n| - | - |\n| 1 | 2 |');
});

test('rejects unsupported equations before remote writes', () => {
  assert.throws(() => convertMarkdown('$\\notARealCommand{x}$'), /Invalid equation/);
});

test('preserves list nesting, links, code, image paths, and slug case', () => {
  const { body } = convertMarkdown('- Parent\n  - Child\n\n[Docs](https://example.com)\n\n```js\nconst n = 1;\n```\n\n![Chart](/chart.png)');
  assert.equal(body[1].level, 2);
  assert.equal(body[2].markDefs[0].href, 'https://example.com');
  assert.equal(body[3].code, 'const n = 1;');
  assert.equal(body[4].url, '/chart.png');
  assert.notEqual(articleId('projects', 'eKYC-facial'), articleId('projects', 'ekyc-facial'));
  assert.equal(articleId('notes', 'test'), articleId('notes', 'test'));
});

test('all existing active articles convert with unique block keys', async () => {
  for (const collection of ['notes', 'projects', 'opinions']) {
    for (const file of await fs.readdir(`content/${collection}`)) {
      if (!file.endsWith('.md')) continue;
      const { content } = matter(await fs.readFile(`content/${collection}/${file}`, 'utf8'));
      const { body } = convertMarkdown(content);
      assert.ok(body.length, file);
      assert.equal(new Set(body.map(n => n._key)).size, body.length, file);
    }
  }
});

test('reference-style links and images resolve without orphaning their definitions', () => {
  const { body, warnings } = convertMarkdown('[Read][docs]\n\n![Chart][chart]\n\n[docs]: https://example.com\n[chart]: /chart.png');
  assert.equal(body.length, 2);
  assert.equal(body[0].markDefs[0].href, 'https://example.com');
  assert.equal(body[1].url, '/chart.png');
  assert.equal(warnings.length, 0);
});

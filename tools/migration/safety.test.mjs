import test from 'node:test';
import assert from 'node:assert/strict';
import { previewSession, validPreviewSession } from '../../lib/cms/preview-auth.mjs';
import { parseArticleMarkdown } from '../../lib/cms/frontmatter.mjs';
import { planImport } from './import-plan.mjs';

const secret = 'a'.repeat(64);
test('preview sessions reject tampering, expiration, and secret rotation', () => {
  const token = previewSession(secret, Date.now() + 60000);
  assert.equal(validPreviewSession(token, secret), true);
  assert.equal(validPreviewSession(token.replace(/.$/, 'z'), secret), false);
  assert.equal(validPreviewSession(token, 'b'.repeat(64)), false);
  assert.equal(validPreviewSession(previewSession(secret, Date.now() - 1), secret), false);
  assert.equal(validPreviewSession(undefined, secret), false);
  assert.equal(validPreviewSession('Infinity.invalid', secret), false);
});

test('unquoted YAML dates remain strings across migration and local rendering', () => {
  const { metadata } = parseArticleMarkdown('---\ntitle: Example\ndate: 2026-11-01\nupdatedDate: 2026-11-02\n---\nBody');
  assert.equal(metadata.date, '2026-11-01');
  assert.equal(metadata.updatedDate, '2026-11-02');
});

const doc = { _id: 'drafts.article.notes.test', collection: 'notes', slug: { current: 'test' } };
test('rerunning an import preserves both existing drafts and published articles', () => {
  assert.equal(planImport([doc], []).length, 1);
  assert.equal(planImport([doc], [doc]).length, 0);
  assert.equal(planImport([doc], [{ ...doc, _id: 'article.notes.test' }]).length, 0);
});

test('import refuses to duplicate a manually created slug or bulk-publish over drafts', () => {
  assert.throws(() => planImport([doc], [{ ...doc, _id: 'different' }]), /different ID/);
  assert.throws(() => planImport([{ ...doc, _id: 'article.notes.test' }], [doc], true), /Publish reviewed drafts/);
});

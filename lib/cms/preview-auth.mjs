import { createHmac, timingSafeEqual } from 'node:crypto';

/** @param {string} left @param {string} right */
export function equalSecret(left, right) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** @param {string} secret @param {number} expires */
export function previewSession(secret, expires) {
  return `${expires}.${createHmac('sha256', secret).update(String(expires)).digest('hex')}`;
}

/** @param {string | undefined} value @param {string} secret */
export function validPreviewSession(value, secret) {
  if (!value || !secret) return false;
  const expires = Number(value.split('.')[0]);
  return Number.isFinite(expires) && expires > Date.now() && equalSecret(value, previewSession(secret, expires));
}

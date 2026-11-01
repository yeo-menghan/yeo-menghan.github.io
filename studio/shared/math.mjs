import katex from 'katex';

// The editor, published pages, and migration validator share this configuration.
export function renderMath(latex, displayMode = false) {
  return katex.renderToString(latex, {
    displayMode,
    throwOnError: true,
    trust: false,
    strict: 'warn',
    output: 'htmlAndMathml',
    maxExpand: 1000,
  });
}

export function validateMath(latex) {
  if (typeof latex !== 'string' || !latex.trim()) return 'Enter an equation';
  try { renderMath(latex); return true; }
  catch (error) { return error instanceof Error ? error.message : 'Invalid equation'; }
}

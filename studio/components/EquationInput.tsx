import { set, unset, type StringInputProps } from 'sanity';
import { renderMath } from '../shared/math.mjs';
import 'katex/dist/katex.min.css';

export function EquationInput(props: StringInputProps) {
  let html = '';
  let error = '';
  try { html = props.value ? renderMath(props.value, true) : ''; }
  catch (e) { error = e instanceof Error ? e.message : 'Invalid equation'; }
  return <div>
    <textarea {...props.elementProps} value={props.value || ''} readOnly={props.readOnly}
      onChange={event => props.onChange(event.target.value ? set(event.target.value) : unset())}
      rows={4} style={{ width: '100%', padding: 12, fontFamily: 'monospace' }} />
    <p>Enter LaTeX without $ delimiters. The equation previews below.</p>
    {error ? <p role="alert" style={{ color: 'crimson' }}>{error}</p>
      : <div style={{ overflowX: 'auto' }} dangerouslySetInnerHTML={{ __html: html }} />}
  </div>;
}

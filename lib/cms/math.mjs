// Keep the implementation inside Studio so Studio can deploy independently.
// The website imports only this small module, never Studio's React/Sanity code.
export { renderMath, validateMath } from '../../studio/shared/math.mjs';

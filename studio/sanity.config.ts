import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemaTypes';
import { PreviewAction } from './components/PreviewAction';

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
if (!projectId || !dataset) throw new Error('Set SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET in studio/.env.local');

export default defineConfig({
  name: 'writing', title: 'Meng Han — Writing', projectId, dataset,
  plugins: [structureTool()], schema: { types: schemaTypes },
  document: { actions: (actions, context) => context.schemaType === 'article' ? [...actions, PreviewAction] : actions },
});

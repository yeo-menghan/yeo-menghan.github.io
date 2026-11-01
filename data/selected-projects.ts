export const selectedProjects: Record<string, { kind: string; description: string; diagram: string }> = {
  'eKYC-facial': { kind: 'DEPLOYMENT · PROOF OF CONCEPT', description: 'Facial liveness, ONNX inference and AWS deployment. A proof of concept with documented security limitations; hosted demo retired.', diagram: 'vision' },
  'ippt-trainer': { kind: 'COMPUTER VISION · PERSONAL TRAINING EXPERIMENT', description: 'A MediaPipe and OpenCV training companion, built with AI assistance. A personal experiment without a formal counting benchmark.', diagram: 'pose' },
  'grain-project': { kind: 'SOFTWARE · TAKE-HOME EXPERIMENT', description: 'Exploring LLM driver scheduling through structured evaluation and iterative feedback.', diagram: 'route' },
};
export function orderProjects<T extends { slug: string }>(projects: T[]): T[] {
  const priority = Object.keys(selectedProjects);
  return [...projects].sort((a, b) => (priority.includes(a.slug) ? priority.indexOf(a.slug) : 99) - (priority.includes(b.slug) ? priority.indexOf(b.slug) : 99));
}

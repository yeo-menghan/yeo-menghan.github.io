// components/StructuredData.tsx
export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Yeo Meng Han',
    jobTitle: 'AI/ML Engineer',
    description: 'AI/ML Engineer specializing in RAG, LLMs, and Computer Vision',
    url: 'https://yeo-menghan.com',
    sameAs: [
      'https://www.linkedin.com/in/yeo-meng-han/',
      'https://github.com/yeo-menghan',
    ],
    alumniOf: {
      '@type': 'Organization',
      name: 'National University of Singapore',
    },
    knowsAbout: [
      'Machine Learning',
      'Artificial Intelligence',
      'RAG',
      'LLM',
      'Computer Vision',
      'Python'
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
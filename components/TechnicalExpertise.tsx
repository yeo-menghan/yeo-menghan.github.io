// components/TechnicalExpertise.tsx
import React from 'react';

interface SkillCategory {
  title: string;
  items: string[];
}

const TechnicalExpertise: React.FC = () => {
  const skillCategories: SkillCategory[] = [
    {
      title: 'Languages',
      items: ['Python (Primary)', 'C, C++', 'SQL', 'Java', 'Next.js'],
    },
    {
      title: 'ML/AI & Generative Models',
      items: [
        'PyTorch',
        'TensorFlow',
        'Diffusion Models / VLMs',
        'NLP, LLM, RAG',
        'scikit-learn',
      ],
    },
    {
      title: 'MLOps & Deployment',
      items: [
        'AWS, GCP',
        'CI/CD, GitHub Actions',
        'LangSmith, LangFuse',
        'Docker',
        'ONNX',
        'FastAPI',
      ],
    },
  ];

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">Technical Expertise</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {skillCategories.map((category, index) => (
          <div
            key={index}
            className="bg-slate-100 dark:bg-slate-800 rounded-xl p-5"
          >
            <h3 className="font-semibold mb-2">{category.title}</h3>
            <ul className="text-sm text-slate-700 dark:text-slate-300 list-disc list-inside space-y-1">
              {category.items.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechnicalExpertise;
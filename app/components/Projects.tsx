// components/Projects.tsx
'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

interface Project {
  title: string;
  description: string;
  tech: string[];
  link: string;
  categories: string[];
}

const projects: Project[] = [
  {
    title: 'SG-English Automatic Speech Recognition',
    description: 'Fine-tuned Whisper and Wav2Vec2 models on Singapore National Speech Corpus using LoRA and Optuna hyperparameter tuning, reducing Word Error Rate from 122.81% to 21.05%',
    tech: ['PyTorch', 'LoRA', 'Optuna', 'Whisper', 'Wav2Vec2'],
    link: 'https://github.com/yeo-menghan/SG_Eng_ASR',
    categories: ['NLP']
  },
  {
    title: 'AISG National AI Challenge 2024',
    description: 'Top 3 winner - Engineered Chain-of-Thought prompts for GPT-3.5-turbo within LangChain to deliver fraud warnings for email analysis. Integrated Gmail API into Chrome extension',
    tech: ['LangChain', 'GPT-3.5-turbo', 'Chrome Extension', 'Gmail API'],
    link: 'https://github.com/aisg-2024/langchain_backend',
    categories: ['LLM', 'Web Dev']
  },
  {
    title: 'Grain: Driver-Order Allocation System',
    description: 'Build a working prototype of an AI-powered delivery allocation system that intelligently assigns catering orders to delivery specialists based on constraints, priorities, and logistics.',
    tech: ['Streamlit', 'Folium', 'Python', 'OpenAI API'],
    link: 'https://github.com/yeo-menghan/grain-project',
    categories: ['LLM', 'Visualisation']
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h3>
          <p className="text-slate-400 mb-12">
            A selection of my work in machine learning, computer vision, and LLM applications
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
              >
                <div className="flex justify-between items-start mb-3 gap-3">
                  <div>
                    {project.categories.map((category, i) => (
                      <span
                        key={i}
                        className="text-xs font-semibold text-purple-400 bg-purple-400/10 px-2 py-1 rounded mr-1 mb-1"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  {project.link !== '#' && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
                
                <h4 className="text-xl font-bold mb-3">{project.title}</h4>
                <p className="text-slate-300 mb-4 text-sm leading-relaxed">{project.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
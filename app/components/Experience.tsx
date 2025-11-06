// components/Experience.tsx
'use client';

import { motion } from 'framer-motion';

interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  highlights: string[];
  description: string;
}

const experiences: ExperienceItem[] = [
  {
    company: 'NUS Office of Internal Audit',
    role: 'Software Engineer Intern',
    period: 'Sep 2025 - Current',
    description: 'Developing AI-powered solutions to enhance audit processes and data analysis',
    highlights: ['Document Tampering Detection', 'AI-Generated Receipt Detection']
  },
  {
    company: 'Changi Airport Group',
    role: 'Machine Learning Engineer Intern',
    period: 'May 2025 - Aug 2025',
    description: 'Enhanced ML systems for airport operations and passenger flow optimization',
    highlights: ['62% Forecasting Accuracy', 'AWS Deployment', 'CI/CD Pipeline', '18K+ Flight Analysis']
  },
  {
    company: 'Cisco-NUS Accelerated Digital Economy Lab',
    role: 'Research Assistant',
    period: 'Jan 2025 - May 2025',
    description: 'Built real-time computer vision systems for human tracking and motion analysis in surgical environments',
    highlights: ['YOLOv8 + DEEPSort', '84% mAP Accuracy', '15 FPS Real-time', 'Digital Twinning']
  },
  {
    company: 'Rockship (NUS Overseas College Vietnam)',
    role: 'AI & Computer Vision Engineer Intern',
    period: 'Jan 2024 - Jun 2024',
    description: 'Built production-ready RAG pipelines and edge computer vision solutions',
    highlights: ['RAG Pipelines', 'LlamaIndex APIs', 'Swift App with CoreML & ARKit Integration']
  },
  {
    company: 'DSTA Land Systems',
    role: 'Robotics Engineer Intern',
    period: 'May 2023 - Jul 2023',
    description: 'Integrated SLAM algorithms and built multi-robot coordination frameworks',
    highlights: ['VSLAM RTAB-Map', 'ROS Framework', 'MQTT Communication', 'Multi-robot System']
  }
];

export default function Experience() {
  return (
    <section id="experience" className="py-20 px-6 bg-slate-800/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl md:text-4xl font-bold mb-12">Experience</h3>
          <div className="space-y-8">
            {experiences.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-900/50 rounded-xl p-6 border border-slate-700 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                  <div>
                    <h4 className="text-xl font-bold text-blue-400">{exp.role}</h4>
                    <p className="text-lg text-slate-300">{exp.company}</p>
                  </div>
                  <span className="text-slate-400 mt-2 md:mt-0">{exp.period}</span>
                </div>
                <p className="text-slate-300 mb-4">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.highlights.map((highlight, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300 border border-slate-700"
                    >
                      {highlight}
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
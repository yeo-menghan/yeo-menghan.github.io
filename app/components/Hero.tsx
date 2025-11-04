// components/Hero.tsx
'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';

export default function Hero() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="about" className="min-h-screen flex items-center justify-center px-6 relative">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md z-40 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Yeo Meng Han
          </h1>
          <div className="flex gap-6 items-center">
            <button 
              onClick={() => scrollToSection('about')}
              className="hover:text-blue-400 transition-colors hidden md:block"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('experience')}
              className="hover:text-blue-400 transition-colors hidden md:block"
            >
              Experience
            </button>
            <button 
              onClick={() => scrollToSection('projects')}
              className="hover:text-blue-400 transition-colors hidden md:block"
            >
              Projects
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="hover:text-blue-400 transition-colors hidden md:block"
            >
              Contact
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-6">
            <h2 className="text-5xl md:text-7xl font-bold mb-4">
              Yeo Meng Han
            </h2>
            <p className="text-2xl md:text-3xl text-blue-400 font-semibold mb-6">
              Aspiring AI/ML Engineer
            </p>
          </div>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl leading-relaxed">
            Building intelligent systems with RAG, LLMs, and Computer Vision. 
            NUS Engineering Scholar specializing in end-to-end ML solutions 
            from research to production deployment.
          </p>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-400 mb-4">Key Achievements:</h3>
            <div className="grid md:grid-cols-3 gap-4 max-w-3xl">
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <p className="text-3xl font-bold text-blue-400 mb-1">62%</p>
                <p className="text-sm text-slate-300">Taxi demand forecasting accuracy at Changi Airport</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <p className="text-3xl font-bold text-purple-400 mb-1">Top 3</p>
                <p className="text-sm text-slate-300">AISG National AI Challenge 2024</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <p className="text-3xl font-bold text-green-400 mb-1">21%</p>
                <p className="text-sm text-slate-300">WER for SG-English ASR (from 122%)</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 flex-wrap items-center">
            <button 
              onClick={() => scrollToSection('projects')}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              View Projects
            </button>
            <a 
              href="mailto:yeo_menghan@u.nus.edu"
              className="px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors"
            >
              Get in Touch
            </a>
            <div className="flex gap-4 ml-4">
              <a 
                href="https://github.com/yeo-menghan" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                <Github size={24} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors"
              >
                <Linkedin size={24} />
              </a>
              <a 
                href="mailto:yeo_menghan@u.nus.edu"
                className="hover:text-blue-400 transition-colors"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
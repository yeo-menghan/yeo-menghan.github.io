'use client';

import {useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail, Code2, Menu, X} from 'lucide-react';

export default function Hero() {

  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false); // close menu after clicking
  };

  return (
    <section id="about" className="min-h-screen flex items-center justify-center px-6 relative">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md z-40 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <button onClick={() => scrollToSection('about')}>
            <Code2 size={28} />
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6 items-center">
            <button onClick={() => scrollToSection('about')} className="hover:text-blue-400 transition-colors">About</button>
            <button onClick={() => scrollToSection('experience')} className="hover:text-blue-400 transition-colors">Experience</button>
            <button onClick={() => scrollToSection('projects')} className="hover:text-blue-400 transition-colors">Projects</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-blue-400 transition-colors">Contact</button>
          </div>

          {/* Mobile Hamburger Icon */}
          <button
            className="md:hidden hover:text-blue-400 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-slate-900 border-t border-slate-700"
            >
              <div className="flex flex-col px-6 py-4 space-y-3">
                <button onClick={() => scrollToSection('about')} className="text-left hover:text-blue-400 transition-colors">About</button>
                <button onClick={() => scrollToSection('experience')} className="text-left hover:text-blue-400 transition-colors">Experience</button>
                <button onClick={() => scrollToSection('projects')} className="text-left hover:text-blue-400 transition-colors">Projects</button>
                <button onClick={() => scrollToSection('contact')} className="text-left hover:text-blue-400 transition-colors">Contact</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Content */}
      <div className="max-w-6xl mx-auto w-full px-6 mt-24"> 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >

          <div className="mb-6 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <img
              src="/yeo-menghan.jpg"
              alt="Yeo Meng Han"
              className="w-40 h-40 md:w-40 md:h-40 rounded-2xl object-cover border-2 border-slate-700 shadow-md"
            />
            <div>
              <h2 className="text-4xl md:text-7xl font-bold mb-2 mt-2 md:mt-0">
                Yeo Meng Han
              </h2>
              <p className="text-xl md:text-3xl text-blue-400 font-semibold">
                Aspiring AI/ML Engineer
              </p>
            </div>
          </div>


          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl leading-relaxed">
            Building intelligent systems with Machine Learning, AI / LLMs, and Computer Vision. 
          </p>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-400 mb-4">Key Achievements:</h3>
            <div className="grid md:grid-cols-3 gap-4 max-w-3xl">
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <p className="text-3xl font-bold text-blue-400 mb-1">3 years</p>
                <p className="text-sm text-slate-300">Duration of NUS BEng Computer Engineering with First Class Honours</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <p className="text-3xl font-bold text-purple-400 mb-1">Top 3</p>
                <p className="text-sm text-slate-300">AISG National AI Challenge 2024</p>
              </div>
              {/* <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <p className="text-3xl font-bold text-green-400 mb-1">MSc DSML</p>
                <p className="text-sm text-slate-300">Currently pursuing masters at NUS!</p>
              </div> */}
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <a 
                  href="https://www.math.nus.edu.sg/ms-dsml-v1/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-3xl font-bold text-green-400 mb-1 inline-block"
                >
                  MSc DSML<span className="align-super text-sm ml-1">↗</span>
                </a>
                <p className="text-sm text-slate-300">Currently pursuing masters at NUS!</p>
              </div>

            </div>
          </div>

          {/* Personal Intro Section */}
          <div className="mb-8 max-w-3xl">
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              Outside of tech, I'm a huge <span className="text-slate-200 font-medium">gamer and football</span> fan, 
              love exploring music and cycling routes, and enjoy learning about civilisations and history. 
            </p>
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
              <a href="https://github.com/yeo-menghan" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                <Github size={24} />
              </a>
              <a href="https://www.linkedin.com/in/yeo-meng-han/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                <Linkedin size={24} />
              </a>
              <a href="mailto:yeo_menghan@u.nus.edu" className="hover:text-blue-400 transition-colors">
                <Mail size={24} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
// components/Footer.tsx
'use client';

import { Github, Linkedin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="py-20 px-6 bg-slate-900 border-t border-slate-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Let&apos;s Connect
            </h3>
            <p className="text-slate-300 mb-6">
              I&apos;m always open to discussing new and interesting projects or opportunities!
            </p>
            <div className="space-y-3">
              <a 
                href="mailto:yeo_menghan@u.nus.edu"
                className="flex items-center gap-3 text-slate-300 hover:text-blue-400 transition-colors"
              >
                <Mail size={20} />
                <span>yeo_menghan@u.nus.edu</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4">Quick Links</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <a 
                  href="#about"
                  className="block text-slate-300 hover:text-blue-400 transition-colors"
                >
                  About
                </a>
                <a 
                  href="#experience"
                  className="block text-slate-300 hover:text-blue-400 transition-colors"
                >
                  Experience
                </a>
              </div>
              <div className="space-y-3">
                <a 
                  href="#projects"
                  className="block text-slate-300 hover:text-blue-400 transition-colors"
                >
                  Projects
                </a>
                <a 
                  href="#contact"
                  className="block text-slate-300 hover:text-blue-400 transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © 2025 Yeo Meng Han. Built with Next.js and Tailwind CSS.
            </p>
            <div className="flex gap-6">
              <a 
                href="https://github.com/yeo-menghan" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-400 transition-colors"
                aria-label="GitHub"
              >
                <Github size={24} />
              </a>
              <a 
                href="https://www.linkedin.com/in/yeo-meng-han/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
              <a 
                href="mailto:yeo_menghan@u.nus.edu"
                className="text-slate-400 hover:text-blue-400 transition-colors"
                aria-label="Email"
              >
                <Mail size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
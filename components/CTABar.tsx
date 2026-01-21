'use client';

import { Download, Linkedin, Github, Mail } from 'lucide-react';
import Link from 'next/link';

export default function CTABar() {
  return (
    <div className="flex flex-row flex-wrap items-center gap-4">
      {/* Resume Button — thematically aligned */}
      <Link
        href="/yeo_menghan_resume.pdf"
        download
        className="group flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200
          text-slate-700 hover:text-slate-900 
          dark:text-slate-300 dark:hover:text-white
          hover:bg-slate-200 
          dark:hover:bg-slate-700
          border border-transparent hover:border-slate-300 
          dark:hover:border-slate-600
          whitespace-nowrap"
      >
        Resume
        <Download size={16} className="opacity-70 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Social Icons */}
      <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
        <Link
          href="https://linkedin.com/in/yeo-meng-han"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 
            hover:text-slate-900 dark:hover:text-white transition-colors"
          aria-label="LinkedIn"
        >
          <Linkedin size={20} />
        </Link>
        <Link
          href="https://github.com/yeo-menghan"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 
            hover:text-slate-900 dark:hover:text-white transition-colors"
          aria-label="GitHub"
        >
          <Github size={20} />
        </Link>
        <Link
          href="mailto:yeomenghan1989@gmail.com"
          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 
            hover:text-slate-900 dark:hover:text-white transition-colors"
          aria-label="Email"
        >
          <Mail size={20} />
        </Link>
      </div>
    </div>
  );
}
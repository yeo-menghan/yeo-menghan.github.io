'use client';

import { Download, Linkedin, Github, Mail } from 'lucide-react';
import Link from 'next/link';

export default function CTABar() {
  return (
    <div className="flex flex-row flex-wrap items-center gap-4 py-6">
      {/* Resume Button */}
      <Link
        href="/yeo_menghan_resume.pdf"
        download
        className="group flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all duration-200 border border-slate-700 hover:border-slate-600 whitespace-nowrap"
      >
        Resume
        <Download size={16} className="opacity-70 group-hover:opacity-100 transition-opacity" />
      </Link>

      {/* Social Icons */}
      <div className="flex items-center gap-4 text-slate-400">
        <Link
          href="https://linkedin.com/in/yeo-meng-han"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
          aria-label="LinkedIn"
        >
          <Linkedin size={20} />
        </Link>
        <Link
          href="https://github.com/yeo-menghan"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
          aria-label="GitHub"
        >
          <Github size={20} />
        </Link>
        <Link
          href="mailto:yeomenghan1989@gmail.com"
          className="hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
          aria-label="Email"
        >
          <Mail size={20} />
        </Link>
      </div>
    </div>
  );
}
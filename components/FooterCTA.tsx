'use client';

import { Linkedin, Github, Mail } from 'lucide-react';
import Link from 'next/link';

export default function FooterCTA() {
  return (
    <footer className="w-full py-12">
      <div className="flex flex-row flex-wrap items-center justify-between gap-4 w-full max-w-4xl mx-auto px-4">
        {/* Left: Copyright / Trademark */}
        <span className="text-slate-500 dark:text-slate-400 text-sm">
          © {new Date().getFullYear()} @yeo-menghan.com
        </span>

        {/* Right: Social Icons */}
        <div className="flex items-center gap-4">
          <Link
            href="https://linkedin.com/in/yeo-meng-han"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </Link>
          <Link
            href="https://github.com/yeo-menghan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <Github size={20} />
          </Link>
          <Link
            href="mailto:yeomenghan1989@gmail.com"
            className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            aria-label="Email"
          >
            <Mail size={20} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
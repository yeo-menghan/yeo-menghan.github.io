import { Mail, Github, Linkedin, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          I&apos;m always open to discussing new opportunities, collaborations, or just chatting about AI and technology
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <a
          href="mailto:yeomenghan1989@gmail.com"
          className="flex items-start gap-4 p-6 border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-lg dark:hover:shadow-slate-800/50 transition-all hover:border-blue-500 dark:hover:border-blue-500 group"
        >
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors">
            <Mail className="text-blue-600 dark:text-blue-400 group-hover:text-white" size={24} />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Email</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">yeomenghan1989@gmail.com</p>
          </div>
        </a>

        <a
          href="https://github.com/yeo-menghan"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-4 p-6 border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-lg dark:hover:shadow-slate-800/50 transition-all hover:border-blue-500 dark:hover:border-blue-500 group"
        >
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-slate-900 dark:group-hover:bg-white transition-colors">
            <Github className="text-slate-700 dark:text-slate-300 group-hover:text-white dark:group-hover:text-slate-900" size={24} />
          </div>
          <div>
            <h3 className="font-semibold mb-1">GitHub</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">@yeo-menghan</p>
          </div>
        </a>

        <a
          href="https://www.linkedin.com/in/yeo-meng-han"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-4 p-6 border border-slate-200 dark:border-slate-700 rounded-lg hover:shadow-lg dark:hover:shadow-slate-800/50 transition-all hover:border-blue-500 dark:hover:border-blue-500 group"
        >
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors">
            <Linkedin className="text-blue-600 dark:text-blue-400 group-hover:text-white" size={24} />
          </div>
          <div>
            <h3 className="font-semibold mb-1">LinkedIn</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Yeo Meng Han</p>
          </div>
        </a>

        <div className="flex items-start gap-4 p-6 border border-slate-200 dark:border-slate-700 rounded-lg">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <MapPin className="text-green-600 dark:text-green-400" size={24} />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Location</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Singapore</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Let&apos;s Collaborate</h2>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          I&apos;m particularly interested in projects involving:
        </p>
        <ul className="space-y-2 text-slate-700 dark:text-slate-300">
          <li className="flex gap-2">
            <span className="text-blue-600 dark:text-blue-400">→</span>
            <span>Large Language Models and RAG systems</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 dark:text-blue-400">→</span>
            <span>Computer Vision applications</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 dark:text-blue-400">→</span>
            <span>AI-powered solutions for real-world problems</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-600 dark:text-blue-400">→</span>
            <span>Research in deep learning and neural networks</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
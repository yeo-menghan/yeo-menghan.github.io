// app/page.tsx

import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot'; 

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Hero />
      <Experience />
      <Projects />
      <Footer />
      <Chatbot />
    </main>
  );
}
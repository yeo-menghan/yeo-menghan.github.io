import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Navigation from "@/components/Navigation";
import Chatbot from "@/components/Chatbot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Yeo Meng Han - AI/ML Engineer',
  description: 'Portfolio of Yeo Meng Han, AI/ML Engineer specializing in RAG, LLMs, and Computer Vision',
  keywords: [
    'Yeo Meng Han',
    'AI Engineer',
    'ML Engineer',
    'Machine Learning',
    'Artificial Intelligence',
    'RAG',
    'LLM',
    'Computer Vision',
    'Portfolio',
    'NUS Engineering Scholar',
    'NUS',
    'National University of Singapore',
    'Python'
  ],
  authors: [{ name: 'Yeo Meng Han', url: 'https://yeo-menghan.github.io/' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Yeo Meng Han - AI/ML Engineer',
    description: 'Portfolio of Yeo Meng Han, AI/ML Engineer specializing in RAG, LLMs, and Computer Vision',
    url: 'https://yeo-menghan.github.io/',
    siteName: 'Yeo Meng Han Portfolio',
    images: [
      {
        url: '/chess.svg',
        width: 1200,
        height: 630,
        alt: 'Yeo Meng Han - AI/ML Engineer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
            <Navigation />
            <main className="container mx-auto px-4 py-8 max-w-6xl">
              {children}
            </main>
            <Chatbot />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
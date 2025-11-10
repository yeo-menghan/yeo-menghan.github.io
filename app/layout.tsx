// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SpeedInsights } from "@vercel/speed-insights/next"
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
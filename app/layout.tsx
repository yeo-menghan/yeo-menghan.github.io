import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Navigation from "@/components/Navigation";
import Chatbot from "@/components/Chatbot";
import StructuredData from "@/components/StructuredData";
import { Analytics } from "@vercel/analytics/next"; 
import FooterCTA from "@/components/FooterCTA";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'Yeo Meng Han - AI/ML Engineer',
    template: '%s | Yeo Meng Han'
  },
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
  authors: [{ name: 'Yeo Meng Han', url: 'https://yeo-menghan.com/' }],
  creator: 'Yeo Meng Han',
  publisher: 'Yeo Meng Han',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/chess.svg',
    shortcut: '/chess.svg',
    apple: '/chess.svg',
  },
  openGraph: {
    title: 'Yeo Meng Han - AI/ML Engineer',
    description: 'Portfolio of Yeo Meng Han, AI/ML Engineer specializing in RAG, LLMs, and Computer Vision',
    url: 'https://yeo-menghan.com/',
    siteName: 'Yeo Meng Han Portfolio',
    images: [
      {
        url: 'https://yeo-menghan.com/chess.svg', // Use absolute URL
        width: 1200,
        height: 630,
        alt: 'Yeo Meng Han - AI/ML Engineer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yeo Meng Han - AI/ML Engineer',
    description: 'Portfolio of Yeo Meng Han, AI/ML Engineer specializing in RAG, LLMs, and Computer Vision',
    images: ['https://yeo-menghan.com/chess.svg'],
  },
  metadataBase: new URL('https://yeo-menghan.com'),
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          {/* <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
            <Navigation />
            <main className="container mx-auto px-4 py-8 max-w-6xl">
              {children}
            </main>
            <Chatbot />
          </div> */}
          <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
            <div className="container mx-auto px-4 max-w-3xl">
              <Navigation />
              <main className="py-8">
                {children}
              </main>
              <FooterCTA />
              <Chatbot />
            </div>
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
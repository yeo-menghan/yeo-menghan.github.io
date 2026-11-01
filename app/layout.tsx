import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./rooftop.css";
import Navigation from "@/components/Navigation";
import StructuredData from "@/components/StructuredData";
import { Analytics } from "@vercel/analytics/next"; 
import PreviewBanner from "@/components/PreviewBanner";
import FooterCTA from "@/components/FooterCTA";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'Yeo Meng Han — Computer Vision Engineer',
    template: '%s | Yeo Meng Han'
  },
  description: 'Computer vision, edge AI and robotics. I build intelligent systems that connect software to the physical world.',
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
    title: 'Yeo Meng Han — Computer Vision Engineer',
    description: 'Computer vision, edge AI and robotics. I build intelligent systems that connect software to the physical world.',
    url: 'https://yeo-menghan.com/',
    siteName: 'Yeo Meng Han Portfolio',
    images: [
      {
        url: 'https://yeo-menghan.com/chess.svg', // Use absolute URL
        width: 1200,
        height: 630,
        alt: 'Yeo Meng Han — Computer Vision Engineer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yeo Meng Han — Computer Vision Engineer',
    description: 'Computer vision, edge AI and robotics. I build intelligent systems that connect software to the physical world.',
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
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body className={inter.className}>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Navigation />
        <div className="site-shell">
          <PreviewBanner />
          <main id="main-content" className="site-main">{children}</main>
          <FooterCTA />
        </div>
        <Analytics />
      </body>
    </html>
  );
}

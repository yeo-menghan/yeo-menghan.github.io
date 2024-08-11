import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "./components/home/header";
import Footer from "./components/home/footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meng Han",
  description: "Meng Han's personal website.",
  icons: {
    icon: "/chess.svg",
  },
  openGraph: {
    title: "Meng Han",
    description: "Meng Han's personal website.",
    url: "https://yeo-menghan.github.io/",
    siteName: "Yeo Meng Han",
    images: [
      {
        url: "https://yeo-menghan.github.io/yeo-menghan.jpg",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="shortcut icon" href="/chess.svg" />
      </head>
      <body className={`${inter.className} bg-gray-600 text-white`}>
        <Header></Header>
        {children}
        <Footer></Footer>
      </body>
    </html>
  );
}

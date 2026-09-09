import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { siteConfig } from '@/lib/site';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    type: 'website',
    images: [{ url: '/og.png', width: 1729, height: 910, alt: 'CpE Atlas — Explore Computer Engineering from the inside out.' }],
  },
  twitter: { card: 'summary_large_image', title: siteConfig.title, description: siteConfig.description, images: ['/og.png'] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="dark"><body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body></html>;
}

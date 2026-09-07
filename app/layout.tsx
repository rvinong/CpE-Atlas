import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://cpe-atlas.rvintite.chatgpt.site'),
  title: 'CpE Atlas — Interactive Computer Engineering',
  description:
    'Explore computers, motherboards, microcontrollers, and circuits in 3D. Take systems apart and discover how every component works.',
  openGraph: {
    title: 'CpE Atlas',
    description: 'Explore Computer Engineering from the inside out.',
    type: 'website',
    images: [
      {
        url: 'https://cpe-atlas.rvintite.chatgpt.site/og.png',
        width: 1729,
        height: 910,
        alt: 'CpE Atlas — Explore Computer Engineering from the inside out.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CpE Atlas',
    description: 'Explore Computer Engineering from the inside out.',
    images: ['https://cpe-atlas.rvintite.chatgpt.site/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

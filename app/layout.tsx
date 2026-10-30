import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import AuthProvider from '@/components/AuthProvider/AuthProvider';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import React from 'react';
import './globals.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NoteHub - Your Personal Notes Manager',
  description:
    'Organize your thoughts, categorize notes by tags, and increase your daily productivity with NoteHub.',
  openGraph: {
    title: 'NoteHub - Your Personal Notes Manager',
    description:
      'Organize your thoughts, categorize notes by tags, and increase your daily productivity with NoteHub.',
    url: 'https://notehub.com/',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub Application Preview Logo',
      },
    ],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en">
      {}
      <body className={`${roboto.variable} ${roboto.className}`}>
        <TanStackProvider>
          {}
          <AuthProvider>
            <Header />

            <main>{children}</main>

            {}
            {modal}

            <Footer />
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}

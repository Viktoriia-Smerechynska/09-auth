// src/app/not-found.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import css from './not-found.module.css';

export const metadata: Metadata = {
  title: '404 - Page not found | NoteHub',
  description: 'Sorry, the page you are looking for does not exist on NoteHub server.',
  openGraph: {
    title: '404 - Page not found | NoteHub',
    description: 'Sorry, the page you are looking for does not exist on NoteHub server.',
    url: 'https://notehub.com',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub 404 Page Not Found',
      },
    ],
  },
};

export default function NotFound() {
  return (
    <div className={css.container}>
      {}
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>Sorry, the page you are looking for does not exist.</p>

      {}
      <Link href="/" className={css.homeButton}>
        Back to Home
      </Link>
    </div>
  );
}

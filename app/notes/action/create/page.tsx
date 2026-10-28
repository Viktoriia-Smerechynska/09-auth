// src/app/notes/action/create/page.tsx
import type { Metadata } from 'next';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from './CreateNote.module.css';

export const metadata: Metadata = {
  title: 'Create New Note | NoteHub',
  description:
    'Create a new personal note, set a category tag, and save it to your NoteHub account.',
  openGraph: {
    title: 'Create New Note | NoteHub',
    description:
      'Create a new personal note, set a category tag, and save it to your NoteHub account.',
    url: 'https://notehub.com/notes/action/create',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub Create Note Workspace',
      },
    ],
  },
};

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        {}
        <h1 className={css.title}>Create note</h1>

        {}
        <NoteForm />
      </div>
    </main>
  );
}

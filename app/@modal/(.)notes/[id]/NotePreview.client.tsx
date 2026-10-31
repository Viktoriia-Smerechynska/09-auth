// src/app/@modal/(.)notes/[id]/NotePreview.client.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchNoteById } from '@/lib/api/clientApi';
import Modal from '@/components/Modal/Modal';
import css from './NotePreview.module.css';

interface NotePreviewClientProps {
  id: string;
}

export default function NotePreviewClient({ id }: NotePreviewClientProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
    enabled: !!id,
  });

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal onClose={handleClose}>
      <div className={css.previewContainer}>
        {isLoading && <p className={css.message}>Loading preview, please wait...</p>}

        {(isError || !note) && !isLoading && (
          <p className={css.message}>Something went wrong. Could not load note details.</p>
        )}

        {!isLoading && !isError && note && (
          <article className={css.noteArticle}>
            <header className={css.header}>
              <h2>{note.title}</h2>
              <span className={css.tag}>{note.tag}</span>
            </header>

            <p className={css.content}>{note.content}</p>

            <footer className={css.footer}>
              <span className={css.date}>
                Created: {new Date(note.createdAt).toLocaleDateString()}
              </span>
            </footer>
          </article>
        )}
      </div>
    </Modal>
  );
}

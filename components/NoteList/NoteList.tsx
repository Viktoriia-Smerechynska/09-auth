// components/NoteList/NoteList.tsx
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '@/lib/api'; // 🌟 Імпортуємо нашу нову функцію
import { Note } from '@/types/note';
import Link from 'next/link';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
}

const NoteList = ({ notes }: NoteListProps) => {
  const queryClient = useQueryClient();

  const deleteNoteMutation = useMutation({
    // 🌟 ВИПРАВЛЕНО: Замість api.delete викликаємо чисту функцію deleteNote з нашого api.ts
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  return (
    // Уся решта вашої верстки (ul, li, title, buttons) залишається АБСОЛЮТНО БЕЗ ЗМІН
    <ul className={css.list}>
      {notes.map(note => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <div
              className={css.actions}
              style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
            >
              <Link href={`/notes/${note.id}`} className={css.buttonDetails}>
                View details
              </Link>
              <button
                className={css.button}
                onClick={() => deleteNoteMutation.mutate(note.id)}
                disabled={deleteNoteMutation.isPending}
              >
                {deleteNoteMutation.isPending ? '...' : 'Delete'}
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;

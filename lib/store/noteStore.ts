// src/lib/store/noteStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NoteTag } from '@/types/note';

interface DraftValues {
  title: string;
  content: string;
  tag: NoteTag;
}

interface NoteStore {
  draft: DraftValues;
  setDraft: (updatedFields: Partial<DraftValues>) => void;
  clearDraft: () => void;
}

const initialDraft: DraftValues = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useNoteStore = create<NoteStore>()(
  persist(
    set => ({
      draft: initialDraft,

      setDraft: updatedFields =>
        set(state => ({
          draft: {
            ...state.draft,
            ...updatedFields,
          },
        })),

      clearDraft: () =>
        set(() => ({
          draft: initialDraft,
        })),
    }),
    {
      name: 'notehub-draft-store',

      partialize: state => ({ draft: state.draft }),
    }
  )
);

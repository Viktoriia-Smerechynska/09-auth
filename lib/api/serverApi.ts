// src/lib/api/serverApi.ts
import { cookies } from 'next/headers';
import { api } from './api';
import { Note } from '@/types/note';
import { NoteListResponse } from './clientApi';

const getServerHeaders = async () => {
  const cookieStore = await cookies();
  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
};

export const fetchNotes = async (page: number = 1, searchQuery: string = '', tag: string = '') => {
  const params: Record<string, any> = {
    page: Number(page),
    perPage: 12,
  };

  if (searchQuery && searchQuery.trim() !== '') {
    params.search = searchQuery.trim();
  }

  if (tag && tag.trim() !== '' && tag !== 'all') {
    params.tag = tag.trim();
  }

  const config = await getServerHeaders();
  const res = await api.get<NoteListResponse>('/notes', { ...config, params });
  return res.data;
};

export const fetchNoteById = async (id: string) => {
  const config = await getServerHeaders();
  const res = await api.get<Note>(`/notes/${id}`, config);
  return res.data;
};

export const getMe = async () => {
  const config = await getServerHeaders();
  const res = await api.get('/users/me', config);
  return res.data;
};

export const checkSession = async () => {
  const config = await getServerHeaders();
  const res = await api.get('/auth/session', config);
  return res.data;
};

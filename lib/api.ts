// src/lib/api.ts
import axios from 'axios';
import { Note } from '@/types/note';

export type NoteListResponse = {
  notes: Note[];
  totalPages: number;
};

const KEY = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
const headers: Record<string, string> = {};

if (KEY) {
  const cleanKey = KEY.replace(/['"]/g, '').trim();
  headers['Authorization'] = `Bearer ${cleanKey}`;
}

export const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers,
});

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

  const res = await api.get<NoteListResponse>('/notes', { params });
  return res.data;
};

export const getNotes = fetchNotes;

export const getSingleNote = async (id: string) => {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
};

export const fetchNoteById = getSingleNote;

export const createNote = async (noteData: { title: string; content: string; tag: string }) => {
  const res = await api.post<Note>('/notes', noteData);
  return res.data;
};

export type DeleteNoteResponse = {
  note: Note;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await api.delete<DeleteNoteResponse>(`/notes/${id}`);
  return res.data.note;
};

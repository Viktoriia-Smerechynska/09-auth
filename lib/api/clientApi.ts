// src/lib/api/clientApi.ts
import { api } from './api';
import { Note } from '@/types/note';
import { User } from '@/types/user';

export interface UpdateUserPayload {
  username: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  email: string;
  password?: string;
}

export type NoteListResponse = {
  notes: Note[];
  totalPages: number;
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

  const res = await api.get<NoteListResponse>('/notes', { params });
  return res.data;
};

export const fetchNoteById = async (id: string) => {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
};

export const createNote = async (noteData: { title: string; content: string; tag: string }) => {
  const res = await api.post<Note>('/notes', noteData);
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  interface DeleteNoteResponse {
    note: Note;
  }
  const res = await api.delete<DeleteNoteResponse>(`/notes/${id}`);
  return res.data.note;
};

export const register = async (userData: RegisterCredentials): Promise<User> => {
  const res = await api.post<User>('/auth/register', userData);
  return res.data;
};

export const login = async (credentials: LoginCredentials): Promise<User> => {
  const res = await api.post<User>('/auth/login', credentials);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const checkSession = async (): Promise<User | null> => {
  const res = await api.get<User | null>('/auth/session');
  return res.data;
};

export const getMe = async (): Promise<User> => {
  const res = await api.get<User>('/users/me');
  return res.data;
};

export const updateMe = async (userData: UpdateUserPayload): Promise<User> => {
  const res = await api.patch<User>('/users/me', userData);
  return res.data;
};

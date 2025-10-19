import type { NewUser, User } from '@/types/user';
import { Note, CreateNote, CheckSession } from '@/types/note';

import { nextServer } from './api';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface Params {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

export async function fetchNotes(
  searchValue: string = '',
  page: number = 1,
  tag?: string,
  perPage: number = 12
): Promise<FetchNotesResponse> {
  const params: Params = {
    page,
    perPage,
    tag,
  };

  if (searchValue) {
    params.search = searchValue;
  }

  const response = await nextServer.get<FetchNotesResponse>('/notes', {
    params,
  });
  return response.data;
}

export async function createNote(note: CreateNote): Promise<Note> {
  const response = await nextServer.post<Note>('/notes', note);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await nextServer.delete<Note>(`/notes/${id}`);
  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await nextServer.get<Note>(`/notes/${id}`);
  return response.data;
}

export async function registerUser(user: NewUser): Promise<User> {
  const response = await nextServer.post<User>('/auth/register', user);
  return response.data;
}

export async function loginUser(user: NewUser): Promise<User> {
  const response = await nextServer.post<User>('/auth/login', user);
  return response.data;
}

export async function checkSession() {
  const response = await nextServer.get<CheckSession>('/auth/session');
  return response.data.success;
}

export async function getMe() {
  const response = await nextServer.get<User>('/users/me');
  return response.data;
}

export async function logout() {
  const response = await nextServer.post('/auth/logout');
  return response.data;
}

export async function updateMe(data: Partial<User>) {
  const response = await nextServer.patch<User>('/users/me', data);
  return response.data;
}

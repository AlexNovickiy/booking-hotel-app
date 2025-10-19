import { cookies } from 'next/headers';
import { nextServer } from './api';
import { Note } from '@/types/note';
import { User } from '@/types/user';
import { FetchNotesResponse } from './clientApi';

export async function getServerMe() {
  const cookieStore = await cookies();
  const response = await nextServer.get<User>('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
}

export async function updateServerMe(user: User) {
  const cookieStore = await cookies();
  const response = await nextServer.patch<User>('/users/me', user, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
}

export async function checkServerSession() {
  const cookieStore = await cookies();
  const response = await nextServer.get('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response;
}

export const fetchNotes = async (
  search: string,
  page: number,
  tag: string | undefined
): Promise<FetchNotesResponse> => {
  const cookieStore = await cookies();
  const params = {
    ...(search && { search }),
    tag,
    page,
    perPage: 12,
  };
  const headers = {
    Cookie: cookieStore.toString(),
  };
  const response = await nextServer.get<FetchNotesResponse>('/notes', {
    params,
    headers,
  });
  return response.data;
};

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieStore = await cookies();
  const response = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
}

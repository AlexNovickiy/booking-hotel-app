import axios from 'axios';
import { headers } from 'next/headers';
import { cookies } from 'next/headers';

export const nextServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

if (typeof window === 'undefined') {
  nextServer.interceptors.request.use(async config => {
    const headersList = await headers();
    const cookieStore = await cookies();
    config.headers.set('Authorization', headersList.get('Authorization') || '');
    config.headers.set('Cookie', cookieStore.toString());
    return config;
  });
}

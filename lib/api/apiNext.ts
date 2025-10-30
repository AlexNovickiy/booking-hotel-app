import axios from 'axios';
import { headers } from 'next/headers';

export const nextServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

if (typeof window === 'undefined') {
  nextServer.interceptors.request.use(async config => {
    const token = (await headers()).get('Authorization');
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>).Authorization = token;
    }
    return config;
  });
}

import axios from 'axios';

export const nextClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

if (typeof window !== 'undefined') {
  nextClient.interceptors.request.use(config => {
    const storedAuth = localStorage.getItem('auth-store');
    if (storedAuth) {
      const parsedAuth = JSON.parse(storedAuth);
      const token = parsedAuth.state.token;
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  });
}

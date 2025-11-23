'use client';

import { checkSession, getMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type AuthProviderProps = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useAuthStore(state => state.setUser);
  const clearAuth = useAuthStore(state => state.clearAuth);
  const setToken = useAuthStore(state => state.setToken);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const session = await checkSession();
      if (session.data.accessToken) {
        setToken(session.data.accessToken);
        const response = await getMe();
        if (response.data) setUser(response.data);
      } else {
        clearAuth();
        router.push('/login');
      }
    };
    fetchUser();
  }, [setUser, clearAuth, setToken, router]);

  return <>{children}</>;
}

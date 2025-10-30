'use client';

import { checkSession, getMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { useEffect } from 'react';

type AuthProviderProps = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useAuthStore(state => state.setUser);
  const clearAuth = useAuthStore(state => state.clearAuth);
  const setToken = useAuthStore(state => state.setToken);

  useEffect(() => {
    const fetchUser = async () => {
      const session = await checkSession();
      if (session.data.accessToken) {
        setToken(session.data.accessToken);
        const user = await getMe();
        if (user) setUser(user);
      } else {
        clearAuth();
      }
    };
    fetchUser();
  }, [setUser, clearAuth, setToken]);

  return <>{children}</>;
}

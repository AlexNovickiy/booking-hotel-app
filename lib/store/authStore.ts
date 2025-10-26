import { User } from '@/lib/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthStore = {
  user: Partial<User> | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: Partial<User>) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => {
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        setUser: user =>
          set(state => ({
            user: { ...state.user, ...user },
            isAuthenticated: true,
          })),
        setToken: token => set({ token, isAuthenticated: true }),
        clearAuth: () =>
          set({ user: null, token: null, isAuthenticated: false }),
      };
    },
    {
      name: 'auth-store',
      partialize: state => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

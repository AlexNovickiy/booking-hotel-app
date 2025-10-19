import { User } from '@/types/user';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthStore = {
  user: Partial<User> | null;
  isAuthenticated: boolean;
  setUser: (user: Partial<User>) => void;
  clearIsAuthenticated: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    set => {
      return {
        user: null,
        isAuthenticated: false,
        setUser: user =>
          set(state => ({
            user: { ...state.user, ...user },
            isAuthenticated: true,
          })),
        clearIsAuthenticated: () => set({ user: null, isAuthenticated: false }),
      };
    },
    {
      name: 'auth-store',
      partialize: state => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
    id: string;
    email: string;
};

type AuthStore = {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
};

export const useAuth = create<AuthStore>()(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set({ user }),
        logout: () => set({ user: null }),
      }),
      {
        name: 'auth-store',
      }
    )
  );
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserLapangan } from '../types';

interface AuthState {
    token: string | null;
    user: UserLapangan | null;
    isAuthenticated: boolean;
    setAuth: (token: string, user: UserLapangan) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            isAuthenticated: false,
            setAuth: (token, user) =>
                set({
                    token,
                    user,
                    isAuthenticated: true,
                }),
            logout: () =>
                set({
                    token: null,
                    user: null,
                    isAuthenticated: false,
                }),
        }),
        {
            name: 'picking-lapangan-storage',
            partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
        },
    ),
);

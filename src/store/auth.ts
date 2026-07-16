import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getAuthUser, getAuth, setAuth, setAuthUser, clearAuth } from "@/lib/api";

export interface AuthUser {
  id: number;
  email: string;
  is_admin: boolean;
  is_staff: boolean;
  balance: number;
  commission_balance: number;
  transfer_enable: number;
  [k: string]: any;
}

interface AuthState {
  auth: string | null; // 完整 Authorization header 值（Bearer ...）
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuthData: (auth: string, user: AuthUser) => void;
  updateUser: (user: Partial<AuthUser>) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      auth: getAuth(),
      user: getAuthUser(),
      isAuthenticated: !!getAuth(),
      setAuthData: (auth, user) => {
        setAuth(auth);
        setAuthUser(user);
        set({ auth, user, isAuthenticated: true });
      },
      updateUser: (patch) =>
        set((s) => {
          if (!s.user) return s;
          const next = { ...s.user, ...patch };
          setAuthUser(next);
          return { user: next };
        }),
      logout: () => {
        clearAuth();
        set({ auth: null, user: null, isAuthenticated: false });
      },
      hydrate: () => {
        const auth = getAuth();
        const user = getAuthUser();
        set({ auth, user, isAuthenticated: !!auth });
      },
    }),
    { name: "fboard-admin-auth-store" }
  )
);

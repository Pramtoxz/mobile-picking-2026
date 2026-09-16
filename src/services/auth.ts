import api from "../lib/api";
import { useAuthStore } from "../store/auth";
import type { UserLapangan } from "../types";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    user: Omit<UserLapangan, "area_operator" | "adalah_admin_area">;
  };
}

export const authService = {
  async login(
    credentials: LoginRequest,
    rememberMe: boolean = true,
  ): Promise<boolean> {
    try {
      const response = await api.post("/lapangan/auth/login", {
        ...credentials,
        remember_me: rememberMe, // Send remember me flag to backend
      });

      const { data }: LoginResponse = response.data;

      if (!data || !data.token) {
        throw new Error("Login gagal - no token returned");
      }

      // Simpan auth state
      const user: UserLapangan = {
        ...data.user,
        area_operator: null, // Tidak perlu di client
        adalah_admin_area: false,
      };

      useAuthStore.getState().setAuth(data.token, user);

      return true;
    } catch (error: unknown) {
      console.error("Login error:", error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    const token = useAuthStore.getState().token;

    if (token) {
      try {
        await api.post(
          "/lapangan/logout",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } catch {
        // Ignore error, tetap logout anyway
      }
    }

    useAuthStore.getState().logout();
  },
};

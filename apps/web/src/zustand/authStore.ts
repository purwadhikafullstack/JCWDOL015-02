import { create } from "zustand";
import { persist } from "zustand/middleware";

export const authStore = (set: any) => ({
  user: {isLogin: false},
});

export const useAuthStore = create(persist(authStore, { name: "auth-store" }));

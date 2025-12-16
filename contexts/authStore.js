import { create } from "zustand";
import { saveSecure, getSecure, deleteSecure } from "../hooks/useSecureStore";
import axios from "axios";
import { BASE_URL } from "@/env.js";

export const useAuth = create((set, get) => ({
  user: null,
  token: null,

  /** Save new updated user data to store + secure storage */
  updateUser: async (userData) => {
    set({ user: userData });
    await saveSecure("user", JSON.stringify(userData));
  },

  /** Load on app start */
  loadAuth: async () => {
    const savedUser = await getSecure("user");
    const savedToken = await getSecure("token");

    if (!savedToken) return;

    try {
      const { data } = await axios.get(`${BASE_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${savedToken}` },
      });
      set({
        user: data.user,
        token: savedToken,
      });

      // Update secure user (fresh)
      await saveSecure("user", JSON.stringify(data.user));
    } catch (err) {
      console.log("loadAuth failed", err.response?.data)
    }
  },


  login: async (userData, tokenData) => {
    set({ user: userData, token: tokenData });
    await saveSecure("user", JSON.stringify(userData));
    await saveSecure("token", tokenData);
  },

  logout: async () => {
    set({ user: null, token: null });
    await deleteSecure("user");
    await deleteSecure("token");
  },
}));

import { api } from "./api.js";

export const authService = {
  async signupUser(payload) {
    const { data } = await api.post("/auth/register", payload);
    return data;
  },

  async loginUser(payload) {
    const { data } = await api.post("/auth/login", payload);
    return data;
  },

  async getProfile() {
    const { data } = await api.get("/auth/profile");
    return data;
  }
};


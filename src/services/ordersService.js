import { api } from "./api.js";

export const ordersService = {
  async createOrder(payload) {
    const { data } = await api.post("/orders", payload);
    return data;
  },

  async getOrders(params = {}) {
    const { data } = await api.get("/orders", { params });
    return data;
  }
};


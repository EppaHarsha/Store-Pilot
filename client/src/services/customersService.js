import { api } from "./api.js";

export const customersService = {
  async searchCustomers(query) {
    const { data } = await api.get("/customers", {
      params: { q: query }
    });
    return data;
  }
};


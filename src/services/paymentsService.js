import { api } from "./api.js";

export const paymentsService = {
  async getPendingPayments(params = {}) {
    const { data } = await api.get("/payments/pending", { params });
    return data;
  }
};


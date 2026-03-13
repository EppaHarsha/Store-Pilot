// import { api } from "./api.js";

const DEMO_ORDERS_KEY = "store_pilot_demo_orders";

const getStoredOrders = () => {
  try {
    const data = window.localStorage.getItem(DEMO_ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveStoredOrders = (orders) => {
  try {
    window.localStorage.setItem(DEMO_ORDERS_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error("Could not save to local storage", err);
  }
};

export const ordersService = {
  async createOrder(payload) {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const orders = getStoredOrders();
    
    const total = Number(payload.totalAmount) || 0;
    const advance = Number(payload.advancePaid) || 0;
    const balance = Math.max(total - advance, 0);

    const newOrder = {
      ...payload,
      id: "ord_" + Date.now().toString(36),
      createdAt: new Date().toISOString(),
      status: "pending",
      total,
      advance,
      balance
    };

    orders.unshift(newOrder);
    saveStoredOrders(orders);
    
    return newOrder;
  },

  async getOrders(params = {}) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return getStoredOrders();
  },

  async markAsPaid(orderId) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const orders = getStoredOrders();
    const updated = orders.map((o) =>
      o.id === orderId
        ? { ...o, balance: 0, paidAt: new Date().toISOString() }
        : o
    );
    saveStoredOrders(updated);
    return updated.find((o) => o.id === orderId);
  }
};


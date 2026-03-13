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

/**
 * Derives a list of unique customers from the mock orders in local storage.
 * Aggregates their total orders and total balance.
 */
const getMockCustomers = () => {
  const orders = getStoredOrders();
  const customersMap = new Map();

  orders.forEach(order => {
    // We group by phone number since it's the safest unique identifier in the form
    const key = order.phone || order.customerName;
    if (!key) return;

    if (!customersMap.has(key)) {
      customersMap.set(key, {
        id: "cust_" + key.replace(/\D/g, ''),
        name: order.customerName,
        phone: order.phone,
        totalOrders: 0,
        totalBusiness: 0,
        pendingAmount: 0,
        lastOrderDate: order.createdAt
      });
    }

    const customer = customersMap.get(key);
    customer.totalOrders += 1;
    customer.totalBusiness += (order.total || 0);
    customer.pendingAmount += (order.balance || 0);
    if (order.createdAt > customer.lastOrderDate) {
      customer.lastOrderDate = order.createdAt;
    }
  });

  return Array.from(customersMap.values());
};

export const customersService = {
  async searchCustomers(query) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    const customers = getMockCustomers();
    
    if (!query) return customers;
    
    const q = query.toLowerCase();
    return customers.filter(c => 
      c.name?.toLowerCase().includes(q) || 
      c.phone?.includes(q)
    );
  }
};


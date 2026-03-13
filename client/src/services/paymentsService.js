// Mock paymentsService — derives pending payments directly from localStorage orders
// (same source as ordersService — no backend API needed)

const DEMO_ORDERS_KEY = "store_pilot_demo_orders";

const getStoredOrders = () => {
  try {
    const data = window.localStorage.getItem(DEMO_ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const paymentsService = {
  async getAllPayments() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const orders = getStoredOrders();

    const payments = orders.map((o) => {
      const deliveryDate = o.deliveryDate
        ? new Date(o.deliveryDate)
          : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const daysOverdue = deliveryDate
          ? Math.max(
              0,
              Math.floor((today - deliveryDate) / (1000 * 60 * 60 * 24))
            )
          : 0;

        return {
          id: o.id,
          customerName: o.customerName,
          phone: o.phone,
          amount: o.balance,
          totalAmount: o.total,
          description: o.description,
          deliveryDate: o.deliveryDate,
          daysOverdue,
          isPaid: o.balance === 0,
        };
      });

    return payments;
  }
};

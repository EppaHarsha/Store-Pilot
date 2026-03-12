import React, { useEffect, useState } from "react";
import OrderCard from "../../components/orders/OrderCard.jsx";
import PageContainer from "../../components/ui/PageContainer.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { ordersService } from "../../services/ordersService.js";
import { useToast } from "../../components/ui/ToastProvider.jsx";

const skeletons = Array.from({ length: 3 });

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await ordersService.getOrders();
        if (isMounted) setOrders(data || []);
      } catch (error) {
        console.error(error);
        if (isMounted) showError("Could not load orders. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [showError]);

  return (
    <PageContainer title="Orders">
      <div className="space-y-3">
        {loading &&
          skeletons.map((_, idx) => (
            <Skeleton key={idx} className="h-24 w-full rounded-2xl" />
          ))}

        {!loading && orders.length === 0 && (
          <EmptyState
            title="No orders yet"
            description="New orders will appear here as you create them from the New Order screen."
          />
        )}

        {!loading &&
          orders.map((order) => <OrderCard key={order.id} order={order} />)}
      </div>
    </PageContainer>
  );
};

export default Orders;


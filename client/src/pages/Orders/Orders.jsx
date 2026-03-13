import React, { useEffect, useState } from "react";
import OrderCard from "../../components/orders/OrderCard.jsx";
import PageContainer from "../../components/ui/PageContainer.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { ordersService } from "../../services/ordersService.js";
import { useToast } from "../../components/ui/ToastProvider.jsx";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";

const skeletons = Array.from({ length: 3 });

const Orders = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await ordersService.getOrders();
        if (isMounted) {
          // Show orders that still have balance (unpaid) first, paid go to end
          setOrders(data || []);
        }
      } catch (error) {
        console.error(error);
        if (isMounted) showError(t("orders.emptyTitle"));
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [showError, t]);

  // When an order is marked paid, remove it from the list
  const handlePaid = (orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  // Show only orders with outstanding balance (paid orders are "done")
  const unpaidOrders = orders.filter((o) => (o.balance || 0) > 0);
  const paidOrders = orders.filter((o) => (o.balance || 0) === 0);

  return (
    <PageContainer title={t("orders.title")}>
      <div className="space-y-3">
        {loading &&
          skeletons.map((_, idx) => (
            <Skeleton key={idx} className="h-24 w-full rounded-2xl" />
          ))}

        {!loading && unpaidOrders.length === 0 && paidOrders.length === 0 && (
          <EmptyState
            title={t("orders.emptyTitle")}
            description={t("orders.emptyDesc")}
          />
        )}

        {/* Pending (unpaid) orders */}
        <AnimatePresence mode="popLayout">
          {!loading &&
            unpaidOrders.map((order) => (
              <OrderCard key={order.id} order={order} onPaid={handlePaid} />
            ))}
        </AnimatePresence>

        {/* Paid orders shown at bottom, collapsed/dimmed */}
        {!loading && paidOrders.length > 0 && (
          <div>
            <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              ✓ Paid
            </p>
            <AnimatePresence>
              {paidOrders.map((order) => (
                <OrderCard key={order.id} order={order} onPaid={handlePaid} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default Orders;

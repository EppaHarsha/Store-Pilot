import React, { useEffect, useMemo, useState } from "react";
import PaymentCard from "../../components/payments/PaymentCard.jsx";
import PageContainer from "../../components/ui/PageContainer.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { paymentsService } from "../../services/paymentsService.js";
import { useToast } from "../../components/ui/ToastProvider.jsx";

const Payments = () => {
  const [sortBy, setSortBy] = useState("amount");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await paymentsService.getPendingPayments();
        if (isMounted) setPayments(data || []);
      } catch (error) {
        console.error(error);
        if (isMounted) showError("Could not load pending payments.");
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [showError]);

  const sorted = useMemo(() => {
    return [...payments].sort((a, b) => {
      if (sortBy === "days") return b.daysOverdue - a.daysOverdue;
      return b.amount - a.amount;
    });
  }, [sortBy]);

  return (
    <PageContainer
      title="Payments"
      actions={
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Sort by</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 outline-none"
          >
            <option value="amount">Amount</option>
            <option value="days">Overdue days</option>
          </select>
        </div>
      }
    >
      <div className="space-y-3">
        {loading &&
          Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className="h-24 w-full rounded-2xl" />
          ))}

        {!loading && sorted.length === 0 && (
          <EmptyState
            title="No pending payments"
            description="Great! You have no pending balances. New dues will appear here automatically."
          />
        )}

        {!loading &&
          sorted.map((payment) => (
            <PaymentCard key={payment.id} payment={payment} />
          ))}
      </div>
    </PageContainer>
  );
};

export default Payments;


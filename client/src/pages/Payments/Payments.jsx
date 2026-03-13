import React, { useEffect, useMemo, useState } from "react";
import PaymentCard from "../../components/payments/PaymentCard.jsx";
import PageContainer from "../../components/ui/PageContainer.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import SearchBar from "../../components/customers/SearchBar.jsx";
import { paymentsService } from "../../services/paymentsService.js";
import { useToast } from "../../components/ui/ToastProvider.jsx";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import { useDebounce } from "../../hooks/useDebounce.js";

const Payments = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [sortBy, setSortBy] = useState("amount");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await paymentsService.getAllPayments();
        if (isMounted) setPayments(data || []);
      } catch (error) {
        console.error(error);
        if (isMounted) showError(t("payments.errorMsg"));
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [showError, t]);

  const filteredAndSorted = useMemo(() => {
    const q = debouncedQuery.toLowerCase();
    
    let filtered = payments;
    if (q) {
      filtered = payments.filter((p) =>
        p.customerName?.toLowerCase().includes(q) ||
        p.phone?.includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }
    
    return filtered.sort((a, b) => {
      if (sortBy === "days") return b.daysOverdue - a.daysOverdue;
      return b.amount - a.amount;
    });
  }, [debouncedQuery, sortBy, payments]);

  // When a payment is marked paid: update its status in the list instead of removing it
  const handlePaid = (paymentId) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId ? { ...p, isPaid: true, amount: 0, daysOverdue: 0 } : p
      )
    );
  };

  const pendingPayments = filteredAndSorted.filter((p) => !p.isPaid);
  const pastPayments = filteredAndSorted.filter((p) => p.isPaid);

  return (
    <PageContainer
      title={t("payments.title")}
      actions={
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-600">{t("payments.sortBy")}</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 shadow-sm outline-none"
          >
            <option value="amount">{t("payments.sortAmount")}</option>
            <option value="days">{t("payments.sortDays")}</option>
          </select>
        </div>
      }
    >
      <div className="mb-4">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder={t("customers.searchPlaceholder")}
        />
      </div>

      <div className="space-y-6">
        {loading &&
          Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className="h-24 w-full rounded-2xl" />
          ))}

        {!loading && pendingPayments.length === 0 && pastPayments.length === 0 && (
          <EmptyState
            title={t("payments.emptyTitle")}
            description={t("payments.emptyDesc")}
          />
        )}

        {/* Pending / Dues Section */}
        {!loading && pendingPayments.length > 0 && (
          <div>
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Pending Dues</h2>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {pendingPayments.map((payment) => (
                  <PaymentCard
                    key={payment.id}
                    payment={payment}
                    onPaid={handlePaid}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Past Payments Section */}
        {!loading && pastPayments.length > 0 && (
          <div>
            <h2 className="mb-3 text-sm font-semibold text-slate-500 border-t border-slate-100 pt-4">Past Payments</h2>
            <div className="space-y-3">
              <AnimatePresence>
                {pastPayments.map((payment) => (
                  <PaymentCard
                    key={payment.id}
                    payment={payment}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default Payments;

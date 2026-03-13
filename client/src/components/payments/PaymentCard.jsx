import React, { useState } from "react";
import { HiOutlineCurrencyRupee, HiOutlineClock, HiCheckCircle } from "react-icons/hi2";
import { motion } from "framer-motion";
import { ordersService } from "../../services/ordersService.js";
import { useToast } from "../ui/ToastProvider.jsx";
import { useTranslation } from "react-i18next";

const PaymentCard = ({ payment, onPaid }) => {
  const { t } = useTranslation();
  const { showSuccess } = useToast();
  const [paying, setPaying] = useState(false);

  const overdueClass = payment.isPaid
    ? "bg-slate-50 text-slate-500 border border-slate-200"
    : payment.daysOverdue > 15
    ? "bg-rose-50 text-rose-800 ring-1 ring-rose-200"
    : payment.daysOverdue > 0
    ? "bg-amber-50 text-amber-800 ring-1 ring-amber-200"
    : "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200";

  const handleMarkPaid = async () => {
    if (paying) return;
    setPaying(true);
    try {
      await ordersService.markAsPaid(payment.id);
      showSuccess(`${payment.customerName} — ${t("orders.fullyPaid")}`);
      setTimeout(() => {
        if (onPaid) onPaid(payment.id);
      }, 400);
    } catch (err) {
      console.error(err);
    } finally {
      setPaying(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 60, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      whileHover={{ y: -2 }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-colors hover:shadow-md ${
        payment.isPaid ? "border-slate-100 opacity-75" : "border-slate-200 hover:border-emerald-200"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: customer & overdue info */}
        <div className="flex-1 min-w-0">
          <div className={`font-bold truncate ${payment.isPaid ? 'text-slate-500' : 'text-slate-900'}`}>{payment.customerName}</div>
          {payment.description && (
            <div className="mt-0.5 text-xs text-slate-500 truncate">{payment.description}</div>
          )}
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200/50">
            <HiOutlineClock className="h-3.5 w-3.5 shrink-0" />
            <span>
              {payment.isPaid
                ? "Paid"
                : payment.daysOverdue > 0
                ? `${payment.daysOverdue} days overdue`
                : "Due soon"}
            </span>
          </div>
        </div>

        {/* Right: amount badge */}
        <div className="shrink-0 text-right">
          <div className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-sm font-bold ${overdueClass}`}>
            <HiOutlineCurrencyRupee className="h-4 w-4" />
            <span>₹{payment.isPaid ? payment.totalAmount : payment.amount}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      {!payment.isPaid && (
        <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
          <button
            onClick={handleMarkPaid}
            disabled={paying}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200/50 transition-all hover:bg-emerald-500 hover:text-white active:scale-95 disabled:opacity-50"
          >
            <HiCheckCircle className="h-4 w-4" />
            {paying ? "..." : t("orders.markPaid")}
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default PaymentCard;

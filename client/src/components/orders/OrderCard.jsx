import React, { useState } from "react";
import { HiOutlineCalendarDays, HiOutlineCurrencyRupee, HiCheckCircle } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import StatusStepper from "./StatusStepper.jsx";
import { useTranslation } from "react-i18next";
import { ordersService } from "../../services/ordersService.js";
import { useToast } from "../ui/ToastProvider.jsx";

const OrderCard = ({ order, onPaid }) => {
  const { t } = useTranslation();
  const { showSuccess } = useToast();
  const [status, setStatus] = useState(order.status || "Received");
  const [paying, setPaying] = useState(false);
  const [localBalance, setLocalBalance] = useState(order.balance || 0);

  const handleMarkPaid = async () => {
    if (paying) return;
    setPaying(true);
    try {
      await ordersService.markAsPaid(order.id);
      setLocalBalance(0);
      showSuccess(t("orders.fullyPaid"));
      // Notify the parent list to remove this card after animation
      setTimeout(() => {
        if (onPaid) onPaid(order.id);
      }, 600);
    } catch (err) {
      console.error(err);
    } finally {
      setPaying(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 60, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      whileHover={{ y: -2 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-emerald-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 text-sm font-bold text-white shadow-inner">
            {getInitials(order.customerName)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 line-clamp-1">{order.customerName}</h3>
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                #{order.id?.slice(-4) || 'ORD'}
              </span>
            </div>
            <div className="mt-0.5 text-xs text-slate-500 line-clamp-1">
              {order.description}
            </div>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-600 ring-1 ring-inset ring-rose-200/50">
            <HiOutlineCalendarDays className="h-3.5 w-3.5" />
            <span>{order.deliveryDate || t("orders.noDate")}</span>
          </div>
        </div>
      </div>

      <div className="my-5 rounded-xl bg-slate-50/50 p-3 ring-1 ring-inset ring-slate-100">
        <StatusStepper status={status} onChange={setStatus} />
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{t("orders.total")}</span>
            <span className="flex items-center gap-0.5 font-bold text-slate-700">
              <HiOutlineCurrencyRupee className="h-3.5 w-3.5 text-slate-400" />
              {order.total || 0}
            </span>
          </div>
          <div className="h-6 w-px bg-slate-200"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-500/80">{t("orders.pending")}</span>
            <span className="flex items-center gap-0.5 font-bold text-amber-600">
              <HiOutlineCurrencyRupee className="h-3.5 w-3.5 text-amber-500/80" />
              {localBalance}
            </span>
          </div>
        </div>

        {localBalance > 0 ? (
          <button
            onClick={handleMarkPaid}
            disabled={paying}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200/50 transition-all hover:bg-emerald-500 hover:text-white active:scale-95 disabled:opacity-50"
          >
            <HiCheckCircle className="h-4 w-4" />
            {paying ? "..." : t("orders.markPaid")}
          </button>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white ring-1 ring-inset ring-emerald-600/50">
            <HiCheckCircle className="h-4 w-4" />
            {t("orders.fullyPaid")}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default OrderCard;

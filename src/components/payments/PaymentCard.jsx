import React from "react";
import { HiOutlineCurrencyRupee, HiOutlineClock } from "react-icons/hi2";
import { motion } from "framer-motion";

const PaymentCard = ({ payment }) => {
  const overdueClass =
    payment.daysOverdue > 15
      ? "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/40 shadow-[0_0_25px_rgba(248,113,113,0.35)]"
      : payment.daysOverdue > 0
      ? "bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/40 shadow-[0_0_22px_rgba(251,191,36,0.3)]"
      : "bg-emerald-500/15 text-emerald-300";

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="card-soft card-hover space-y-2 p-4 text-xs"
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-sm font-semibold text-slate-50">
            {payment.customerName}
          </div>
          <div className="mt-1 inline-flex items-center gap-1 text-slate-400">
            <HiOutlineClock className="h-3.5 w-3.5" />
            <span>{payment.daysOverdue} days overdue</span>
          </div>
        </div>
        <div className="inline-flex items-center gap-1 pill-soft bg-slate-800 text-slate-100">
          <HiOutlineCurrencyRupee className="h-3 w-3" />
          <span>{payment.amount}</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <span className={`pill-soft ${overdueClass}`}>
          {payment.daysOverdue > 0 ? "Pending" : "Due soon"}
        </span>
        <div className="flex gap-2">
          <button className="pill-soft bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors">
            Mark as Paid
          </button>
          <button className="pill-soft border border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-500 hover:bg-slate-800 transition-colors">
            Send Reminder
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentCard;


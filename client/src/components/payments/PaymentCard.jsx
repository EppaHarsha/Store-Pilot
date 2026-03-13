import React from "react";
import { HiOutlineCurrencyRupee, HiOutlineClock } from "react-icons/hi2";
import { motion } from "framer-motion";

const PaymentCard = ({ payment }) => {
  const overdueClass =
    payment.daysOverdue > 15
      ? "bg-rose-50 text-rose-800 ring-1 ring-rose-200"
      : payment.daysOverdue > 0
      ? "bg-amber-50 text-amber-800 ring-1 ring-amber-200"
      : "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200";

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="card-soft card-hover space-y-2 p-4 text-xs"
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-sm font-semibold text-slate-900">
            {payment.customerName}
          </div>
          <div className="mt-1 inline-flex items-center gap-1 text-slate-600">
            <HiOutlineClock className="h-3.5 w-3.5" />
            <span>{payment.daysOverdue} days overdue</span>
          </div>
        </div>
        <div className="inline-flex items-center gap-1 pill-soft bg-slate-100 text-slate-900 ring-1 ring-slate-200">
          <HiOutlineCurrencyRupee className="h-3 w-3" />
          <span>{payment.amount}</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <span className={`pill-soft ${overdueClass}`}>
          {payment.daysOverdue > 0 ? "Pending" : "Due soon"}
        </span>
        <div className="flex gap-2">
          <button className="pill-soft bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
            Mark as Paid
          </button>
          <button className="pill-soft border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors">
            Send Reminder
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentCard;


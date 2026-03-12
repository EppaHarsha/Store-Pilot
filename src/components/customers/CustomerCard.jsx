import React from "react";
import { HiOutlinePhone, HiOutlineCurrencyRupee } from "react-icons/hi2";
import { motion } from "framer-motion";

const CustomerCard = ({ customer }) => {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="card-soft card-hover space-y-2 p-4 text-xs"
    >
      <div>
        <div className="text-sm font-semibold text-slate-50">
          {customer.name}
        </div>
        <div className="mt-0.5 inline-flex items-center gap-1 text-slate-400">
          <HiOutlinePhone className="h-3.5 w-3.5" />
          <span>{customer.phone}</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="pill-soft bg-slate-800 text-slate-200">
          {customer.totalOrders} orders
        </span>
        <span className="inline-flex items-center gap-1 pill-soft bg-emerald-500/10 text-emerald-300">
          <HiOutlineCurrencyRupee className="h-3 w-3" />
          <span>Total {customer.totalBusiness}</span>
        </span>
        <span className="inline-flex items-center gap-1 pill-soft bg-amber-500/10 text-amber-300">
          <HiOutlineCurrencyRupee className="h-3 w-3" />
          <span>Pending {customer.pendingAmount}</span>
        </span>
      </div>
    </motion.div>
  );
};

export default CustomerCard;


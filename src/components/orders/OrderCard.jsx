import React, { useState } from "react";
import { HiOutlineCalendarDays, HiOutlineCurrencyRupee } from "react-icons/hi2";
import { motion } from "framer-motion";
import StatusStepper from "./StatusStepper.jsx";

const OrderCard = ({ order }) => {
  const [status, setStatus] = useState(order.status);

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="card-soft card-hover space-y-3 p-4"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-semibold text-slate-50">
            {order.customerName}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            {order.description}
          </div>
        </div>
        <div className="text-right text-xs text-slate-400">
          <div className="inline-flex items-center gap-1">
            <HiOutlineCalendarDays className="h-3.5 w-3.5" />
            <span>{order.deliveryDate}</span>
          </div>
        </div>
      </div>

      <StatusStepper status={status} onChange={setStatus} />

      <div className="flex items-center justify-between pt-1 text-xs">
        <div className="flex items-center gap-1 text-slate-400">
          <HiOutlineCurrencyRupee className="h-3.5 w-3.5" />
          <span>Total {order.total}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="pill-soft bg-amber-500/15 text-amber-300">
            Balance ₹{order.balance}
          </span>
          <button className="pill-soft bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors">
            Mark Paid
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderCard;


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
          <div className="text-sm font-semibold text-slate-900">
            {order.customerName}
          </div>
          <div className="mt-1 text-xs text-slate-600">
            {order.description}
          </div>
        </div>
        <div className="text-right text-xs text-slate-600">
          <div className="inline-flex items-center gap-1">
            <HiOutlineCalendarDays className="h-3.5 w-3.5" />
            <span>{order.deliveryDate}</span>
          </div>
        </div>
      </div>

      <StatusStepper status={status} onChange={setStatus} />

      <div className="flex items-center justify-between pt-1 text-xs">
        <div className="flex items-center gap-1 text-slate-600">
          <HiOutlineCurrencyRupee className="h-3.5 w-3.5" />
          <span>Total {order.total}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="pill-soft bg-amber-50 text-amber-800 ring-1 ring-amber-200">
            Balance ₹{order.balance}
          </span>
          <button className="pill-soft bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
            Mark Paid
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderCard;


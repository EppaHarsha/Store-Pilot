import React from "react";
import { motion } from "framer-motion";
import { Inbox } from "lucide-react";

const EmptyState = ({ title, description, action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center shadow-sm"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
        <Inbox className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-xs text-xs text-slate-600">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
};

export default EmptyState;


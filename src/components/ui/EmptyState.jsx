import React from "react";
import { motion } from "framer-motion";
import { Inbox } from "lucide-react";

const EmptyState = ({ title, description, action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800/70 bg-slate-900/60 px-6 py-10 text-center"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800/80 text-slate-200">
        <Inbox className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-50">{title}</h3>
      <p className="mt-1 max-w-xs text-xs text-slate-400">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
};

export default EmptyState;


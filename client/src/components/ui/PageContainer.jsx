import React from "react";
import { motion } from "framer-motion";

const PageContainer = ({ title, children, actions }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between gap-2">
        {title && (
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            {title}
          </h1>
        )}
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </motion.div>
  );
};

export default PageContainer;


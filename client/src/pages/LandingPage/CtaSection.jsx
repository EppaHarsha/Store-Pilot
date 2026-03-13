import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CtaSection = () => {
  return (
    <section className="bg-slate-50 pb-12 pt-10">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex flex-col items-center rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm md:px-10"
        >
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Ready to pilot your store?
          </h2>
          <p className="mt-2 max-w-md text-sm text-slate-600">
            Create your first order in minutes and see your entire shop organized in a
            single dashboard.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
            >
              Get started now
            </Link>
            <span className="text-xs text-slate-500">No credit card. No setup calls.</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;


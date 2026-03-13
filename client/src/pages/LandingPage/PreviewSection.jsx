import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PreviewSection = () => {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="space-y-3"
          >
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              A clean dashboard for real work.
            </h2>
            <p className="text-sm text-slate-600">
              Get an instant view of orders, customers, and dues as soon as you log in.
              No clutter, no noise — just the numbers that matter every day.
            </p>
            <p className="text-xs text-slate-500">
              The interface you see below is exactly what you&apos;ll use after logging in.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
            >
              Go to login
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-slate-100 via-emerald-50 to-transparent" />
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
              <div className="border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-600">
                Dashboard preview
              </div>
              <div className="space-y-3 p-4 text-[11px]">
                <div className="grid gap-2 md:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-[10px] uppercase tracking-wide text-slate-500">
                      Today&apos;s Orders
                    </div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">12</div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      Most from repeat customers.
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-[10px] uppercase tracking-wide text-slate-500">
                      Pending Payments
                    </div>
                    <div className="mt-1 text-lg font-semibold text-amber-700">₹7,500</div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      Highlighted so you never miss a follow-up.
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-[10px] uppercase tracking-wide text-slate-500">
                      Overdue Orders
                    </div>
                    <div className="mt-1 text-lg font-semibold text-rose-600">3</div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      Sorted by urgency, ready to act on.
                    </div>
                  </div>
                </div>
                <div className="mt-1 rounded-2xl border border-slate-200 bg-white p-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Recent activity</span>
                    <span>Live inside Store Pilot</span>
                  </div>
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-2 py-1.5">
                      <span className="text-slate-700">New order • Ramesh</span>
                      <span className="text-slate-500">2 min ago</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-2 py-1.5">
                      <span className="text-slate-700">Payment received • Anita</span>
                      <span className="text-slate-500">14 min ago</span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-2 py-1.5">
                      <span className="text-slate-700">Overdue reminder sent</span>
                      <span className="text-slate-500">1 hr ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PreviewSection;


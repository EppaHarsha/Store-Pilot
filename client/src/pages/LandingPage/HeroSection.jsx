import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-x-0 top-[-120px] -z-10 transform-gpu">
        <div className="mx-auto h-64 max-w-5xl rounded-full bg-gradient-to-r from-emerald-100 via-sky-100 to-indigo-100 blur-3xl" />
      </div>
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-8 px-4 pb-20 pt-24 md:flex-row md:items-center md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 max-w-xl space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 shadow-sm"
          >
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Built for busy shop owners</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45 }}
            className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl"
          >
            Run your{" "}
            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
              store on autopilot
            </span>
            .
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.45 }}
            className="max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base"
          >
            Store Pilot keeps orders, customers, and payments organized in one
            clean dashboard — so you can focus on serving customers, not
            managing notebooks and WhatsApp chats.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.4 }}
            className="flex flex-wrap items-center gap-3"
          >
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            >
              Login
            </Link>
            <span className="text-xs text-slate-500">
              No setup required. Start in under 2 minutes.
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          className="relative mt-4 w-full max-w-md md:mt-0"
        >
          <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-emerald-100 via-sky-100 to-transparent opacity-80" />
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="text-xs font-medium text-slate-700">
                  Today&apos;s store snapshot
                </span>
              </div>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                Live preview
              </span>
            </div>
            <div className="space-y-3 p-4">
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-[10px] uppercase tracking-wide text-slate-500">
                    Today&apos;s orders
                  </div>
                  <div className="mt-1 text-xl font-semibold text-slate-900">
                    12
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-[10px] uppercase tracking-wide text-slate-500">
                    Pending payments
                  </div>
                  <div className="mt-1 text-xl font-semibold text-slate-900">
                    7
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="text-[10px] uppercase tracking-wide text-slate-500">
                    Overdue
                  </div>
                  <div className="mt-1 text-xl font-semibold text-rose-600">
                    3
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-600">
                &ldquo;Store Pilot replaced my diary, calculator, and three
                WhatsApp groups. Now I can tell what I&apos;m owed in seconds.&rdquo;
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;


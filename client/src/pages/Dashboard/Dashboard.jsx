import React from "react";
import { HiOutlineClipboardDocumentList, HiOutlineCurrencyRupee, HiOutlineExclamationTriangle } from "react-icons/hi2";
import { motion } from "framer-motion";

const StatCard = ({ label, value, icon: Icon, accent }) => {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="card-soft card-hover flex min-w-[10rem] flex-1 items-center justify-between px-4 py-4"
    >
      <div>
        <div className="text-[11px] uppercase tracking-wide text-slate-500">
          {label}
        </div>
        <div className="mt-2 text-3xl font-semibold leading-tight text-slate-900">
          {value}
        </div>
      </div>
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-2xl text-slate-900 ${accent}`}
      >
        <Icon className="h-5 w-5" />
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  // simple demo values – later can be wired to API
  const todaysOrders = 12;
  const pendingPayments = 7;
  const overdueOrders = 3;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
      <div className="grid gap-3 md:grid-cols-3">
        <StatCard
          label="Today's Orders"
          value={todaysOrders}
          icon={HiOutlineClipboardDocumentList}
          accent="bg-emerald-100"
        />
        <StatCard
          label="Pending Payments"
          value={pendingPayments}
          icon={HiOutlineCurrencyRupee}
          accent="bg-amber-100"
        />
        <StatCard
          label="Overdue Orders"
          value={overdueOrders}
          icon={HiOutlineExclamationTriangle}
          accent="bg-rose-100"
        />
      </div>
    </div>
  );
};

export default Dashboard;


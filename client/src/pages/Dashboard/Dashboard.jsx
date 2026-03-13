import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineClipboardDocumentList, HiOutlineCurrencyRupee, HiOutlineExclamationTriangle } from "react-icons/hi2";
import { motion } from "framer-motion";
import { authService } from "../../services/authService.js";
import { useAuth } from "../../context/AuthContext.jsx";

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
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);

  const todaysOrders = 12;
  const pendingPayments = 7;
  const overdueOrders = 3;

  useEffect(() => {
    let isMounted = true;
    authService
      .getProfile()
      .then((data) => {
        if (!isMounted) return;
        setProfile(data?.user ?? null);
      })
      .catch((err) => {
        if (!isMounted) return;
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load profile.";
        setError(message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          {profile?.name || user?.name ? `Welcome, ${profile?.name || user?.name}` : "Dashboard"}
        </h1>
        <p className="text-xs text-slate-500">
          {profile?.shopName ? `Shop: ${profile.shopName}` : null}
        </p>
      </div>

      {loading && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
          Loading your dashboard...
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          to="/new-order"
          className="card-soft card-hover flex flex-col items-start justify-between px-4 py-4"
        >
          <div className="text-xs font-medium text-slate-700">+ New Order</div>
          <p className="mt-1 text-[11px] text-slate-500">Create a quick order for a customer.</p>
        </Link>
        <Link
          to="/orders"
          className="card-soft card-hover flex flex-col items-start justify-between px-4 py-4"
        >
          <div className="text-xs font-medium text-slate-700">Orders</div>
          <p className="mt-1 text-[11px] text-slate-500">See today&apos;s and upcoming orders.</p>
        </Link>
        <Link
          to="/customers"
          className="card-soft card-hover flex flex-col items-start justify-between px-4 py-4"
        >
          <div className="text-xs font-medium text-slate-700">Customers</div>
          <p className="mt-1 text-[11px] text-slate-500">View and search your regulars.</p>
        </Link>
        <Link
          to="/payments"
          className="card-soft card-hover flex flex-col items-start justify-between px-4 py-4"
        >
          <div className="text-xs font-medium text-slate-700">Payments</div>
          <p className="mt-1 text-[11px] text-slate-500">Track advances and balances.</p>
        </Link>
      </div>
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


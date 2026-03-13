import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  HiOutlineShoppingCart,
  HiOutlineCreditCard,
  HiOutlineExclamationTriangle,
  HiOutlineCurrencyRupee,
  HiOutlineArrowDownTray,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ordersService } from "../../services/ordersService.js";
import { useTranslation } from "react-i18next";

/* ─────────────────────────────────────────
   Helper: format time as "02:45 PM"
───────────────────────────────────────── */
const formatTime = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};

/* ─────────────────────────────────────────
   Helper: get initials from name
───────────────────────────────────────── */
const getInitials = (name = "") => {
  const parts = name.trim().split(" ");
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "?";
};

/* ─────────────────────────────────────────
   Helper: build last-N-days revenue data
───────────────────────────────────────── */
const buildRevenueData = (orders, days = 7) => {
  const map = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" });
    map[key] = { date: label, revenue: 0 };
  }
  orders.forEach((o) => {
    const key = o.createdAt?.split("T")[0];
    if (map[key] !== undefined) {
      map[key].revenue += Number(o.total) || 0;
    }
  });
  return Object.values(map);
};

/* ─────────────────────────────────────────
   StatCard component
───────────────────────────────────────── */
const StatCard = ({ label, value, icon: Icon, iconBg, prefix = "" }) => (
  <motion.div
    whileHover={{ y: -3 }}
    transition={{ type: "spring", stiffness: 300, damping: 24 }}
    className="flex flex-1 flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm min-w-0"
  >
    <div className="flex items-start justify-between gap-3">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">{label}</p>
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
      {prefix}{value}
    </p>
  </motion.div>
);

/* ─────────────────────────────────────────
   Custom Tooltip for chart
───────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-lg text-sm">
        <p className="font-semibold text-slate-700">{label}</p>
        <p className="text-indigo-600 font-bold">₹{payload[0].value.toLocaleString("en-IN")}</p>
      </div>
    );
  }
  return null;
};

/* ─────────────────────────────────────────
   AI Insight messages (rotates)
───────────────────────────────────────── */
const AI_INSIGHTS = [
  "Demand for <b>shirt stitching</b> is expected to increase by 40% this weekend based on upcoming local festivals. Consider preparing extra stock and staff.",
  "You have <b>3 pending payments</b> due this week. Send reminders to customers to improve cash flow.",
  "Your busiest day this week was <b>Wednesday</b>. Consider scheduling more work on similar days.",
  "<b>New orders</b> are coming in faster today. Make sure deliveries are on track to avoid overdue orders.",
];

/* ─────────────────────────────────────────
   Main Dashboard
───────────────────────────────────────── */
const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [chartDays, setChartDays] = useState(7);
  const [insightIndex] = useState(() => Math.floor(Math.random() * AI_INSIGHTS.length));

  // Load and auto-refresh every 10 s so chart stays real-time
  const loadOrders = useCallback(async () => {
    try {
      const data = await ordersService.getOrders();
      setOrders(data || []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 10_000);
    return () => clearInterval(interval);
  }, [loadOrders]);

  /* ── Derived stats ── */
  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    let todaysRevenue = 0;
    let todaysOrders = 0;
    let pendingPayments = 0;
    let overdueOrders = 0;

    orders.forEach((o) => {
      const isToday = o.createdAt?.startsWith(today);
      if (isToday) {
        todaysOrders++;
        todaysRevenue += Number(o.total) || 0;
      }
      if ((o.balance || 0) > 0) pendingPayments += Number(o.balance);
      if (o.deliveryDate && o.deliveryDate < today && (o.balance || 0) > 0) overdueOrders++;
    });

    return { todaysRevenue, todaysOrders, pendingPayments, overdueOrders };
  }, [orders]);

  /* ── Revenue chart data ── */
  const revenueData = useMemo(() => buildRevenueData(orders, chartDays), [orders, chartDays]);

  /* ── Recent activity (latest 5 orders) ── */
  const recentActivity = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
    [orders]
  );

  return (
    <div className="space-y-6 pb-8">

      {/* ── Page Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {t("dashboard.title", "Dashboard overview")}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const data = orders.map(o => `${o.customerName},${o.description},₹${o.total},₹${o.balance}`).join("\n");
              const blob = new Blob([`Customer,Description,Total,Balance\n${data}`], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = "report.csv"; a.click();
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
          >
            <HiOutlineArrowDownTray className="h-4 w-4" />
            Download Report
          </button>
          <button
            onClick={() => navigate("/new-order")}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-indigo-500/25 transition-all hover:bg-indigo-700 active:scale-95"
          >
            + New Order
          </button>
        </div>
      </div>

      {/* ── AI Insight Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
          <HiOutlineSparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">AI Business Insight</p>
          <p
            className="mt-1 text-sm text-slate-700"
            dangerouslySetInnerHTML={{ __html: AI_INSIGHTS[insightIndex] }}
          />
        </div>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Today's Revenue"
          value={`₹${stats.todaysRevenue.toLocaleString("en-IN")}`}
          icon={HiOutlineCurrencyRupee}
          iconBg="bg-violet-100 text-violet-600"
        />
        <StatCard
          label={t("dashboard.todaysOrders")}
          value={stats.todaysOrders}
          icon={HiOutlineShoppingCart}
          iconBg="bg-sky-100 text-sky-600"
        />
        <StatCard
          label={t("dashboard.pendingPayments")}
          value={`₹${stats.pendingPayments.toLocaleString("en-IN")}`}
          icon={HiOutlineCreditCard}
          iconBg="bg-orange-100 text-orange-500"
        />
        <StatCard
          label={t("dashboard.overdueOrders")}
          value={stats.overdueOrders}
          icon={HiOutlineExclamationTriangle}
          iconBg="bg-rose-100 text-rose-500"
        />
      </div>

      {/* ── Chart + Recent Activity ── */}
      <div className="grid gap-4 lg:grid-cols-5">

        {/* Revenue Chart */}
        <div className="lg:col-span-3 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-2">
            <h2 className="font-bold text-slate-900">Revenue Overview</h2>
            <select
              value={chartDays}
              onChange={(e) => setChartDays(Number(e.target.value))}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm outline-none"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
            </select>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v === 0 ? "₹0" : `₹${(v / 1000).toFixed(v >= 1000 ? 1 : 0)}k`}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#revenueGrad)"
                dot={false}
                activeDot={{ r: 5, fill: "#6366f1", stroke: "white", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Recent Activity</h2>
            <button
              onClick={() => navigate("/orders")}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View all
            </button>
          </div>

          {recentActivity.length === 0 ? (
            <p className="text-center text-xs text-slate-400 mt-8">No recent activity yet.</p>
          ) : (
            <ul className="space-y-4">
              {recentActivity.map((o) => (
                <li key={o.id} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                    {getInitials(o.customerName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm">
                      <span className="font-semibold text-slate-900">{o.customerName}</span>
                      <span className="text-slate-500"> placed a new order</span>
                    </p>
                    <p className="text-[11px] text-slate-400">{formatTime(o.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

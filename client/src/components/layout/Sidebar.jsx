import React, { useMemo } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  Users,
  IndianRupee,
  PlusCircle,
  LogOut,
  Store
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher.jsx";

const Sidebar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const navItems = useMemo(
    () => [
      { to: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
      { to: "/orders", labelKey: "nav.orders", icon: Receipt },
      { to: "/customers", labelKey: "nav.customers", icon: Users },
      { to: "/payments", labelKey: "nav.payments", icon: IndianRupee },
      { to: "/new-order", labelKey: "nav.newOrder", icon: PlusCircle }
    ],
    []
  );

  const handleLogout = () => {
    logout();
    navigate("/dashboard", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    [
      "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
      isActive
        ? "bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-100"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    ].join(" ");

  const initials = useMemo(() => {
    if (!user?.name) return "SP";
    const parts = user.name.trim().split(" ");
    return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
  }, [user]);

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white md:flex">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white shadow-sm shadow-emerald-500/20">
          <Store className="h-4 w-4" />
        </div>
        <div className="leading-tight">
          <div className="font-bold tracking-tight text-slate-900">Store Pilot</div>
          <div className="text-[10px] uppercase tracking-wider text-slate-500">{t("store pilot app")}</div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin">
        <div className="space-y-1">
          {navItems.map(({ to, labelKey, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClass}>
              {({ isActive }) => (
                <>
                  <Icon className={`h-5 w-5 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                  <span>{t(labelKey)}</span>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 h-8 w-1 rounded-r-full bg-emerald-500"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Language Switcher */}
      <div className="px-4 pb-3">
        <LanguageSwitcher />
      </div>

      {/* User Profile Footer */}
      {isAuthenticated && (
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200/50">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xs font-semibold text-white shadow-inner">
              {initials}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="truncate text-sm font-semibold text-slate-900">
                {user.name || "Shop Owner"}
              </div>
              <div className="truncate text-xs text-slate-500">
                {user.role || "Admin"}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="group rounded-xl p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
              title={t("nav.logout")}
            >
              <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;

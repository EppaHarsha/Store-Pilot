import React, { useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  Users,
  IndianRupee,
  PlusCircle,
  Menu,
  X
} from "lucide-react";
import { HiOutlineMagnifyingGlass, HiOutlineBell } from "react-icons/hi2";
import { useAuth } from "../../context/AuthContext.jsx";

const TopNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = useMemo(
    () => [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/orders", label: "Orders", icon: Receipt },
      { to: "/customers", label: "Customers", icon: Users },
      { to: "/payments", label: "Payments", icon: IndianRupee },
      { to: "/new-order", label: "New Order", icon: PlusCircle }
    ],
    []
  );

  // Close the mobile menu when route changes
  React.useEffect(() => {
    setMobileOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const linkClass = ({ isActive }) =>
    [
      "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
      isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
    ].join(" ");

  const initials = React.useMemo(() => {
    if (!user?.name) return "SP";
    const parts = user.name.trim().split(" ");
    const first = parts[0]?.[0] ?? "";
    const second = parts[1]?.[0] ?? "";
    return (first + second).toUpperCase() || "SP";
  }, [user?.name]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
            SP
          </div>
          <div className="hidden leading-tight sm:block">
            <div className="text-sm font-semibold text-slate-900">Store Pilot</div>
            <div className="text-xs text-slate-500">Vyapari AI</div>
          </div>
        </div>

        <nav className="ml-2 hidden items-center gap-1 md:flex">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkClass}>
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex flex-1 items-center justify-end gap-2">
          <div className="hidden flex-1 md:block">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
              <HiOutlineMagnifyingGlass className="h-4 w-4 text-slate-400" />
              <input
                className="h-6 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder="Search orders, customers, payments..."
              />
            </div>
          </div>

          <button className="relative hidden h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 md:flex">
            <HiOutlineBell className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </button>

          {isAuthenticated && (
            <div className="hidden items-center gap-3 md:flex">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 shadow-sm">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-semibold text-white">
                  {initials}
                </div>
                <div className="text-xs leading-tight">
                  <div className="font-medium text-slate-900">
                    {user?.name ?? "Shop Owner"}
                  </div>
                  <div className="text-[10px] text-emerald-600">
                    {user?.role ?? "Shop Owner"}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Logout
              </button>
            </div>
          )}

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto max-w-6xl space-y-2 px-4 py-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
              <HiOutlineMagnifyingGlass className="h-4 w-4 text-slate-400" />
              <input
                className="h-6 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                placeholder="Search orders, customers, payments..."
              />
            </div>

            <nav className="grid gap-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} className={linkClass}>
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopNav;


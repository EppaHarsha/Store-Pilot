import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Receipt, Users, IndianRupee, PlusCircle } from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/orders", label: "Orders", icon: Receipt },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/payments", label: "Payments", icon: IndianRupee },
  { to: "/new-order", label: "New Order", icon: PlusCircle }
];

const Sidebar = () => {
  return (
    <aside className="pointer-events-auto sticky top-0 hidden h-screen w-64 shrink-0 bg-transparent p-4 md:block">
      <div className="flex h-full flex-col rounded-3xl bg-slate-950/80 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.9)] ring-1 ring-slate-800/70 backdrop-blur">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-soft to-emerald-500 text-slate-950 font-bold">
          SP
        </div>
        <div>
          <div className="text-sm font-semibold tracking-wide">
            Store Pilot
          </div>
          <div className="text-xs text-slate-400">Vyapari AI</div>
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all",
                "hover:bg-slate-800/70 hover:text-slate-50",
                isActive
                  ? "bg-slate-100 text-slate-950 shadow-sm"
                  : "text-slate-300"
              ].join(" ")
            }
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-4 text-xs text-slate-500">
        Made for busy shop owners.
      </div>
      </div>
    </aside>
  );
};

export default Sidebar;


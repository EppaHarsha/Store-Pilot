import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Receipt, Users, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const MobileNav = () => {
  const { t } = useTranslation();

  const navItems = [
    { to: "/dashboard", labelKey: "nav.home", icon: LayoutDashboard },
    { to: "/orders", labelKey: "nav.orders", icon: Receipt },
    { to: "/new-order", labelKey: "nav.add", icon: PlusCircle, isPrimary: true },
    { to: "/customers", labelKey: "nav.clients", icon: Users },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/90 pb-safe pt-2 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-around px-2 pb-2">
        {navItems.map(({ to, labelKey, icon: Icon, isPrimary }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group relative flex flex-col items-center justify-center gap-1 p-2 ${
                isActive ? "text-emerald-600" : "text-slate-500"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isPrimary ? (
                  <div className="absolute -top-6 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 ring-4 ring-white transition-transform active:scale-95">
                    <Icon className="h-6 w-6" />
                  </div>
                ) : (
                  <Icon className={`h-6 w-6 transition-colors ${isActive ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                )}
                
                <span className={`text-[10px] font-medium transition-colors ${isPrimary ? "mt-5" : ""} ${isActive ? "text-emerald-700 font-semibold" : ""}`}>
                  {t(labelKey)}
                </span>

                {isActive && !isPrimary && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute -top-2 h-1 w-8 rounded-b-full bg-emerald-500"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;

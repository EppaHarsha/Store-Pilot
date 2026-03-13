import React from "react";
import { HiOutlinePhone, HiOutlineCurrencyRupee, HiOutlineShoppingBag } from "react-icons/hi2";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const CustomerCard = ({ customer }) => {
  const { t } = useTranslation();

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-lg font-bold text-white shadow-inner">
            {getInitials(customer.name)}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 line-clamp-1">{customer.name}</h3>
            <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-500">
              <HiOutlinePhone className="h-4 w-4" />
              <span>{customer.phone || t("customers.noPhone")}</span>
            </div>
          </div>
        </div>
        
        <a 
          href={`tel:${customer.phone}`}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 opacity-0 transition-all hover:bg-emerald-50 hover:text-emerald-600 group-hover:opacity-100 sm:opacity-100"
          title={t("customers.callCustomer")}
          onClick={(e) => {
            if (!customer.phone) e.preventDefault();
          }}
        >
          <HiOutlinePhone className="h-4 w-4" />
        </a>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
        <div className="flex flex-col rounded-xl bg-slate-50 p-2 text-center ring-1 ring-inset ring-slate-200/50">
          <span className="mb-0.5 flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            <HiOutlineShoppingBag className="h-3 w-3" /> {t("customers.orders")}
          </span>
          <span className="font-bold text-slate-700">{customer.totalOrders}</span>
        </div>
        <div className="flex flex-col rounded-xl bg-emerald-50/50 p-2 text-center ring-1 ring-inset ring-emerald-100/50">
          <span className="mb-0.5 flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-600/70">
            <HiOutlineCurrencyRupee className="h-3 w-3" /> {t("customers.spent")}
          </span>
          <span className="font-bold text-emerald-700">₹{customer.totalBusiness}</span>
        </div>
        <div className="flex flex-col rounded-xl bg-amber-50/50 p-2 text-center ring-1 ring-inset ring-amber-100/50">
          <span className="mb-0.5 flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-amber-600/70">
            <HiOutlineCurrencyRupee className="h-3 w-3" /> {t("customers.pendingLabel")}
          </span>
          <span className="font-bold text-amber-700">₹{customer.pendingAmount}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerCard;

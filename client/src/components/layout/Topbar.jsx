import React from "react";
import { HiOutlineMagnifyingGlass, HiOutlineBell } from "react-icons/hi2";

const Topbar = () => {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
        <div className="flex flex-1 items-center gap-2 rounded-2xl bg-slate-900 px-3 py-2 text-sm text-slate-300">
          <HiOutlineMagnifyingGlass className="h-4 w-4 text-slate-400" />
          <input
            className="h-6 w-full bg-transparent text-xs outline-none placeholder:text-slate-500 md:text-sm"
            placeholder="Search orders, customers, payments..."
          />
        </div>

        <button className="relative hidden h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 md:flex">
          <HiOutlineBell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 inline-flex h-3 w-3 rounded-full bg-emerald-400" />
        </button>

        <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-2 py-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-slate-950">
            SK
          </div>
          <div className="hidden text-xs leading-tight md:block">
            <div className="font-medium text-slate-100">Shop Owner</div>
            <div className="text-[10px] text-emerald-400">
              Online • Fast entry
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;


import React from "react";

const FooterSection = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-5">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 text-xs text-slate-500 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900 text-[11px] font-semibold text-white">
            SP
          </div>
          <span>© {new Date().getFullYear()} Store Pilot</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="text-xs text-slate-500 hover:text-slate-700">
            Privacy
          </button>
          <button type="button" className="text-xs text-slate-500 hover:text-slate-700">
            Terms
          </button>
          <button type="button" className="text-xs text-slate-500 hover:text-slate-700">
            Support
          </button>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;


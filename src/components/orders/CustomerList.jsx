import React from "react";

const CustomerList = ({ customers, selectedId, onSelect }) => {
  return (
    <div className="h-full overflow-y-auto rounded-2xl bg-slate-900 p-2 scrollbar-thin">
      {customers.map((c) => {
        const isActive = c.id === selectedId;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c.id)}
            className={[
              "flex w-full items-center justify-between gap-2 rounded-xl px-2 py-2 text-left text-xs",
              isActive
                ? "bg-slate-800 text-slate-50"
                : "text-slate-300 hover:bg-slate-800/60"
            ].join(" ")}
          >
            <div>
              <div className="text-sm font-medium">{c.name}</div>
              <div className="mt-0.5 text-[11px] text-slate-400">
                Last: {c.lastUpdate}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] text-slate-400">{c.time}</span>
              {c.unread > 0 && (
                <span className="inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-emerald-500 text-[10px] font-semibold text-slate-950">
                  {c.unread}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default CustomerList;


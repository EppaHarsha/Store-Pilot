import React from "react";

const badgeColor = (status) => {
  if (/advance/i.test(status)) return "bg-amber-500/15 text-amber-300";
  if (/ready/i.test(status)) return "bg-emerald-500/15 text-emerald-300";
  if (/created/i.test(status)) return "bg-sky-500/15 text-sky-300";
  return "bg-slate-700/60 text-slate-200";
};

const OrderMessage = ({ message, isRight }) => {
  return (
    <div
      className={[
        "mb-2 flex w-full",
        isRight ? "justify-end" : "justify-start"
      ].join(" ")}
    >
      <div
        className={[
          "max-w-[80%] rounded-2xl px-3 py-2 text-xs",
          isRight ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-50"
        ].join(" ")}
      >
        <div className="flex items-center gap-2">
          <span
            className={[
              "rounded-full px-2 py-0.5 text-[10px] font-medium",
              badgeColor(message.text)
            ].join(" ")}
          >
            {message.text}
          </span>
        </div>
        <div
          className={[
            "mt-1 text-[10px]",
            isRight ? "text-emerald-900/80" : "text-slate-400"
          ].join(" ")}
        >
          {message.time}
        </div>
      </div>
    </div>
  );
};

export default OrderMessage;


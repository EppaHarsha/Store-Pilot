import React from "react";

const steps = ["Received", "In Progress", "Ready", "Delivered"];

const StatusStepper = ({ status, onChange }) => {
  const currentIndex = steps.indexOf(status);

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      {steps.map((step, index) => {
        const isCompleted = index <= currentIndex;
        return (
          <button
            key={step}
            type="button"
            onClick={() => onChange(step)}
            className={[
              "flex items-center gap-1 rounded-full px-2.5 py-1 border",
              isCompleted
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                : "border-slate-700 bg-slate-900 text-slate-400"
            ].join(" ")}
          >
            <span
              className={[
                "h-1.5 w-1.5 rounded-full",
                isCompleted ? "bg-emerald-400" : "bg-slate-500"
              ].join(" ")}
            />
            <span>{step}</span>
          </button>
        );
      })}
    </div>
  );
};

export default StatusStepper;


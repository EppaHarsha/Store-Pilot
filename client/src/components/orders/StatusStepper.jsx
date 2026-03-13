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
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-slate-200 bg-white text-slate-600"
            ].join(" ")}
          >
            <span
              className={[
                "h-1.5 w-1.5 rounded-full",
                isCompleted ? "bg-emerald-600" : "bg-slate-400"
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


import React from "react";
import OrderMessage from "./OrderMessage.jsx";

const OrderThread = ({ order }) => {
  if (!order) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-500">
        Select a customer to view order updates.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-2xl bg-slate-900">
      <div className="border-b border-slate-800 px-4 py-2.5">
        <div className="text-sm font-semibold text-slate-50">
          {order.customerName}
        </div>
        <div className="text-[11px] text-slate-400">{order.orderTitle}</div>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto px-3 py-3 scrollbar-thin">
        {order.messages.map((m) => (
          <OrderMessage
            key={m.id}
            message={m}
            isRight={m.sender === "shop"}
          />
        ))}
      </div>
    </div>
  );
};

export default OrderThread;


import React, { useMemo, useState } from "react";
import { HiOutlineCalendarDays, HiOutlineCurrencyRupee, HiOutlineUser } from "react-icons/hi2";
import VoiceButton from "../../components/shared/VoiceButton.jsx";
import PhotoUpload from "../../components/shared/PhotoUpload.jsx";

const NewOrder = () => {
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    description: "",
    deliveryDate: "",
    totalAmount: "",
    advancePaid: ""
  });

  const [photo, setPhoto] = useState(null);

  const balance = useMemo(() => {
    const total = parseFloat(form.totalAmount) || 0;
    const advance = parseFloat(form.advancePaid) || 0;
    return Math.max(total - advance, 0);
  }, [form.totalAmount, form.advancePaid]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // basic validation
    if (!form.customerName || !form.phone || !form.description) {
      alert("Please fill customer name, phone and order description.");
      return;
    }
    // TODO: send to backend
    alert("Order saved (demo).");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-50">New Order</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl bg-slate-900 p-4 shadow-sm"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300">Customer Name</label>
            <div className="flex items-center gap-2 rounded-2xl bg-slate-950 px-3 py-2">
              <HiOutlineUser className="h-4 w-4 text-slate-400" />
              <input
                className="h-8 w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
                placeholder="Ramesh"
                value={form.customerName}
                onChange={(e) => handleChange("customerName", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300">Phone Number</label>
            <input
              className="h-11 w-full rounded-2xl bg-slate-950 px-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
              placeholder="10-digit mobile"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-slate-300">Order Description</label>
          <div className="flex flex-col gap-2 rounded-2xl bg-slate-950 px-3 py-2">
            <textarea
              rows={3}
              className="w-full resize-none bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
              placeholder="Pant stitching Monday, advance 500..."
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
            <div className="flex justify-end">
              <VoiceButton
                onTranscript={(text) =>
                  setForm((prev) => ({
                    ...prev,
                    description: prev.description
                      ? `${prev.description} ${text}`
                      : text
                  }))
                }
              />
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300">Delivery Date</label>
            <div className="flex items-center gap-2 rounded-2xl bg-slate-950 px-3 py-2">
              <HiOutlineCalendarDays className="h-4 w-4 text-slate-400" />
              <input
                type="date"
                className="h-8 w-full bg-transparent text-sm text-slate-100 outline-none"
                value={form.deliveryDate}
                onChange={(e) => handleChange("deliveryDate", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300">Total Amount</label>
            <div className="flex items-center gap-2 rounded-2xl bg-slate-950 px-3 py-2">
              <HiOutlineCurrencyRupee className="h-4 w-4 text-slate-400" />
              <input
                type="number"
                className="h-8 w-full bg-transparent text-sm text-slate-100 outline-none"
                placeholder="0"
                value={form.totalAmount}
                onChange={(e) => handleChange("totalAmount", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300">Advance Paid</label>
            <div className="flex items-center gap-2 rounded-2xl bg-slate-950 px-3 py-2">
              <HiOutlineCurrencyRupee className="h-4 w-4 text-slate-400" />
              <input
                type="number"
                className="h-8 w-full bg-transparent text-sm text-slate-100 outline-none"
                placeholder="0"
                value={form.advancePaid}
                onChange={(e) => handleChange("advancePaid", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-950 px-4 py-3 text-sm">
          <span className="text-slate-300">Balance to collect</span>
          <span className="text-lg font-semibold text-emerald-400">
            ₹{balance}
          </span>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-slate-300">Photo</label>
          <PhotoUpload onChange={setPhoto} />
          {photo && (
            <p className="text-[11px] text-slate-500">
              Selected: {photo.name} ({Math.round(photo.size / 1024)} KB)
            </p>
          )}
        </div>

        <button
          type="submit"
          className="mt-2 flex h-11 w-full items-center justify-center rounded-2xl bg-emerald-500 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
        >
          Save Order
        </button>
      </form>
    </div>
  );
};

export default NewOrder;


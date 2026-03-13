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
      <h1 className="text-xl font-semibold text-slate-900">New Order</h1>
      <form
        onSubmit={handleSubmit}
        className="card-soft space-y-4 p-4"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Customer Name</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:ring-4 focus-within:ring-slate-100">
              <HiOutlineUser className="h-4 w-4 text-slate-400" />
              <input
                className="h-8 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                placeholder="Ramesh"
                value={form.customerName}
                onChange={(e) => handleChange("customerName", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Phone Number</label>
            <input
              className="input-base"
              placeholder="10-digit mobile"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700">Order Description</label>
          <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:ring-4 focus-within:ring-slate-100">
            <textarea
              rows={3}
              className="w-full resize-none bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
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
            <label className="text-xs font-medium text-slate-700">Delivery Date</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:ring-4 focus-within:ring-slate-100">
              <HiOutlineCalendarDays className="h-4 w-4 text-slate-400" />
              <input
                type="date"
                className="h-8 w-full bg-transparent text-sm text-slate-900 outline-none"
                value={form.deliveryDate}
                onChange={(e) => handleChange("deliveryDate", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Total Amount</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:ring-4 focus-within:ring-slate-100">
              <HiOutlineCurrencyRupee className="h-4 w-4 text-slate-400" />
              <input
                type="number"
                className="h-8 w-full bg-transparent text-sm text-slate-900 outline-none"
                placeholder="0"
                value={form.totalAmount}
                onChange={(e) => handleChange("totalAmount", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700">Advance Paid</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:ring-4 focus-within:ring-slate-100">
              <HiOutlineCurrencyRupee className="h-4 w-4 text-slate-400" />
              <input
                type="number"
                className="h-8 w-full bg-transparent text-sm text-slate-900 outline-none"
                placeholder="0"
                value={form.advancePaid}
                onChange={(e) => handleChange("advancePaid", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
          <span className="text-slate-700">Balance to collect</span>
          <span className="text-lg font-semibold text-emerald-700">
            ₹{balance}
          </span>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700">Photo</label>
          <PhotoUpload onChange={setPhoto} />
          {photo && (
            <p className="text-[11px] text-slate-500">
              Selected: {photo.name} ({Math.round(photo.size / 1024)} KB)
            </p>
          )}
        </div>

        <button
          type="submit"
          className="btn-primary mt-2 h-11 w-full"
        >
          Save Order
        </button>
      </form>
    </div>
  );
};

export default NewOrder;


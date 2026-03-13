import React, { useMemo, useState } from "react";
import { HiOutlineCalendarDays, HiOutlineCurrencyRupee, HiOutlineUser } from "react-icons/hi2";
import VoiceButton from "../../components/shared/VoiceButton.jsx";
import PhotoUpload from "../../components/shared/PhotoUpload.jsx";
import { useToast } from "../../components/ui/ToastProvider.jsx";
import { ordersService } from "../../services/ordersService.js";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NewOrder = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.customerName || !form.phone || !form.description) {
      alert(t("newOrder.validationError"));
      return;
    }
    try {
      await ordersService.createOrder({
        customerName: form.customerName,
        phone: form.phone,
        description: form.description,
        deliveryDate: form.deliveryDate || undefined,
        totalAmount: Number(form.totalAmount) || 0,
        advancePaid: Number(form.advancePaid) || 0
      });
      showSuccess(t("newOrder.successMsg"));
      navigate("/orders");
    } catch (err) {
      console.error(err);
      showError(t("newOrder.errorMsg"));
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{t("newOrder.title")}</h1>
        <p className="text-sm text-slate-500 mt-1">{t("newOrder.subtitle")}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Customer Details Section */}
        <div className="card-soft overflow-hidden">
          <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-100 flex items-center gap-2">
             <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">1</span>
             <h2 className="text-sm font-semibold text-slate-800">{t("newOrder.section1")}</h2>
          </div>
          <div className="p-5 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("newOrder.customerName")}</label>
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-1 shadow-sm focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
                <HiOutlineUser className="h-5 w-5 text-slate-400" />
                <input
                  className="h-12 w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-300"
                  placeholder={t("newOrder.customerNamePlaceholder")}
                  value={form.customerName}
                  onChange={(e) => handleChange("customerName", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("newOrder.phone")}</label>
              <input
                className="h-14 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900 shadow-sm outline-none placeholder:text-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50 transition-all"
                placeholder={t("newOrder.phonePlaceholder")}
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Order Details Section */}
        <div className="card-soft overflow-hidden">
          <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-100 flex items-center gap-2">
             <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">2</span>
             <h2 className="text-sm font-semibold text-slate-800">{t("newOrder.section2")}</h2>
          </div>
          <div className="p-5 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("newOrder.description")}</label>
              <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
                <textarea
                  rows={3}
                  className="w-full resize-none bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-300"
                  placeholder={t("newOrder.descriptionPlaceholder")}
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
                <div className="flex justify-end pt-2 border-t border-slate-50">
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
            
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("newOrder.deliveryDate")}</label>
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-1 shadow-sm focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
                  <HiOutlineCalendarDays className="h-5 w-5 text-slate-400" />
                  <input
                    type="date"
                    className="h-12 w-full bg-transparent text-base text-slate-900 outline-none"
                    value={form.deliveryDate}
                    onChange={(e) => handleChange("deliveryDate", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("newOrder.photo")}</label>
                <div className="px-1">
                  <PhotoUpload onChange={setPhoto} />
                  {photo && (
                    <p className="mt-2 text-xs text-slate-500 font-medium">
                      Selected: {photo.name} ({Math.round(photo.size / 1024)} KB)
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="card-soft overflow-hidden">
          <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-100 flex items-center gap-2">
             <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">3</span>
             <h2 className="text-sm font-semibold text-slate-800">{t("newOrder.section3")}</h2>
          </div>
          <div className="p-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("newOrder.totalAmount")}</label>
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-1 shadow-sm focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
                  <HiOutlineCurrencyRupee className="h-5 w-5 text-slate-400" />
                  <input
                    type="number"
                    className="h-12 w-full bg-transparent text-lg font-medium text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-300"
                    placeholder="0"
                    value={form.totalAmount}
                    onChange={(e) => handleChange("totalAmount", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t("newOrder.advancePaid")}</label>
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-1 shadow-sm focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-50 transition-all">
                  <HiOutlineCurrencyRupee className="h-5 w-5 text-slate-400" />
                  <input
                    type="number"
                    className="h-12 w-full bg-transparent text-lg font-medium text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-300"
                    placeholder="0"
                    value={form.advancePaid}
                    onChange={(e) => handleChange("advancePaid", e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/50 px-5 py-4">
              <span className="font-semibold text-emerald-900">{t("newOrder.balance")}</span>
              <span className="text-2xl font-bold tracking-tight text-emerald-700">
                ₹{balance}
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 flex h-14 w-full items-center justify-center rounded-xl bg-slate-900 text-base font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 active:scale-[0.98]"
        >
          {t("newOrder.save")}
        </button>
      </form>
    </div>
  );
};

export default NewOrder;

import React from "react";
import { motion } from "framer-motion";
import { HiOutlineClipboardDocumentList, HiOutlineUserGroup, HiOutlineCurrencyRupee } from "react-icons/hi2";

const steps = [
  {
    icon: HiOutlineClipboardDocumentList,
    title: "Capture every order",
    description: "Record orders in seconds with clear details, delivery dates, and photos."
  },
  {
    icon: HiOutlineUserGroup,
    title: "Know every customer",
    description: "See lifetime value, pending balances, and recent activity per customer."
  },
  {
    icon: HiOutlineCurrencyRupee,
    title: "Close every payment",
    description: "Track dues and follow up before payments slip through the cracks."
  }
];

const HowItWorksSection = () => {
  return (
    <section className="bg-slate-50 py-14">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            How Store Pilot fits your day.
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            A simple three-step loop that repeats with every customer.
          </p>
        </motion.div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: 0.08 * index, ease: "easeOut" }}
              className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="absolute left-4 top-4 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white">
                {index + 1}
              </div>
              <div className="ml-10">
                <div className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-slate-900">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;


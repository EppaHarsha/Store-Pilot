import React from "react";
import { motion } from "framer-motion";
import { HiOutlineSparkles, HiOutlineClock, HiOutlineDevicePhoneMobile } from "react-icons/hi2";

const features = [
  {
    icon: HiOutlineSparkles,
    title: "All-in-one store cockpit",
    description:
      "Track orders, payments, and customers in a single view designed for busy local businesses."
  },
  {
    icon: HiOutlineClock,
    title: "Never miss a due date",
    description:
      "See overdue payments at a glance and follow up before cash slips through the cracks."
  },
  {
    icon: HiOutlineDevicePhoneMobile,
    title: "Works on any device",
    description:
      "Optimized for mobile, tablet, and desktop so you can run your shop from wherever you are."
  }
];

const container = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.12,
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const FeaturesSection = () => {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Everything your shop needs, in one place.
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Store Pilot brings structure to daily chaos — from new orders to overdue payments.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-8 grid gap-4 md:grid-cols-3"
        >
          {features.map(({ icon: Icon, title, description }) => (
            <motion.div
              key={title}
              variants={item}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="card-soft card-hover h-full p-4"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
                <Icon className="h-4 w-4" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">{description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;


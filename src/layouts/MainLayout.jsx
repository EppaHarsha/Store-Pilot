import React from "react";
import Sidebar from "../components/layout/Sidebar.jsx";
import Topbar from "../components/layout/Topbar.jsx";
import { motion } from "framer-motion";

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mx-auto max-w-6xl rounded-3xl bg-slate-950/60 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.9)] ring-1 ring-slate-800/60 backdrop-blur"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;


import React from "react";
import TopNav from "../components/layout/TopNav.jsx";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <TopNav />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;


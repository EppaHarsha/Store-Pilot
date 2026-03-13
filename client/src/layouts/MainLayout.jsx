import React from "react";
import Sidebar from "../components/layout/Sidebar.jsx";
import MobileNav from "../components/layout/MobileNav.jsx";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 md:flex">
      <Sidebar />
      <MobileNav />
      {/* 
        md:ml-64 offset for the desktop sidebar.
        pb-24 padding bottom on mobile so content isn't hidden behind the bottom nav.
      */}
      <main className="flex-1 w-full pb-24 md:ml-64 md:pb-6">
        <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;


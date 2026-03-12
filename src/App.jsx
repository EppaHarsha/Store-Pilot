import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Orders from "./pages/Orders/Orders.jsx";
import Customers from "./pages/Customers/Customers.jsx";
import Payments from "./pages/Payments/Payments.jsx";
import NewOrder from "./pages/Orders/NewOrder.jsx";
import Settings from "./pages/Settings/Settings.jsx";

const App = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/new-order" element={<NewOrder />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </MainLayout>
  );
};

export default App;


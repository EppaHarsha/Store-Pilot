import React from "react";

const Settings = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-50">Settings</h1>
      <div className="space-y-2 rounded-2xl bg-slate-900 p-4 text-xs text-slate-300">
        <p>This is a placeholder settings page for Store Pilot.</p>
        <p className="text-slate-500">
          In a full version, you can add shop details, GST, notification
          preferences, and backup options here.
        </p>
      </div>
    </div>
  );
};

export default Settings;


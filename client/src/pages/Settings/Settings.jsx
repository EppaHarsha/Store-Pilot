import React from "react";
import { useTranslation } from "react-i18next";

const Settings = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">{t("settings.title")}</h1>
      <div className="card-soft space-y-2 p-4 text-xs text-slate-700">
        <p>{t("settings.placeholder")}</p>
        <p className="text-slate-500">{t("settings.hint")}</p>
      </div>
    </div>
  );
};

export default Settings;

"use client";

import { useState } from "react";
import { CrewShell } from "@/components/CrewShell";
import { useLanguage } from "@/components/LanguageProvider";
import { VitalsTrend } from "@/components/vitals/VitalsTrend";
import type { MessageKey } from "@/services/i18n";
import type { TrendMetric } from "@/services/mockData";

const metricOptions = [
  { metric: "heart_rate", label: "heartRate" },
  { metric: "spo2", label: "oxygen" },
  { metric: "blood_pressure", label: "bloodPressure" },
  { metric: "body_temperature", label: "temperature" },
  { metric: "blood_glucose", label: "glucose" },
] satisfies { metric: TrendMetric; label: MessageKey }[];

export default function TrendsPage() {
  const { t } = useLanguage();
  const [selectedMetric, setSelectedMetric] = useState<TrendMetric>("heart_rate");

  return (
    <CrewShell active="trends">
      <header className="screen-heading">
        <p className="eyebrow">{t("trendPeriodDemo").replace("{hours}", "6")}</p>
        <h1>{t("measurementsTrend")}</h1>
        <p className="page-intro">{t("trendsPageIntro")}</p>
      </header>
      <div className="metric-picker-wrap">
        <p className="eyebrow">{t("selectTrendMetric")}</p>
        <div className="metric-picker" role="group" aria-label={t("selectTrendMetric")}>
          {metricOptions.map((option) => (
            <button
              className={selectedMetric === option.metric ? "metric-picker-option metric-picker-option-active" : "metric-picker-option"}
              key={option.metric}
              type="button"
              aria-pressed={selectedMetric === option.metric}
              onClick={() => setSelectedMetric(option.metric)}
            >
              {t(option.label)}
            </button>
          ))}
        </div>
      </div>
      <VitalsTrend metric={selectedMetric} />
    </CrewShell>
  );
}
"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { MOCK_TRENDS, type MockTrendPoint } from "@/services/mockData";

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function DailySampleSummary({ trends = MOCK_TRENDS }: { trends?: MockTrendPoint[] }) {
  const { t } = useLanguage();
  const heartRate = average(trends.map((point) => point.heart_rate));
  const glucose = average(trends.map((point) => point.blood_glucose));
  const temperature = average(trends.map((point) => point.body_temperature));

  const summaries = [
    { label: t("heartRate"), value: `${Math.round(heartRate)} bpm` },
    { label: t("glucose"), value: `${Math.round(glucose)} mg/dL` },
    { label: t("temperature"), value: `${temperature.toFixed(1)} °C` },
    { label: t("sampleCount"), value: String(trends.length) },
  ];

  return (
    <section className="panel daily-sample-summary" aria-labelledby="daily-sample-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{t("dailySummaryDemo")}</p>
          <h2 id="daily-sample-title">{t("dailySummaryTitle")}</h2>
          <p className="panel-subtitle">{t("dailySummaryDisclaimer")}</p>
        </div>
      </div>
      <dl className="daily-sample-grid">
        {summaries.map((item) => (
          <div className="daily-sample-item" key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
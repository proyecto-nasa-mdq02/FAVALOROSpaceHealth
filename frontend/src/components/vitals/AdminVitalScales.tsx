"use client";

import type { TelemetryResponse, TrendMetric, MockTrendPoint } from "@/services/mockData";
import { StatusPill } from "@/components/StatusPill";
import { useLanguage } from "@/components/LanguageProvider";

interface AdminVitalScalesProps {
  vitals: TelemetryResponse["data"]["vitals"];
  trends: MockTrendPoint[];
  selectedMetric: TrendMetric;
  onSelectMetric: (metric: TrendMetric) => void;
}

export function AdminVitalScales({ vitals, trends, selectedMetric, onSelectMetric }: AdminVitalScalesProps) {
  const { t } = useLanguage();
  const metrics: { key: TrendMetric; short: string; label: string; value: number; display: string; unit: string; status: "GREEN" | "YELLOW" | "RED"; samples: number[] }[] = [
    { key: "blood_pressure", short: "PA", label: t("bloodPressure"), value: vitals.blood_pressure.systolic, display: `${vitals.blood_pressure.systolic}/${vitals.blood_pressure.diastolic}`, unit: vitals.blood_pressure.unit, status: vitals.blood_pressure.status, samples: trends.map((point) => point.systolic) },
    { key: "heart_rate", short: "FC", label: t("heartRate"), value: vitals.heart_rate.value, display: String(vitals.heart_rate.value), unit: vitals.heart_rate.unit, status: vitals.heart_rate.status, samples: trends.map((point) => point.heart_rate) },
    { key: "blood_glucose", short: "Gluc.", label: t("glucose"), value: vitals.blood_glucose.value, display: String(vitals.blood_glucose.value), unit: vitals.blood_glucose.unit, status: vitals.blood_glucose.status, samples: trends.map((point) => point.blood_glucose) },
    { key: "body_temperature", short: "T°", label: t("temperature"), value: vitals.body_temperature.value, display: Number(vitals.body_temperature.value).toFixed(1).replace(".", ","), unit: "°C", status: vitals.body_temperature.status, samples: trends.map((point) => point.body_temperature) },
    { key: "spo2", short: "SpO₂", label: t("oxygen"), value: vitals.spo2.value, display: String(vitals.spo2.value), unit: vitals.spo2.unit, status: vitals.spo2.status, samples: trends.map((point) => point.spo2) },
    { key: "respiratory_rate", short: "FR", label: t("respiratoryRate"), value: vitals.respiratory_rate.value, display: String(vitals.respiratory_rate.value), unit: vitals.respiratory_rate.unit, status: vitals.respiratory_rate.status, samples: trends.map((point) => point.respiratory_rate) },
  ];

  return (
    <section className="admin-ruler-panel" aria-label={t("vitalSigns")}>
      <div className="admin-ruler-grid">
        {metrics.map((metric) => {
          const low = Math.min(...metric.samples);
          const high = Math.max(...metric.samples);
          const marker = high === low ? 50 : Math.max(3, Math.min(97, ((high - metric.value) / (high - low)) * 100));
          const selected = metric.key === selectedMetric;
          return (
            <button
              className={`admin-ruler ${selected ? "admin-ruler-selected" : ""}`}
              key={metric.key}
              type="button"
              aria-label={`${metric.label}: ${metric.display} ${metric.unit}. ${t("viewTrend")}`}
              aria-pressed={selected}
              onClick={() => onSelectMetric(metric.key)}
            >
              <span className="admin-ruler-short">{metric.short}</span>
              <span className="admin-ruler-name">{metric.label}</span>
              <span className="admin-ruler-value">{metric.display}<small>{metric.unit}</small></span>
              <span className="admin-ruler-track" aria-hidden="true">
                <span className="admin-ruler-marker" style={{ top: `${marker}%` }} />
              </span>
              <span className="admin-ruler-range"><span>{low}</span><span>{high}</span></span>
              <span className="admin-ruler-status"><StatusPill status={metric.status} /></span>
            </button>
          );
        })}
      </div>
      <p className="admin-ruler-note">{t("sampleBarNote")}</p>
    </section>
  );
}

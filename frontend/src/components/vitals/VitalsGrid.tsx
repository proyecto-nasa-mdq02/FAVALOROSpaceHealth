"use client";

import { MaterialSymbol } from "@/components/MaterialSymbol";
import type { HealthStatus, TelemetryResponse, TrendMetric } from "@/services/mockData";
import { StatusPill } from "@/components/StatusPill";
import { useLanguage } from "@/components/LanguageProvider";
import { MOCK_TRENDS } from "@/services/mockData";

interface VitalsGridProps {
  vitals: TelemetryResponse["data"]["vitals"];
  selectedMetric: TrendMetric;
  onSelectMetric: (metric: TrendMetric) => void;
}

export function VitalsGrid({ vitals, selectedMetric, onSelectMetric }: VitalsGridProps) {
  const { t } = useLanguage();
  const metrics: {
    key: TrendMetric;
    label: string;
    value: string;
    unit: string;
    description: string;
    status: HealthStatus;
    icon: string;
    tone: string;
    chartLabel: string;
    numericValue: number;
    sampleValues: number[];
  }[] = [
    {
      key: "heart_rate",
      label: t("heartRate"),
      value: String(vitals.heart_rate.value),
      unit: vitals.heart_rate.unit,
      description: t("heartRateDescription"),
      status: vitals.heart_rate.status,
      icon: "ecg_heart",
      tone: "mint",
      chartLabel: t("viewHeartRateTrend"),
      numericValue: vitals.heart_rate.value,
      sampleValues: MOCK_TRENDS.map((point) => point.heart_rate),
    },
    {
      key: "spo2",
      label: t("oxygen"),
      value: String(vitals.spo2.value),
      unit: vitals.spo2.unit,
      description: t("oxygenDescription"),
      status: vitals.spo2.status,
      icon: "air",
      tone: "sky",
      chartLabel: t("viewOxygenTrend"),
      numericValue: vitals.spo2.value,
      sampleValues: MOCK_TRENDS.map((point) => point.spo2),
    },
    {
      key: "blood_pressure",
      label: t("bloodPressure"),
      value: `${vitals.blood_pressure.systolic}/${vitals.blood_pressure.diastolic}`,
      unit: vitals.blood_pressure.unit,
      description: t("bloodPressureDescription"),
      status: vitals.blood_pressure.status,
      icon: "blood_pressure",
      tone: "coral",
      chartLabel: t("viewPressureTrend"),
      numericValue: vitals.blood_pressure.systolic,
      sampleValues: MOCK_TRENDS.map((point) => point.systolic),
    },
    {
      key: "body_temperature",
      label: t("temperature"),
      value: String(vitals.body_temperature.value),
      unit: "°C",
      description: t("temperatureDescription"),
      status: vitals.body_temperature.status,
      icon: "device_thermostat",
      tone: "lemon",
      chartLabel: t("viewTemperatureTrend"),
      numericValue: vitals.body_temperature.value,
      sampleValues: MOCK_TRENDS.map((point) => point.body_temperature),
    },
    {
      key: "blood_glucose",
      label: t("glucose"),
      value: String(vitals.blood_glucose.value),
      unit: vitals.blood_glucose.unit,
      description: t("glucoseDescription"),
      status: vitals.blood_glucose.status,
      icon: "water_drop",
      tone: "lilac",
      chartLabel: t("viewGlucoseTrend"),
      numericValue: vitals.blood_glucose.value,
      sampleValues: MOCK_TRENDS.map((point) => point.blood_glucose),
    },
  ];

  return (
    <div className="vitals-grid-wrap">
      <p className="vitals-sample-note">{t("sampleBarNote")}</p>
      <div className="vitals-grid">
      {metrics.map((metric) => {
        const isSelected = selectedMetric === metric.key;
        const low = Math.min(...metric.sampleValues);
        const high = Math.max(...metric.sampleValues);
        const span = high - low || 1;
        const marker = Math.max(0, Math.min(100, ((metric.numericValue - low) / span) * 100));

        return (
          <button
            className={`metric-card metric-card-${metric.tone} ${isSelected ? "metric-card-selected" : ""}`}
            key={metric.key}
            type="button"
            aria-label={metric.chartLabel}
            aria-pressed={isSelected}
            onClick={() => onSelectMetric(metric.key)}
          >
            <span className={`metric-icon metric-icon-${metric.tone}`}>
              <MaterialSymbol name={metric.icon} size={19} />
            </span>
            <span className="metric-label">{metric.label}</span>
            <span className="metric-reading">
              {metric.value} <span>{metric.unit}</span>
            </span>
            <span className="metric-description">{metric.description}</span>
            <span className="metric-sample-range" aria-label={`${t("sampleRange")}: ${low}–${high} ${metric.unit}`}>
              <span className="metric-sample-values"><span>{low}</span><span>{high}</span></span>
              <span className="metric-sample-track" aria-hidden="true">
                <span className="metric-sample-marker" style={{ left: `${marker}%` }} />
              </span>
              <span className="metric-sample-caption">{t("sampleRange")}</span>
            </span>
            <span className="metric-status">
              <StatusPill status={metric.status} />
              <span className="metric-trend-hint">{t("viewTrend")}</span>
            </span>
          </button>
        );
      })}
      </div>
    </div>
  );
}
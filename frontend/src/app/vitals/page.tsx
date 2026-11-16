"use client";

import { useState } from "react";
import { CrewShell } from "@/components/CrewShell";
import { VitalAttentionBanner } from "@/components/alerts/VitalAttentionBanner";
import { AnatomyMapPanel } from "@/components/vitals/AnatomyMapPanel";
import { StatusGuide } from "@/components/StatusGuide";
import { DailySampleSummary } from "@/components/alerts/DailySampleSummary";
import { useLanguage } from "@/components/LanguageProvider";
import { VitalsGrid } from "@/components/vitals/VitalsGrid";
import { InteractiveChartsPanel } from "@/components/vitals/InteractiveChartsPanel";
import { MOCK_TELEMETRY, MOCK_TRENDS, type TrendMetric } from "@/services/mockData";
import type { AnatomicalRegionId, VitalMetricKey } from "@/data/anatomyData";

export default function VitalsPage() {
  const { t } = useLanguage();
  const [selectedMetric, setSelectedMetric] = useState<TrendMetric>("heart_rate");
  const [selectedRegion, setSelectedRegion] = useState<AnatomicalRegionId>("corazon");

  function handleMetricSelect(metric: string) {
    const normalized = metric.toLowerCase().replace(/[^a-z]/g, "");
    const mapped: TrendMetric =
      normalized === "spo2"
        ? "spo2"
        : normalized.includes("glucose")
          ? "blood_glucose"
          : normalized.includes("blood")
            ? "blood_pressure"
            : normalized.includes("heart")
              ? "heart_rate"
              : "body_temperature";
    setSelectedMetric(mapped);
  }

  function handleRegionSelect(regionId: AnatomicalRegionId, linkedMetric: VitalMetricKey) {
    setSelectedRegion(regionId);
    setSelectedMetric(linkedMetric);
  }

  return (
    <CrewShell active="vitals">
      <header className="screen-heading">
        <p className="eyebrow">{t("currentReading")}</p>
        <h1>{t("vitalSigns")}</h1>
        <p className="page-intro">{t("vitalsPageIntro")}</p>
      </header>
      <StatusGuide />
      <VitalAttentionBanner vitals={MOCK_TELEMETRY.data.vitals} />
      <VitalsGrid
        vitals={MOCK_TELEMETRY.data.vitals}
        selectedMetric={selectedMetric}
        onSelectMetric={setSelectedMetric}
      />
      <AnatomyMapPanel
        vitals={MOCK_TELEMETRY.data.vitals}
        selectedRegion={selectedRegion}
        onSelectRegion={handleRegionSelect}
      />
      <DailySampleSummary trends={MOCK_TRENDS} />
      <div className="mt-8">
        <InteractiveChartsPanel
          trends={MOCK_TRENDS}
          selectedMetric={selectedMetric}
          onChangeMetric={handleMetricSelect}
        />
      </div>
    </CrewShell>
  );
}

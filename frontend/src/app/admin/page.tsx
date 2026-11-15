"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { ClinicalSummary } from "@/components/alerts/ClinicalSummary";
import { DailySampleSummary } from "@/components/alerts/DailySampleSummary";
import { DemoNotificationCenter } from "@/components/alerts/DemoNotificationCenter";
import { DemoObservations } from "@/components/alerts/DemoObservations";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { StatusGuide } from "@/components/StatusGuide";
import { CrewShell } from "@/components/CrewShell";
import { AnatomyMapPanel } from "@/components/vitals/AnatomyMapPanel";
import { VitalSignsPanel } from "@/components/vitals/VitalSignsPanel";
import { InteractiveChartsPanel } from "@/components/vitals/InteractiveChartsPanel";
import { MedicalKpiSummary } from "@/components/vitals/MedicalKpiSummary";
import { DailySummaryKPIPanel } from "@/components/alerts/DailySummaryKPIPanel";
import { SmartMirrorPanel } from "@/components/smart_mirror/SmartMirrorPanel";
import { StandardMeasures } from "@/components/standard_measures/StandardMeasures";
import { useLanguage } from "@/components/LanguageProvider";
import type { MessageKey } from "@/services/i18n";
import { MOCK_ASTRONAUTS, MOCK_TRENDS_BY_ASTRONAUT } from "@/services/mockData";

const adminSections = [
  { id: "monitor", label: "adminMonitor", icon: "monitor_heart" },
  { id: "resumen", label: "navOverview", icon: "dashboard" },
  { id: "tendencias", label: "quickTrends", icon: "show_chart" },
  { id: "medidas", label: "navMeasures", icon: "monitoring" },
  { id: "alertas", label: "adminAlertsNav", icon: "notifications" },
] satisfies { id: string; label: MessageKey; icon: string }[];

export default function AdminDashboardPage() {
  const { locale, t } = useLanguage();
  const [selectedMetric, setSelectedMetric] = useState<string>("heartRate");
  const [selectedRegion, setSelectedRegion] = useState<"corazon" | "arteria" | "vena" | "capilar">("corazon");
  const [activeSection, setActiveSection] = useState("monitor");
  const [selectedAstronautId, setSelectedAstronautId] = useState(MOCK_ASTRONAUTS[0].data.astronaut.id);
  const [readingIndex, setReadingIndex] = useState(6);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [testAlertVisible, setTestAlertVisible] = useState(false);
  const selectedRecord = MOCK_ASTRONAUTS.find((record) => record.data.astronaut.id === selectedAstronautId) ?? MOCK_ASTRONAUTS[0];
  const selectedTrends = MOCK_TRENDS_BY_ASTRONAUT[selectedAstronautId] ?? MOCK_TRENDS_BY_ASTRONAUT[MOCK_ASTRONAUTS[0].data.astronaut.id];
  const activeTrend = selectedTrends[readingIndex];
  const data = {
    ...selectedRecord.data,
    vitals: {
      ...selectedRecord.data.vitals,
      heart_rate: { ...selectedRecord.data.vitals.heart_rate, value: activeTrend.heart_rate },
      spo2: { ...selectedRecord.data.vitals.spo2, value: activeTrend.spo2 },
      blood_pressure: { ...selectedRecord.data.vitals.blood_pressure, systolic: activeTrend.systolic },
      body_temperature: { ...selectedRecord.data.vitals.body_temperature, value: activeTrend.body_temperature },
      blood_glucose: { ...selectedRecord.data.vitals.blood_glucose, value: activeTrend.blood_glucose },
      respiratory_rate: { ...selectedRecord.data.vitals.respiratory_rate, value: activeTrend.respiratory_rate },
    },
  };

  useEffect(() => {
    if (!simulationRunning) return;
    const timer = window.setInterval(() => {
      setReadingIndex((index) => (index + 1) % selectedTrends.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [simulationRunning, selectedTrends.length]);

  function playTestTone() {
    try {
      const context = new window.AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(520, context.currentTime);
      oscillator.frequency.setValueAtTime(660, context.currentTime + 0.11);
      gain.gain.setValueAtTime(0.025, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.28);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.onended = () => void context.close();
      oscillator.start();
      oscillator.stop(context.currentTime + 0.3);
    } catch {}
  }

  function showTestAlert() {
    setTestAlertVisible(true);
    if (soundEnabled) playTestTone();
  }

  function nextSample() {
    setReadingIndex((index) => (index + 1) % selectedTrends.length);
  }

  function handleMetricSelection(metric: string) {
    setSelectedMetric(metric);
    const normalized = metric.toLowerCase().replace(/[^a-z]/g, "");
    const region: "corazon" | "arteria" | "vena" | "capilar" =
      normalized.includes("glucose")
        ? "vena"
        : normalized.includes("blood")
          ? "arteria"
          : normalized.includes("heart")
            ? "corazon"
            : "capilar";
    setSelectedRegion(region);
  }

  return (
    <CrewShell active="admin">
      <header className="page-header">
        <div>
          <p className="eyebrow">{t("adminDashboard")}</p>
          <h1>{t("adminDashboard")}</h1>
          <span className="demo-chip">{t("demoSampleRecord")}</span>
        </div>
      </header>

      <section className="admin-workspace-toolbar" aria-label={t("crewContext")}>
        <div className="admin-astronaut-picker">
          <MaterialSymbol name="groups" size={19} />
          <label htmlFor="admin-astronaut-select">{t("crewRecord")}</label>
          <select
            id="admin-astronaut-select"
            value={selectedAstronautId}
            onChange={(event) => {
              setSelectedAstronautId(event.target.value);
              setReadingIndex(6);
            }}
          >
            {MOCK_ASTRONAUTS.map((record) => (
              <option key={record.data.astronaut.id} value={record.data.astronaut.id}>
                {record.data.astronaut.name} ({record.data.astronaut.id})
              </option>
            ))}
          </select>
          <span>{data.astronaut.mission}</span>
        </div>
        <div className="admin-simulation-controls">
          <span className="admin-simulation-state"><span className={`admin-data-dot ${simulationRunning ? "admin-data-dot-running" : ""}`} />{simulationRunning ? t("simulationPlaying") : t("simulationPaused")}</span>
          <span className="admin-patient-updated"><MaterialSymbol name="schedule" size={15} /> {activeTrend.time} UTC</span>
          <button type="button" className="admin-control-button" aria-pressed={simulationRunning} onClick={() => setSimulationRunning((running) => !running)}>
            <MaterialSymbol name={simulationRunning ? "pause" : "play_arrow"} size={17} />
            {simulationRunning ? t("pauseSimulation") : t("startSimulation")}
          </button>
          <button type="button" className="admin-test-button" onClick={nextSample}>
            <MaterialSymbol name="refresh" size={17} /> {t("nextSample")}
          </button>
        </div>
      </section>

      {testAlertVisible && (
        <section className="admin-test-alert" role="status" aria-live="polite">
          <MaterialSymbol name="notifications_active" size={21} />
          <div>
            <strong>{t("adminTestAlertTitle")}</strong>
            <p>{t("adminTestAlertMessage")}</p>
            <small>{t("adminTestAlertDisclaimer")}</small>
          </div>
          <button type="button" aria-label={t("adminDismissTestAlert")} onClick={() => setTestAlertVisible(false)}>
            <MaterialSymbol name="close" size={18} />
          </button>
        </section>
      )}

      <div className="admin-overview-grid" id="monitor">
        <div className="admin-anatomy-column">
          <AnatomyMapPanel
            vitals={data.vitals}
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
          />
        </div>
        <div className="admin-monitor-right-stack">
          <section className="admin-vitals-panel" id="signos" aria-labelledby="admin-vitals-title">
            <div className="admin-panel-heading">
              <div><p className="eyebrow">{t("currentReading")}</p><h2 id="admin-vitals-title">{t("vitalSigns")}</h2></div>
              <span className="admin-data-label"><span className="admin-data-dot" /> {t("dataMode")}</span>
            </div>
            <VitalSignsPanel vitals={data.vitals} selectedMetric={selectedMetric} onSelectMetric={handleMetricSelection} />
            <InteractiveChartsPanel
              trends={selectedTrends}
              selectedMetric={selectedMetric}
              onChangeMetric={handleMetricSelection}
              className="mt-12"
            />
          </section>
          <DemoObservations />
        </div>
      </div>

      <section className="admin-daily-summary mt-8" aria-label={t("healthSummary")}>
        <DailySummaryKPIPanel
          vitals={data.vitals}
          dailyKpi={data.daily_kpi ?? {
            timeInRangePct: 92,
            timeInRangeDelta: 3.1,
            avgHeartRate: 74,
            hrvMs: 45,
            avgGlucose: 96,
            glucosePeak: 104,
            meanTemperature: 36.7,
            readingsCount: selectedTrends.length,
            readingsTarget: 8,
          }}
        />
      </section>

      <section className="admin-summary-grid" id="resumen" aria-label={t("healthSummary")}>
        <ClinicalSummary assessment={data.clinical_assessment} vitals={data.vitals} />
        <StatusGuide />
      </section>

      <section className="admin-daily-summary" aria-label={t("dailySummaryTitle")}>
        <DailySampleSummary trends={selectedTrends} />
      </section>

      <div className="admin-secondary-grid">
        <section id="medidas" aria-label={t("navMeasures")}><StandardMeasures measures={data.standard_measures} /></section>
        <section id="espejo" aria-label={t("navMirror")}><SmartMirrorPanel mirror={data.smart_mirror_vision} /></section>
      </div>

      <section className="admin-notification-section" id="alertas" aria-label={t("notificationCenterTitle")}>
        <DemoNotificationCenter
          records={MOCK_ASTRONAUTS}
          selectedAstronautId={selectedAstronautId}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled((enabled) => !enabled)}
          onTestSound={showTestAlert}
          onSelectMetric={(metric) => {
            setSelectedMetric(metric);
            document.getElementById("tendencias")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        />
      </section>
    </CrewShell>
  );
}

"use client";

import Link from "next/link";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { ClinicalSummary } from "@/components/alerts/ClinicalSummary";
import { DailySampleSummary } from "@/components/alerts/DailySampleSummary";
import { CrewShell } from "@/components/CrewShell";
import { StatusGuide } from "@/components/StatusGuide";
import { useLanguage } from "@/components/LanguageProvider";
import { VitalsHighlights } from "@/components/vitals/VitalsHighlights";
import { useEffect, useState } from "react";
import { getTelemetriaTripulante, getTripulantes } from "@/services/api";

export default function CrewHomePage() {
  const { t } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const tripulantes = await getTripulantes();
        const tripulante = tripulantes[0];
        if (tripulante) {
          const telemetria = await getTelemetriaTripulante(tripulante.id, 15);
          setData({
            astronaut: {
              id: tripulante.id,
              name: `${tripulante.nombres} ${tripulante.apellidos}`,
              mission: tripulante.codigo_astronauta,
            },
            vitals: {
              heart_rate: { value: telemetria[0]?.frecuencia_cardiaca || 74, unit: "bpm", status: "GREEN", label: "Frecuencia cardíaca", icon: "ecg_heart", tone: "heart" },
              spo2: { value: telemetria[0]?.spo2 || 98, unit: "%", status: "GREEN", label: "Oxígeno en sangre", icon: "air", tone: "oxygen" },
              blood_pressure: { systolic: telemetria[0]?.presion_sistolica || 118, diastolic: telemetria[0]?.presion_diastolica || 76, unit: "mmHg", status: "GREEN", label: "Presión arterial", icon: "blood_pressure", tone: "pressure" },
              body_temperature: { value: telemetria[0]?.temperatura_c || 36.7, unit: "°C", status: "GREEN", label: "Temperatura corporal", icon: "device_thermostat", tone: "temperature" },
              blood_glucose: { value: telemetria[0]?.glucosa_mg_dl || 95, unit: "mg/dL", status: "GREEN", label: "Glucosa en sangre", icon: "water_drop", tone: "glucose" },
              respiratory_rate: { value: telemetria[0]?.estado_animo || 16, unit: "rpm", status: "GREEN", label: "Frecuencia respiratoria", icon: "activity", tone: "sky" },
            },
            clinical_assessment: {
              overall_status: "GREEN",
              engine_mode: "DETERMINISTIC_RULES",
              active_alerts: [],
              preventive_recommendation: "Mantén la hidratación y el ejercicio resistivo programado.",
            },
          });
        }
      } catch (e) {
        console.error("Error cargando datos:", e);
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, []);

  if (loading) {
    return (
      <CrewShell active="today">
        <header className="page-header">
          <div>
            <p className="eyebrow">{t("personalArea")}</p>
            <h1>{t("todayCheckup")}</h1>
            <p className="page-intro">Cargando...</p>
          </div>
        </header>
      </CrewShell>
    );
  }

  if (!data) return null;

  return (
    <CrewShell active="today">
      <header className="page-header">
        <div>
          <p className="eyebrow">{t("personalArea")}</p>
          <h1>{t("todayCheckup")}</h1>
          <p className="page-intro">{t("homeSummaryIntro")}</p>
        </div>
        <span className="demo-chip">{t("demo")}</span>
      </header>

      <section className="crew-strip" aria-label={t("crewContext")}>
        <div className="crew-person">
          <div className="crew-avatar" aria-hidden="true">AV</div>
          <div><span className="crew-label">{t("crewMember")}</span><strong>{data.astronaut.name}</strong></div>
        </div>
        <div className="crew-divider" />
        <div className="crew-detail"><span>{t("mission")}</span><strong>{data.astronaut.mission}</strong></div>
        <div className="crew-detail crew-environment"><span>{t("environment")}</span><strong><MaterialSymbol name="public" size={14} /> {t("environmentNotListed")}</strong></div>
      </section>

      <ClinicalSummary assessment={data.clinical_assessment} vitals={data.vitals} />
      <DailySampleSummary />
      <StatusGuide />

      <section className="home-readings" aria-labelledby="home-readings-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{t("currentReading")}</p>
            <h2 id="home-readings-title">{t("allVitalSigns")}</h2>
          </div>
          <Link className="text-link" href="/trends">{t("quickVitals")} <MaterialSymbol name="arrow_forward" size={15} /></Link>
        </div>
        <VitalsHighlights vitals={data.vitals} />
      </section>

      <Link className="plan-teaser" href="/plan">
        <span className="plan-teaser-icon"><MaterialSymbol name="auto_awesome" size={20} /></span>
        <span><strong>{t("dailyPlan")}</strong><small>{t("planPrompt")}</small></span>
        <MaterialSymbol name="arrow_forward" size={18} />
      </Link>
    </CrewShell>
  );
}

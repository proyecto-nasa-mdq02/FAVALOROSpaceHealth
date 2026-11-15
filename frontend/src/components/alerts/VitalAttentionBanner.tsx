import { MaterialSymbol } from "@/components/MaterialSymbol";
import { StatusPill } from "@/components/StatusPill";
import { useLanguage } from "@/components/LanguageProvider";
import type { TelemetryResponse } from "@/services/mockData";

export function VitalAttentionBanner({ vitals }: { vitals: TelemetryResponse["data"]["vitals"] }) {
  const { t } = useLanguage();
  const metrics = [
    { key: "heart_rate", label: t("heartRate"), value: String(vitals.heart_rate.value), unit: vitals.heart_rate.unit, status: vitals.heart_rate.status, icon: "ecg_heart" },
    { key: "spo2", label: t("oxygen"), value: String(vitals.spo2.value), unit: vitals.spo2.unit, status: vitals.spo2.status, icon: "air" },
    { key: "blood_pressure", label: t("bloodPressure"), value: `${vitals.blood_pressure.systolic}/${vitals.blood_pressure.diastolic}`, unit: vitals.blood_pressure.unit, status: vitals.blood_pressure.status, icon: "blood_pressure" },
    { key: "body_temperature", label: t("temperature"), value: String(vitals.body_temperature.value), unit: "°C", status: vitals.body_temperature.status, icon: "device_thermostat" },
    { key: "blood_glucose", label: t("glucose"), value: String(vitals.blood_glucose.value), unit: vitals.blood_glucose.unit, status: vitals.blood_glucose.status, icon: "water_drop" },
  ].filter((metric) => metric.status !== "GREEN");

  if (metrics.length === 0) return null;

  const isCritical = metrics.some((metric) => metric.status === "RED");

  return (
    <section
      className={`vital-attention-banner ${isCritical ? "vital-attention-critical" : "vital-attention-caution"}`}
      aria-labelledby="vital-attention-title"
      aria-live={isCritical ? "assertive" : "polite"}
      role={isCritical ? "alert" : "status"}
    >
      <div className="vital-attention-heading">
        <MaterialSymbol name={isCritical ? "warning" : "info"} size={22} />
        <div>
          <h2 id="vital-attention-title">{t("vitalAttentionTitle")}</h2>
          <p>{t("vitalAttentionContext")}</p>
        </div>
      </div>
      <ul className="vital-attention-list">
        {metrics.map((metric) => (
          <li className={`vital-attention-item status-${metric.status.toLowerCase()}`} key={metric.key}>
            <MaterialSymbol name={metric.icon} size={19} />
            <strong>{metric.label}</strong>
            <span className="vital-attention-reading">{metric.value} {metric.unit}</span>
            <StatusPill status={metric.status} />
          </li>
        ))}
      </ul>
    </section>
  );
}
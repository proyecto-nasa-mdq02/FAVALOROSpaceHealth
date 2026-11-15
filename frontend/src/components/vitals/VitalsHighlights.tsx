import Link from "next/link";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import type { TelemetryResponse } from "@/services/mockData";
import { StatusPill } from "@/components/StatusPill";
import { useLanguage } from "@/components/LanguageProvider";

export function VitalsHighlights({ vitals }: { vitals: TelemetryResponse["data"]["vitals"] }) {
  const { t } = useLanguage();
  const items = [
    { label: t("heartRate"), value: String(vitals.heart_rate.value), unit: vitals.heart_rate.unit, status: vitals.heart_rate.status, icon: "ecg_heart", tone: "heart" },
    { label: t("oxygen"), value: String(vitals.spo2.value), unit: vitals.spo2.unit, status: vitals.spo2.status, icon: "air", tone: "oxygen" },
    { label: t("bloodPressure"), value: `${vitals.blood_pressure.systolic}/${vitals.blood_pressure.diastolic}`, unit: vitals.blood_pressure.unit, status: vitals.blood_pressure.status, icon: "blood_pressure", tone: "pressure" },
    { label: t("temperature"), value: String(vitals.body_temperature.value), unit: "°C", status: vitals.body_temperature.status, icon: "device_thermostat", tone: "temperature" },
    { label: t("glucose"), value: String(vitals.blood_glucose.value), unit: vitals.blood_glucose.unit, status: vitals.blood_glucose.status, icon: "water_drop", tone: "glucose" },
  ];

  return (
    <div className="vitals-highlights">
      {items.map((item) => (
        <Link className={`vitals-highlight vitals-highlight-${item.tone}`} href="/vitals" key={item.label}>
          <span className="vitals-highlight-top">
            <span className="vitals-highlight-icon"><MaterialSymbol name={item.icon} size={19} /></span>
            <span className="vitals-highlight-label">{item.label}</span>
          </span>
          <strong>{item.value} <small>{item.unit}</small></strong>
          <StatusPill status={item.status} />
        </Link>
      ))}
    </div>
  );
}
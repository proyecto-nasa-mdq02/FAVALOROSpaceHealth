"use client";

import { useState } from "react";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { StatusPill } from "@/components/StatusPill";
import { useLanguage } from "@/components/LanguageProvider";
import type { MessageKey } from "@/services/i18n";
import type { HealthStatus, TelemetryResponse, TrendMetric } from "@/services/mockData";

interface DemoNotification {
  id: string;
  astronautId: string;
  astronautName: string;
  metric: TrendMetric;
  label: MessageKey;
  value: string;
  unit: string;
  status: HealthStatus;
}

interface DemoNotificationCenterProps {
  records: TelemetryResponse[];
  selectedAstronautId: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onTestSound: () => void;
  onSelectMetric: (metric: TrendMetric) => void;
}

export function DemoNotificationCenter({
  records,
  selectedAstronautId,
  soundEnabled,
  onToggleSound,
  onTestSound,
  onSelectMetric,
}: DemoNotificationCenterProps) {
  const { t } = useLanguage();
  const [showCurrentOnly, setShowCurrentOnly] = useState(false);
  const [includeYellow, setIncludeYellow] = useState(true);
  const [includeRed, setIncludeRed] = useState(true);
  const [readIds, setReadIds] = useState<string[]>([]);

  const notifications: DemoNotification[] = records.flatMap(({ data }) => {
    const astronaut = data.astronaut;
    const metricValues: Omit<DemoNotification, "astronautId" | "astronautName" | "id">[] = [
      { metric: "heart_rate", label: "heartRate", value: String(data.vitals.heart_rate.value), unit: data.vitals.heart_rate.unit, status: data.vitals.heart_rate.status },
      { metric: "spo2", label: "oxygen", value: String(data.vitals.spo2.value), unit: data.vitals.spo2.unit, status: data.vitals.spo2.status },
      { metric: "blood_pressure", label: "bloodPressure", value: `${data.vitals.blood_pressure.systolic}/${data.vitals.blood_pressure.diastolic}`, unit: data.vitals.blood_pressure.unit, status: data.vitals.blood_pressure.status },
      { metric: "body_temperature", label: "temperature", value: String(data.vitals.body_temperature.value), unit: "°C", status: data.vitals.body_temperature.status },
      { metric: "blood_glucose", label: "glucose", value: String(data.vitals.blood_glucose.value), unit: data.vitals.blood_glucose.unit, status: data.vitals.blood_glucose.status },
    ];
    return metricValues
      .filter((metric) => metric.status === "YELLOW" || metric.status === "RED")
      .map((metric) => ({ ...metric, id: `${astronaut.id}-${metric.metric}`, astronautId: astronaut.id, astronautName: astronaut.name }));
  });

  const visibleNotifications = notifications.filter((item) => {
    if (item.status === "YELLOW" && !includeYellow) return false;
    if (item.status === "RED" && !includeRed) return false;
    if (showCurrentOnly && item.astronautId !== selectedAstronautId) return false;
    return true;
  });
  const unreadCount = visibleNotifications.filter((item) => !readIds.includes(item.id)).length;

  return (
    <section className="panel demo-notification-panel" id="alertas" aria-labelledby="demo-notification-title">
      <div className="panel-heading demo-notification-heading">
        <div>
          <p className="eyebrow">{t("demoNotesLabel")}</p>
          <h2 id="demo-notification-title">{t("notificationCenterTitle")}</h2>
          <p className="panel-subtitle">{t("notificationStatusDisclaimer")}</p>
        </div>
        <details className="notification-preferences">
          <summary><MaterialSymbol name="tune" size={16} /> {t("notificationPrefs")}</summary>
          <div className="notification-preferences-popover">
            <label><input type="checkbox" checked={includeYellow} onChange={(event) => setIncludeYellow(event.target.checked)} /> {t("notifyStatusYellow")}</label>
            <label><input type="checkbox" checked={includeRed} onChange={(event) => setIncludeRed(event.target.checked)} /> {t("notifyStatusRed")}</label>
            <label><input type="checkbox" checked={soundEnabled} onChange={onToggleSound} /> {t("adminSoundOn")}</label>
            <button type="button" className="admin-test-button" onClick={onTestSound}>
              <MaterialSymbol name="volume_up" size={16} /> {t("adminTestNotification")}
            </button>
          </div>
        </details>
      </div>
      <div className="notification-toolbar">
        <label className="notification-current-filter">
          <input type="checkbox" checked={showCurrentOnly} onChange={(event) => setShowCurrentOnly(event.target.checked)} />
          {t("notificationCurrentOnly")}
        </label>
        <span>{t("unreadCountLabel").replace("{count}", String(unreadCount))}</span>
        <div className="notification-actions">
          <button type="button" disabled={unreadCount === 0} onClick={() => setReadIds(visibleNotifications.map((item) => item.id))}>{t("markAllRead")}</button>
          <button type="button" disabled={readIds.length === 0} onClick={() => setReadIds([])}>{t("clearRead")}</button>
        </div>
      </div>
      {visibleNotifications.length === 0 ? (
        <p className="notification-empty">{t("notificationEmpty")}</p>
      ) : (
        <ul className="notification-list">
          {visibleNotifications.map((item) => {
            const isRead = readIds.includes(item.id);
            return (
              <li className={`notification-item ${isRead ? "notification-item-read" : ""}`} key={item.id}>
                <div className="notification-item-copy">
                  <div className="notification-item-meta"><StatusPill status={item.status} /><strong>{item.astronautName}</strong><span>{t(item.label)}</span></div>
                  <p>{item.value} {item.unit}<small>{t("sampleStatusSource")}</small></p>
                </div>
                <div className="notification-item-actions">
                  <button type="button" onClick={() => onSelectMetric(item.metric)}>{t("viewTrend")}</button>
                  <button type="button" disabled={isRead} onClick={() => setReadIds((current) => [...current, item.id])}>{isRead ? t("readLabel") : t("markRead")}</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
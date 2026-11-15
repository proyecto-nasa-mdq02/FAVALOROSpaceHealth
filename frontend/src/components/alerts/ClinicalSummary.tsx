import { MaterialSymbol } from "@/components/MaterialSymbol";
import type { TelemetryResponse } from "@/services/mockData";
import { StatusPill } from "@/components/StatusPill";
import { useLanguage } from "@/components/LanguageProvider";
import { getMessage } from "@/services/i18n";
import { VitalAttentionBanner } from "@/components/alerts/VitalAttentionBanner";

export function ClinicalSummary({ assessment, vitals }: {
  assessment: TelemetryResponse["data"]["clinical_assessment"];
  vitals: TelemetryResponse["data"]["vitals"];
}) {
  const { locale, t } = useLanguage();
  const hasAlerts = assessment.active_alerts.length > 0;
  const vitalAttentionCount = Object.values(vitals).filter((metric) => metric.status !== "GREEN").length;
  const attentionCount = assessment.active_alerts.length + vitalAttentionCount;
  const recommendation = assessment.preventive_recommendation === getMessage("en", "defaultRecommendation") && locale === "es"
    ? getMessage("es", "defaultRecommendationEs")
    : assessment.preventive_recommendation;

  return (
    <section className={`status-panel status-panel-${assessment.overall_status.toLowerCase()}`} aria-labelledby="status-title">
      <div className="status-panel-main">
        <span className="status-emblem" aria-hidden="true">
          {hasAlerts || vitalAttentionCount > 0 || assessment.overall_status !== "GREEN"
            ? <MaterialSymbol name="warning" size={23} />
            : <MaterialSymbol name="health_and_safety" size={23} />}
        </span>
        <div className="status-copy">
          <p className="eyebrow">{t("healthSummaryDemo")}</p>
          <h2 id="status-title">{t("healthSummary")}</h2>
          <StatusPill status={assessment.overall_status} />
        </div>
        <div className="alert-count" aria-live="polite">
          <strong>{Math.max(attentionCount, assessment.overall_status === "GREEN" ? 0 : 1).toString().padStart(2, "0")}</strong>
          <span>{t("attentionSignals")}</span>
        </div>
      </div>
      <VitalAttentionBanner vitals={vitals} />
      <div className="recommendation">
        <span className="recommendation-icon"><MaterialSymbol name="check_circle" size={16} /></span>
        <div>
          <strong>{t("preventiveRecommendation")}</strong>
          <p>{recommendation}</p>
        </div>
      </div>
      {hasAlerts && (
        <ul className="active-alerts" aria-label={t("alertsActive")}>
          {assessment.active_alerts.map((alert) => <li key={alert}>{alert}</li>)}
        </ul>
      )}
      <p className="engine-note">{t("engineNote")}</p>
    </section>
  );
}
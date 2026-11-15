import { MaterialSymbol } from "@/components/MaterialSymbol";
import type { TelemetryResponse } from "@/services/mockData";
import { StatusPill } from "@/components/StatusPill";
import { useLanguage } from "@/components/LanguageProvider";

export function SmartMirrorPanel({ mirror }: { mirror: TelemetryResponse["data"]["smart_mirror_vision"] }) {
  const { locale, t } = useLanguage();
  const captureTime = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(new Date(mirror.capture_timestamp));

  return (
    <section className="panel mirror-panel" id="espejo" aria-labelledby="mirror-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{t("visualIndicators")}</p>
          <h2 id="mirror-title">{t("smartMirror")}</h2>
        </div>
        <span className="mirror-mark"><MaterialSymbol name="face" size={18} /></span>
      </div>
      <div className="capture-status">
        <span className={`capture-check ${mirror.quality_gate_passed ? "capture-passed" : "capture-failed"}`} aria-hidden="true">
          {mirror.quality_gate_passed ? <MaterialSymbol name="check" size={15} /> : <MaterialSymbol name="photo_camera" size={15} />}
        </span>
        <div>
          <strong>{mirror.quality_gate_passed ? t("capturePassed") : t("captureFailed")}</strong>
          <span>{t("demoCapture").replace("{time}", captureTime)}</span>
        </div>
      </div>
      <div className="mirror-indicators">
        <div className="mirror-indicator">
          <span className="mirror-indicator-icon"><MaterialSymbol name="face" size={16} /></span>
          <span className="mirror-indicator-label">{t("facialEdema")}</span>
          <strong>{mirror.facial_edema_index}</strong>
          <small>{t("visualIndicatorNoUnit")}</small>
        </div>
        <div className="mirror-indicator">
          <span className="mirror-indicator-icon"><MaterialSymbol name="visibility" size={16} /></span>
          <span className="mirror-indicator-label">{t("palenessColorimetry")}</span>
          <strong>{mirror.paleness_colorimetry_ratio}</strong>
          <small>{t("colorRatioNoUnit")}</small>
        </div>
        <div className="mirror-indicator mirror-indicator-wide">
          <span className="mirror-indicator-icon"><MaterialSymbol name="visibility" size={16} /></span>
          <span className="mirror-indicator-label">{t("ocularFatigue")}</span>
          <strong>{mirror.ocular_fatigue_score === "LOW" ? t("low") : mirror.ocular_fatigue_score}</strong>
          <small>{t("scoreAsRecorded")}</small>
        </div>
      </div>
      <div className="mirror-footer">
        <StatusPill status={mirror.status} />
        <span>{t("noCameraDemo")}</span>
      </div>
    </section>
  );
}
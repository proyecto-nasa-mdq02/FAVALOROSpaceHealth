"use client";

import { MaterialSymbol } from "@/components/MaterialSymbol";
import { StatusPill } from "@/components/StatusPill";
import { useLanguage } from "@/components/LanguageProvider";
import type { HealthStatus, TelemetryResponse, TrendMetric } from "@/services/mockData";
import type { MessageKey } from "@/services/i18n";

interface BodyMapProps {
  vitals: TelemetryResponse["data"]["vitals"];
  selectedMetric: TrendMetric;
  onSelectMetric: (metric: TrendMetric) => void;
}

interface BodyReading {
  metric: TrendMetric;
  area: MessageKey;
  label: MessageKey;
  explanation: MessageKey;
  value: string;
  unit: string;
  status: HealthStatus;
  tone: string;
  icon: string;
}

export function BodyMap({ vitals, selectedMetric, onSelectMetric }: BodyMapProps) {
  const { t } = useLanguage();
  const readings: BodyReading[] = [
    { metric: "heart_rate", area: "vascularHeart", label: "heartRate", explanation: "heartFunction", value: String(vitals.heart_rate.value), unit: vitals.heart_rate.unit, status: vitals.heart_rate.status, tone: "heart", icon: "ecg_heart" },
    { metric: "blood_pressure", area: "vascularArtery", label: "bloodPressure", explanation: "pressureFunction", value: `${vitals.blood_pressure.systolic}/${vitals.blood_pressure.diastolic}`, unit: vitals.blood_pressure.unit, status: vitals.blood_pressure.status, tone: "pressure", icon: "blood_pressure" },
    { metric: "spo2", area: "siteNail", label: "oxygen", explanation: "oxygenFunction", value: String(vitals.spo2.value), unit: vitals.spo2.unit, status: vitals.spo2.status, tone: "oxygen", icon: "air" },
    { metric: "body_temperature", area: "bodyAreaTemperature", label: "temperature", explanation: "temperatureFunction", value: String(vitals.body_temperature.value), unit: "°C", status: vitals.body_temperature.status, tone: "temperature", icon: "device_thermostat" },
    { metric: "blood_glucose", area: "vascularVein", label: "glucose", explanation: "bloodSampleFunction", value: String(vitals.blood_glucose.value), unit: vitals.blood_glucose.unit, status: vitals.blood_glucose.status, tone: "glucose", icon: "water_drop" },
  ];
  const selected = readings.find((reading) => reading.metric === selectedMetric) ?? readings[0];
  const selectedRegion = selected.metric === "heart_rate" ? "heart" : selected.metric === "blood_pressure" ? "arteries" : selected.metric === "spo2" ? "lungs" : selected.metric === "body_temperature" ? "whole" : "none";

  return (
    <section className="body-map-panel" aria-labelledby="body-map-title">
      <header className="body-map-heading">
        <div>
          <p className="eyebrow">{t("bodyMapTitle")}</p>
          <h2 id="body-map-title">{t("bodyMapIntro")}</h2>
        </div>
      </header>
      <div className="body-map-layout">
        <nav className="body-area-list" aria-label={t("bodyMapTitle")}>
          {readings.filter((reading) => reading.metric !== "spo2").map((reading) => (
            <button
              className={`body-area-option body-area-option-${reading.tone} ${selectedMetric === reading.metric ? "body-area-option-selected" : ""}`}
              key={reading.metric}
              type="button"
              aria-pressed={selectedMetric === reading.metric}
              onClick={() => onSelectMetric(reading.metric)}
            >
              <span className="body-area-option-top"><strong>{t(reading.area)}</strong><StatusPill status={reading.status} /></span>
              <span className="body-area-option-reading">{reading.value} <small>{reading.unit}</small></span>
            </button>
          ))}
        </nav>
        <div className={`body-map-figure body-map-region-${selectedRegion}`}>
          <svg className="body-anatomy-svg" viewBox="0 0 260 460" role="img" aria-label={t("bodyMapDiagramLabel")}>
            <defs>
              <pattern id="body-map-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#dbe4eb" strokeWidth=".7" strokeDasharray="2 2" />
              </pattern>
            </defs>
            <rect x="10" y="6" width="240" height="448" rx="12" fill="url(#body-map-grid)" opacity=".72" />
            <g className="anatomy-silhouette">
              {/* A separate head and neck make the figure read clearly as a person. */}
              <path d="M130 15 C112 15 103 29 103 48 C103 65 113 78 123 82 L123 91 L137 91 L137 82 C147 78 157 65 157 48 C157 29 148 15 130 15 Z" />
              <path d="M119 91 L89 101 C77 105 70 116 66 130 L46 218 C44 227 48 234 55 236 C62 238 67 233 69 225 L87 151 L93 151 L93 225 L86 318 L82 414 C81 425 87 434 96 434 C104 434 109 427 110 417 L119 319 L125 254 L135 254 L141 319 L150 417 C151 427 156 434 164 434 C173 434 179 425 178 414 L174 318 L167 225 L167 151 L173 151 L191 225 C193 233 198 238 205 236 C212 234 216 227 214 218 L194 130 C190 116 183 105 171 101 L141 91 Z" />
            </g>
            <g className={`anatomy-veins ${selectedRegion === "lungs" ? "anatomy-region-emphasis" : ""}`}>
              <path d="M122 48 L124 128 M138 48 L136 128 M124 106 L82 116 L58 214 M136 106 L178 116 L202 214 M127 148 L127 236 L104 312 L94 412 M127 236 L156 312 L166 412" />
            </g>
            <g className={`anatomy-arteries ${selectedRegion === "arteries" ? "anatomy-region-emphasis" : ""}`}>
              <path d="M127 115 L126 38 M133 115 L134 38 M132 126 C132 110 139 109 139 124 L133 234 M127 114 L86 120 L62 218 M138 114 L174 120 L198 218 M133 182 L113 186 M133 182 L150 186 M133 234 L109 314 L98 414 M133 234 L151 314 L162 414" />
            </g>
            <g className={selectedRegion === "lungs" ? "anatomy-region-emphasis" : ""}>
              <path className="anatomy-lungs" d="M114 126 Q104 122 101 134 M114 134 Q102 138 100 148 M146 126 Q156 122 159 134 M146 134 Q158 138 160 148" />
            </g>
            <path className={`anatomy-heart ${selectedRegion === "heart" ? "anatomy-region-emphasis" : ""}`} d="M133 123 C127 118 119 122 119 131 C119 140 128 148 135 154 C141 149 146 141 145 132 C144 123 137 120 133 123 Z" />
            <g className="anatomy-callouts" aria-hidden="true">
              <path className={selectedRegion === "heart" ? "anatomy-callout-active" : ""} d="M136 136 L188 136 L211 119" />
              <circle className={selectedRegion === "heart" ? "anatomy-node-active" : ""} cx="136" cy="136" r="3" />
              <path className={selectedRegion === "arteries" ? "anatomy-callout-active" : ""} d="M134 182 L188 182 L211 199" />
              <circle className={selectedRegion === "arteries" ? "anatomy-node-active" : ""} cx="134" cy="182" r="3" />
              <path className={selectedRegion === "lungs" ? "anatomy-callout-active" : ""} d="M151 138 L82 138 L58 126" />
              <circle className={selectedRegion === "lungs" ? "anatomy-node-active" : ""} cx="151" cy="138" r="3" />
              <path className={selectedRegion === "whole" ? "anatomy-callout-active" : ""} d="M130 256 L73 256 L51 270" />
              <circle className={selectedRegion === "whole" ? "anatomy-node-active" : ""} cx="130" cy="256" r="3" />
            </g>
            <g className="anatomy-measurement-sites">
              {[
                { metric: "body_temperature" as const, x: 107, y: 48, label: "siteTemporal" as MessageKey },
                { metric: "heart_rate" as const, x: 136, y: 137, label: "siteChest" as MessageKey },
                { metric: "blood_pressure" as const, x: 74, y: 164, label: "siteUpperArm" as MessageKey },
                { metric: "blood_glucose" as const, x: 51, y: 231, label: "siteFingertip" as MessageKey },
                { metric: "heart_rate" as const, x: 194, y: 226, label: "siteWrist" as MessageKey },
                { metric: "spo2" as const, x: 207, y: 231, label: "siteNail" as MessageKey },
              ].map((site: { metric: TrendMetric; x: number; y: number; label: MessageKey }) => (
                <g
                  key={site.label}
                  className={`anatomy-site ${selectedMetric === site.metric ? "anatomy-site-selected" : ""}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${t(site.label)}: ${t(site.metric === "heart_rate" ? "heartRate" : site.metric === "blood_pressure" ? "bloodPressure" : site.metric === "body_temperature" ? "temperature" : site.metric === "blood_glucose" ? "glucose" : "oxygen")}`}
                  onClick={() => onSelectMetric(site.metric)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelectMetric(site.metric);
                    }
                  }}
                >
                  <circle className="anatomy-site-halo" cx={site.x} cy={site.y} r="8" />
                  <circle className="anatomy-site-dot" cx={site.x} cy={site.y} r="3.5" />
                  <title>{t(site.label)}</title>
                </g>
              ))}
            </g>
          </svg>
        </div>
        <article className={`body-map-detail body-map-detail-${selected.tone}`} aria-live="polite">
          <div className="body-map-detail-top">
            <span className="body-map-detail-icon"><MaterialSymbol name={selected.icon} size={20} /></span>
            <div><p className="eyebrow">{t(selected.area)}</p><h3>{t(selected.label)}</h3></div>
            <StatusPill status={selected.status} />
          </div>
          <p className="body-map-explanation">{t(selected.explanation)}</p>
          <p className="body-map-note">{t("bodyMapStatusNote")}</p>
        </article>
      </div>
    </section>
  );
}

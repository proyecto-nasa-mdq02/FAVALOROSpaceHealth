"use client";

import { DEFAULT_THRESHOLD_RULES, type ThresholdKey, type ThresholdRule, evaluateBloodPressureStatus, evaluateMetricStatus } from "@/data/kpiData";
import { useLanguage } from "@/components/LanguageProvider";
import type { MessageKey } from "@/services/i18n";

interface VitalSignsPanelProps {
  vitals: {
    heart_rate: { value: number; unit: string; status: string };
    spo2: { value: number; unit: string; status: string };
    blood_pressure: { systolic: number; diastolic: number; unit: string; status: string };
    body_temperature: { value: number; unit: string; status: string };
    blood_glucose: { value: number; unit: string; status: string };
  };
  selectedMetric: string;
  onSelectMetric: (metric: string) => void;
}

interface VitalCard {
  key: string;
  regionId: string;
  code: string;
  name: string;
  valueDisplay: string;
  unit: string;
  deltaText: string;
  status: { level: "normal" | "warning" | "critical"; label: string };
  rule: ThresholdRule;
  numericValue: number;
  formatTick: (n: number) => string;
}

interface VerticalGaugeProps {
  value: number;
  rule: ThresholdRule;
  formatTick: (n: number) => string;
}

const VerticalGraduatedScale: React.FC<VerticalGaugeProps> = ({ value, rule, formatTick }) => {
  const safeRule = rule ?? { min: 0, max: 100, optimal: 50 };
  const clampPct = (val: number) => {
    const pct = ((val - safeRule.min) / (safeRule.max - safeRule.min)) * 100;
    return Math.min(98, Math.max(2, pct));
  };

  const currentBottomPct = clampPct(value);
  const maxBottomPct = clampPct(safeRule.max);
  const optBottomPct = clampPct(safeRule.optimal);
  const minBottomPct = clampPct(safeRule.min);

  const ticks = Array.from({ length: 13 }, (_, idx) => idx);

  return (
    <div className="flex items-center gap-2.5 select-none" aria-hidden="true">
      <div className="relative h-36 w-10 font-mono text-[10px] leading-none text-slate-500 tabular-nums text-right">
        <span
          className="absolute right-0 -translate-y-1/2 font-medium text-rose-700"
          style={{ bottom: `${maxBottomPct}%` }}
        >
          {formatTick(safeRule.max)}
        </span>
        <span
          className="absolute right-0 -translate-y-1/2 font-medium text-emerald-700"
          style={{ bottom: `${optBottomPct}%` }}
        >
          {formatTick(safeRule.optimal)}
        </span>
        <span
          className="absolute right-0 -translate-y-1/2 font-medium text-rose-700"
          style={{ bottom: `${minBottomPct}%` }}
        >
          {formatTick(safeRule.min)}
        </span>
      </div>

      <div className="relative h-36 w-5 rounded bg-slate-100 border border-slate-200 overflow-visible">
        <div
          className="absolute inset-x-0 bg-emerald-100/80"
          style={{
            bottom: `${minBottomPct}%`,
            height: `${Math.max(4, maxBottomPct - minBottomPct)}%`,
          }}
        />

        {ticks.map((t) => (
          <div
            key={t}
            className="absolute left-0 right-1 h-px bg-slate-300"
            style={{ bottom: `${(t / (ticks.length - 1)) * 100}%` }}
          />
        ))}

        <div
          className="absolute -right-2 -translate-y-1/2 w-0 h-0 border-y-[4px] border-y-transparent border-r-[6px] border-r-rose-600"
          style={{ bottom: `${maxBottomPct}%` }}
        />
        <div
          className="absolute -right-2 -translate-y-1/2 w-0 h-0 border-y-[4px] border-y-transparent border-r-[6px] border-r-emerald-600"
          style={{ bottom: `${optBottomPct}%` }}
        />
        <div
          className="absolute -right-2 -translate-y-1/2 w-0 h-0 border-y-[4px] border-y-transparent border-r-[6px] border-r-rose-600"
          style={{ bottom: `${minBottomPct}%` }}
        />

        <div
          className="absolute -left-1 -right-1 h-1 -translate-y-1/2 rounded-full bg-slate-900 shadow-xs transition-all duration-300"
          style={{ bottom: `${clampPct(value)}%` }}
        />
      </div>
    </div>
  );
};

export const VitalSignsPanel: React.FC<VitalSignsPanelProps> = ({ vitals, selectedMetric, onSelectMetric }) => {
  const { t } = useLanguage();

  const hrValue = vitals?.heart_rate?.value ?? 72;
  const spo2Value = vitals?.spo2?.value ?? 98;
  const bpSystolic = vitals?.blood_pressure?.systolic ?? 116;
  const bpDiastolic = vitals?.blood_pressure?.diastolic ?? 76;
  const tempValue = vitals?.body_temperature?.value ?? 36.6;
  const glucValue = vitals?.blood_glucose?.value ?? 92;

  const rules = DEFAULT_THRESHOLD_RULES;

  const bpStatus = evaluateBloodPressureStatus(bpSystolic, bpDiastolic, rules.systolic, rules.diastolic);
  const hrStatus = evaluateMetricStatus(hrValue, rules.heart_rate);
  const glucStatus = evaluateMetricStatus(glucValue, rules.blood_glucose);
  const tempStatus = evaluateMetricStatus(tempValue, rules.body_temperature);

  const formatDelta = (delta: number, decimals = 0, unit = '') => {
    const sign = delta > 0 ? '+' : '';
    return `${sign}${delta.toFixed(decimals)}${unit ? ` ${unit}` : ''}`;
  };

  const statusPresentation = (level: "normal" | "warning" | "critical", label: string) => {
    if (level === "critical") {
      return { glyph: "✖", colorClass: "text-rose-700", text: label };
    }
    if (level === "warning") {
      return { glyph: "▲", colorClass: "text-amber-700", text: label };
    }
    return { glyph: "●", colorClass: "text-emerald-700", text: label };
  };

  const cards: VitalCard[] = [
    {
      key: "bloodPressure",
      regionId: "arteria",
      code: "PA",
      name: "Presión Arterial",
      valueDisplay: `${bpSystolic}/${bpDiastolic}`,
      unit: "mmHg",
      deltaText: `${formatDelta(bpSystolic - (vitals?.blood_pressure?.systolic ?? 116))} / ${formatDelta(bpDiastolic - (vitals?.blood_pressure?.diastolic ?? 76))} vs ant.`,
      status: bpStatus,
      rule: rules.systolic,
      numericValue: bpSystolic,
      formatTick: (n) => `${Math.round(n)}`,
    },
    {
      key: "heartRate",
      regionId: "corazon",
      code: "FC",
      name: "Frecuencia Cardíaca",
      valueDisplay: `${hrValue}`,
      unit: "lpm",
      deltaText: `${formatDelta(hrValue - (vitals?.heart_rate?.value ?? 72), 0, "lpm")} vs ant.`,
      status: hrStatus,
      rule: rules.heart_rate,
      numericValue: hrValue,
      formatTick: (n) => `${Math.round(n)}`,
    },
    {
      key: "glucose",
      regionId: "vena",
      code: "Gluc.",
      name: "Glucosa",
      valueDisplay: `${glucValue}`,
      unit: "mg/dL",
      deltaText: `${formatDelta(glucValue - (vitals?.blood_glucose?.value ?? 92), 0, "mg/dL")} vs ant.`,
      status: glucStatus,
      rule: rules.blood_glucose,
      numericValue: glucValue,
      formatTick: (n) => `${Math.round(n)}`,
    },
    {
      key: "temperature",
      regionId: "capilar",
      code: "T°",
      name: "Temperatura",
      valueDisplay: tempValue.toFixed(1).replace(".", ","),
      unit: "°C",
      deltaText: `${formatDelta(tempValue - (vitals?.body_temperature?.value ?? 36.6), 1, "°C")} vs ant.`,
      status: tempStatus,
      rule: rules.body_temperature,
      numericValue: tempValue,
      formatTick: (n) => n.toFixed(1).replace(".", ","),
    },
  ];

  return (
    <section
      aria-labelledby="vital-signs-heading"
      className="rounded-xl border border-slate-200 bg-white"
    >
      <div className="flex flex-col gap-1 border-b border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="vital-signs-heading" className="font-display text-base font-semibold text-slate-900">
            Signos vitales en tiempo real
          </h2>
          <p className="text-xs text-slate-500">
            Escalas calibradas con umbrales de alerta · Haz clic en un parámetro para ver su curva
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>
            <span className="text-emerald-700 font-semibold">●</span> Óptimo
          </span>
          <span>
            <span className="text-amber-700 font-semibold">▲</span> Fuera de meta
          </span>
          <span>
            <span className="text-rose-700 font-semibold">✖</span> Crítico
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 divide-y divide-slate-200 sm:grid-cols-2 sm:divide-y-0">
        {cards.map((card, index) => {
          const isSelected = selectedMetric === card.key;
          const st = statusPresentation(card.status.level, card.status.label);
          const borderClasses = [
            index < 2 ? 'sm:border-b sm:border-slate-200' : '',
            index % 2 === 0 ? 'sm:border-r sm:border-slate-200' : '',
          ].join(' ');

          return (
            <button
              key={card.key}
              type="button"
              onClick={() => onSelectMetric(card.key)}
              className={`flex items-center justify-between gap-4 p-5 text-left transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-sky-600 ${borderClasses} ${
                isSelected ? 'bg-sky-50/55' : 'hover:bg-slate-50/70'
              }`}
            >
              <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold tracking-wide text-slate-500">
                      {card.code} · {card.name}
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-baseline gap-1.5">
                    <span className="font-mono text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
                      {card.valueDisplay}
                    </span>
                    <span className="font-mono text-xs text-slate-500">{card.unit}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-1">
                  <div className={`text-xs font-semibold ${st.colorClass}`}>
                    <span aria-hidden="true" className="mr-1">
                      {st.glyph}
                    </span>
                    {st.text}
                  </div>
                  <div className="font-mono text-[11px] text-slate-500 tabular-nums">
                    {card.deltaText}
                  </div>
                </div>
              </div>

              <VerticalGraduatedScale
                value={card.numericValue}
                rule={card.rule}
                formatTick={card.formatTick}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default VitalSignsPanel;

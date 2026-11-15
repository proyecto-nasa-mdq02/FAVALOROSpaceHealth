"use client";

import { DEFAULT_THRESHOLD_RULES, type ThresholdRule } from "@/data/kpiData";
import type { MessageKey } from "@/services/i18n";
import type { TrendMetric } from "@/services/mockData";

interface DailySummaryKPIPanelProps {
  vitals: {
    heart_rate: { value: number; unit: string; status: string };
    spo2: { value: number; unit: string; status: string };
    blood_pressure: { systolic: number; diastolic: number; unit: string; status: string };
    body_temperature: { value: number; unit: string; status: string };
    blood_glucose: { value: number; unit: string; status: string };
  };
  dailyKpi: {
    timeInRangePct: number;
    timeInRangeDelta: number;
    avgHeartRate: number;
    hrvMs: number;
    avgGlucose: number;
    glucosePeak: number;
    meanTemperature: number;
    readingsCount: number;
    readingsTarget: number;
  };
}

export function DailySummaryKPIPanel({ vitals, dailyKpi }: DailySummaryKPIPanelProps) {
  const thermalDelta = Number((vitals.body_temperature.value - DEFAULT_THRESHOLD_RULES.body_temperature.optimal).toFixed(1));
  const thermalDeltaText = `${thermalDelta >= 0 ? "+" : ""}${thermalDelta.toFixed(1)} °C vs basal`;

  const complianceRatio = Math.round((dailyKpi.readingsCount / dailyKpi.readingsTarget) * 100);
  const rangeGood = dailyKpi.timeInRangePct >= 85;
  const glucoseGood = dailyKpi.avgGlucose <= DEFAULT_THRESHOLD_RULES.blood_glucose.max;

  return (
    <section id="resumen" aria-labelledby="daily-summary-heading" className="rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-col gap-1 border-b border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="daily-summary-heading" className="font-display text-base font-semibold text-slate-900">
            Resumen diario e indicadores clave
          </h2>
          <p className="text-xs text-slate-500">
            Consolidado de las últimas 24 horas según umbrales personalizados del paciente
          </p>
        </div>
        <div className="text-xs text-slate-500 font-mono tabular-nums">
          Controles registrados: {dailyKpi.readingsCount}/{dailyKpi.readingsTarget} ({complianceRatio}%)
        </div>
      </div>

      <div className="grid grid-cols-1 divide-y divide-slate-200 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
        {/* KPI 1: Tiempo en Rango Objetivo */}
        <div className="p-5 sm:border-b sm:border-slate-200 lg:border-b-0">
          <div className="text-xs font-medium text-slate-500">Tiempo en rango objetivo</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
              {dailyKpi.timeInRangePct}%
            </span>
            <span className={`font-mono text-xs font-medium tabular-nums ${dailyKpi.timeInRangeDelta >= 0 ? "text-emerald-700" : "text-amber-700"}`}>
              {dailyKpi.timeInRangeDelta >= 0 ? "▲ +" : "▼ "}{(dailyKpi.timeInRangeDelta ?? 0).toFixed(1)}% vs ayer
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-300 ${rangeGood ? "bg-emerald-600" : "bg-amber-500"}`}
              style={{ width: `${Math.min(100, Math.max(0, dailyKpi.timeInRangePct))}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {rangeGood ? "Estabilidad clínica óptima" : "Requiere ajuste de seguimiento"}
          </p>
        </div>

        {/* KPI 2: Frecuencia Cardíaca y VFC */}
        <div className="p-5 sm:border-b sm:border-l sm:border-slate-200 lg:border-b-0 lg:border-l-0">
          <div className="text-xs font-medium text-slate-500">Frecuencia cardíaca media</div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
              {dailyKpi.avgHeartRate}
            </span>
            <span className="font-mono text-xs uppercase text-slate-400">lpm</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
            <span>Variabilidad (VFC):</span>
            <span className="font-mono font-semibold text-slate-900 tabular-nums">{dailyKpi.hrvMs}</span>
            <span className="text-xs text-slate-400">ms</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Rango objetivo: {DEFAULT_THRESHOLD_RULES.heart_rate.min}–{DEFAULT_THRESHOLD_RULES.heart_rate.max} lpm
          </p>
        </div>

        {/* KPI 3: Control Glucémico */}
        <div className="p-5">
          <div className="text-xs font-medium text-slate-500">Balance glucémico diario</div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
              {dailyKpi.avgGlucose}
            </span>
            <span className="font-mono text-xs uppercase text-slate-400">mg/dL</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
            <span>Pico 24h:</span>
            <span className={`font-mono font-medium tabular-nums ${glucoseGood ? "text-slate-900" : "text-amber-700"}`}>
              {dailyKpi.glucosePeak} mg/dL
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {glucoseGood ? "Control glucémico dentro de meta" : "Pico postprandial sobre límite"}
          </p>
        </div>

        {/* KPI 4: Estabilidad Térmica y Cumplimiento */}
        <div className="p-5 sm:border-l sm:border-slate-200 lg:border-l-0">
          <div className="text-xs font-medium text-slate-500">Estabilidad térmica y SpO₂</div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
              {dailyKpi.meanTemperature.toFixed(1)}
            </span>
            <span className="font-mono text-xs uppercase text-slate-400">°C media</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
            <span>Desviación actual:</span>
            <span className="font-mono font-medium text-slate-900 tabular-nums">{thermalDeltaText}</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Saturación periférica actual: <span className="font-mono tabular-nums">{vitals.spo2.value}%</span>
          </p>
        </div>
      </div>
    </section>
  );
}

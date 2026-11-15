import React from 'react';

interface MedicalKpiSummaryProps {
  dailyKpi: any;
  rules: any;
  currentValues: any;
}

export const MedicalKpiSummary: React.FC<MedicalKpiSummaryProps> = ({
  dailyKpi,
  rules,
  currentValues,
}) => {
  const complianceRatio = Math.round((dailyKpi.readingsCount / dailyKpi.readingsTarget) * 100);
  const thermalDelta = Number((currentValues.temperature - rules.body_temperature.optimal).toFixed(1));
  const thermalDeltaText = `${thermalDelta >= 0 ? '+' : ''}${thermalDelta.toFixed(1)} °C vs basal`;
  const rangeGood = dailyKpi.timeInRangePct >= 85;
  const glucoseGood = dailyKpi.avgGlucose <= rules.blood_glucose.max;

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-1 border-b border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-base font-semibold text-slate-900">
            Resumen Clínico Diario
          </h2>
          <p className="text-xs text-slate-500">Indicadores consolidados (últimas 24h)</p>
        </div>
        <div className="text-xs text-slate-500 font-mono tabular-nums">
          Registros: {dailyKpi.readingsCount}/{dailyKpi.readingsTarget} ({complianceRatio}%)
        </div>
      </div>

      <div className="grid grid-cols-1 divide-y divide-slate-200 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
        {/* KPI 1: Tiempo en Rango */}
        <div className="p-5">
          <div className="text-xs font-medium text-slate-500">Tiempo en rango objetivo</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-semibold text-slate-900 tabular-nums">
              {dailyKpi.timeInRangePct}%
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${rangeGood ? 'bg-emerald-600' : 'bg-amber-500'}`}
              style={{ width: `${Math.min(100, dailyKpi.timeInRangePct)}%` }}
            />
          </div>
        </div>

        {/* KPI 2: Cardiaco */}
        <div className="p-5">
          <div className="text-xs font-medium text-slate-500">FC Media</div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-semibold text-slate-900 tabular-nums">
              {dailyKpi.avgHeartRate}
            </span>
            <span className="font-mono text-xs uppercase text-slate-400">lpm</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">VFC: {dailyKpi.hrvMs} ms</p>
        </div>

        {/* KPI 3: Glucémico */}
        <div className="p-5">
          <div className="text-xs font-medium text-slate-500">Glucemia Media</div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-semibold text-slate-900 tabular-nums">
              {dailyKpi.avgGlucose}
            </span>
            <span className="font-mono text-xs uppercase text-slate-400">mg/dL</span>
          </div>
          <p className={`mt-2 text-xs ${glucoseGood ? 'text-emerald-600' : 'text-amber-700'}`}>
            Pico: {dailyKpi.glucosePeak} mg/dL
          </p>
        </div>

        {/* KPI 4: Térmico */}
        <div className="p-5">
          <div className="text-xs font-medium text-slate-500">Estabilidad Térmica</div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-semibold text-slate-900 tabular-nums">
              {dailyKpi.meanTemperature.toFixed(1)}
            </span>
            <span className="font-mono text-xs uppercase text-slate-400">°C</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Desviación: {thermalDeltaText}</p>
        </div>
      </div>
    </section>
  );
};

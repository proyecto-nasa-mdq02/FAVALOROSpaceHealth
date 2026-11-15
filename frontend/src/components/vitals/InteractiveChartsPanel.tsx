"use client";

import { useMemo, useState, type MouseEvent as ReactMouseEvent } from "react";
import { DEFAULT_THRESHOLD_RULES, evaluateMetricStatus, type ThresholdRule } from "@/data/kpiData";
import type { MockTrendPoint } from "@/services/mockData";

export interface InteractiveChartsPanelProps {
  trends: MockTrendPoint[];
  selectedMetric: string;
  onChangeMetric: (metric: string) => void;
  className?: string;
}

type ChartMetricKey = "bloodPressure" | "heartRate" | "glucose" | "temperature";

interface ChartMetricMeta {
  key: ChartMetricKey;
  label: string;
  title: string;
  unit: string;
  primaryColor: string;
  secondaryColor: string | null;
  rule: ThresholdRule;
  decimals: number;
}

const CHART_METRICS: ChartMetricMeta[] = [
  {
    key: "bloodPressure",
    label: "PA",
    title: "Presión Arterial (Sistólica / Diastólica)",
    unit: "mmHg",
    primaryColor: "#0284c7",
    secondaryColor: "#64748b",
    rule: DEFAULT_THRESHOLD_RULES.systolic,
    decimals: 0,
  },
  {
    key: "heartRate",
    label: "FC",
    title: "Frecuencia Cardíaca (FC)",
    unit: "lpm",
    primaryColor: "#e11d48",
    secondaryColor: null,
    rule: DEFAULT_THRESHOLD_RULES.heart_rate,
    decimals: 0,
  },
  {
    key: "glucose",
    label: "Gluc.",
    title: "Glucosa Capilar (Gluc.)",
    unit: "mg/dL",
    primaryColor: "#0d9488",
    secondaryColor: null,
    rule: DEFAULT_THRESHOLD_RULES.blood_glucose,
    decimals: 0,
  },
  {
    key: "temperature",
    label: "T°",
    title: "Temperatura Corporal (T°)",
    unit: "°C",
    primaryColor: "#d97706",
    secondaryColor: null,
    rule: DEFAULT_THRESHOLD_RULES.body_temperature,
    decimals: 1,
  },
];

const CHART_KEY_ALIASES: Record<string, ChartMetricKey> = {
  heartrate: "heartRate",
  fc: "heartRate",
  bloodpressure: "bloodPressure",
  systolic: "bloodPressure",
  glucose: "glucose",
  bloodglucose: "glucose",
  temperature: "temperature",
  bodytemperature: "temperature",
};

const resolveChartMetric = (metric: string): ChartMetricKey =>
  CHART_KEY_ALIASES[metric.toLowerCase().replace(/[^a-z]/g, "")] ?? "heartRate";

export function InteractiveChartsPanel({ trends, selectedMetric, onChangeMetric, className }: InteractiveChartsPanelProps) {
  const [timeRange, setTimeRange] = useState<"6h" | "12h" | "24h" | "7d">("24h");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const activeMetricKey = resolveChartMetric(selectedMetric);
  const meta = CHART_METRICS.find((m) => m.key === activeMetricKey) ?? CHART_METRICS[1];

  const chartData: MockTrendPoint[] = useMemo(() => {
    if (timeRange === "6h") return trends.slice(-6);
    if (timeRange === "12h") return trends.slice(-12);
    return trends;
  }, [trends, timeRange]);

  const metricValues = useMemo(() => {
    return chartData.map((pt) => {
      switch (meta.key) {
        case "bloodPressure":
          return pt.systolic;
        case "heartRate":
          return pt.heart_rate;
        case "glucose":
          return pt.blood_glucose;
        case "temperature":
          return pt.body_temperature;
        default:
          return pt.heart_rate;
      }
    });
  }, [chartData, meta.key]);

  const stats = useMemo(() => {
    const minPrim = Math.min(...metricValues);
    const maxPrim = Math.max(...metricValues);
    const avgPrim = metricValues.reduce((acc, v) => acc + v, 0) / (metricValues.length || 1);
    return { min: minPrim, avg: avgPrim, max: maxPrim };
  }, [metricValues]);

  const { yMin, yMax } = useMemo(() => {
    const allVals = [...metricValues, meta.rule.min, meta.rule.max];
    const rawMin = Math.min(...allVals);
    const rawMax = Math.max(...allVals);
    const margin = meta.key === "temperature" ? 0.5 : Math.max(8, (rawMax - rawMin) * 0.15);

    const minVal =
      meta.key === "temperature" ? Number((rawMin - margin).toFixed(1)) : Math.floor((rawMin - margin) / 5) * 5;
    const maxVal =
      meta.key === "temperature" ? Number((rawMax + margin).toFixed(1)) : Math.ceil((rawMax + margin) / 5) * 5;

    const finalMin = minVal;
    const finalMax = maxVal === minVal ? minVal + 10 : maxVal;

    return { yMin: finalMin, yMax: finalMax };
  }, [metricValues, meta]);

  const width = 760;
  const height = 270;
  const pad = { top: 20, right: 20, bottom: 32, left: 48 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const xPos = (index: number) => {
    if (chartData.length <= 1) return pad.left + plotW / 2;
    return pad.left + (index / (chartData.length - 1)) * plotW;
  };

  const yPos = (val: number) => {
    const ratio = (val - yMin) / (yMax - yMin);
    return pad.top + plotH - ratio * plotH;
  };

  const buildPolyline = (vals: number[]) =>
    vals.map((v, i) => `${xPos(i).toFixed(1)},${yPos(v).toFixed(1)}`).join(" ");

  const buildAreaPath = (vals: number[]) => {
    if (vals.length === 0) return "";
    const linePoints = vals.map((v, i) => `${xPos(i).toFixed(1)} ${yPos(v).toFixed(1)}`).join(" L ");
    const lastX = xPos(vals.length - 1).toFixed(1);
    const firstX = xPos(0).toFixed(1);
    const baseY = (pad.top + plotH).toFixed(1);
    return `M ${linePoints} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;
  };

  const safeBandTop = Math.max(pad.top, yPos(meta.rule.max));
  const safeBandBottom = Math.min(pad.top + plotH, yPos(meta.rule.min));
  const safeBandHeight = Math.max(0, safeBandBottom - safeBandTop);

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => {
    const val = yMin + t * (yMax - yMin);
    return {
      val,
      label: meta.key === "temperature" ? val.toFixed(1) : Math.round(val).toString(),
      y: yPos(val),
    };
  });

  const activeIdx = hoverIndex !== null && hoverIndex < chartData.length ? hoverIndex : chartData.length - 1;
  const activePoint = chartData[activeIdx];
  const activeValue = metricValues[activeIdx] ?? metricValues[metricValues.length - 1];
  const activeStatus = useMemo(
    () => evaluateMetricStatus(activeValue, meta.rule),
    [activeValue, meta]
  );

  const handleSvgMouseMove = (e: ReactMouseEvent<SVGSVGElement>) => {
    if (chartData.length <= 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * width;
    const clampedX = Math.min(pad.left + plotW, Math.max(pad.left, relX));
    const idx = Math.round(((clampedX - pad.left) / plotW) * (chartData.length - 1));
    setHoverIndex(Math.min(chartData.length - 1, Math.max(0, idx)));
  };

  const metricTabs: { key: ChartMetricKey; label: string }[] = CHART_METRICS.map((m) => ({
    key: m.key,
    label: m.label,
  }));

  const rangeTabs: { key: "6h" | "12h" | "24h" | "7d"; label: string }[] = [
    { key: "6h", label: "6H" },
    { key: "12h", label: "12H" },
    { key: "24h", label: "24H" },
    { key: "7d", label: "7D" },
  ];

  const formatMetricValue = (value: number) => {
    switch (meta.key) {
      case "bloodPressure":
        return `${Math.round(value)} mmHg`;
      case "heartRate":
        return `${Math.round(value)} lpm`;
      case "glucose":
        return `${Math.round(value)} mg/dL`;
      default:
        return `${value.toFixed(1)} °C`;
    }
  };

  const xLabelStride = chartData.length > 14 ? 4 : chartData.length > 8 ? 2 : 1;

  return (
    <section
      id="tendencias"
      aria-labelledby="charts-panel-heading"
      className={`rounded-xl border border-slate-200 bg-white ${className || ""}`}
    >
      {/* Header + Controls */}
      <div className="flex flex-col gap-3 border-b border-slate-200 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 id="charts-panel-heading" className="font-display text-base font-semibold text-slate-900">
            Tendencias interactivas · {meta.title}
          </h2>
          <p className="text-xs text-slate-500">
            Franja verde indica el rango objetivo personalizado ({meta.rule.min}–{meta.rule.max} {meta.unit})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Metric Segmented Control */}
          <div
            role="tablist"
            aria-label="Seleccionar signo vital en el gráfico"
            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1"
          >
            {metricTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={activeMetricKey === tab.key}
                onClick={() => onChangeMetric(tab.key)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  activeMetricKey === tab.key
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Time Range Segmented Control */}
          <div
            role="tablist"
            aria-label="Seleccionar ventana temporal"
            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 p-1"
          >
            {rangeTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={timeRange === tab.key}
                onClick={() => {
                  setTimeRange(tab.key);
                  setHoverIndex(null);
                }}
                className={`rounded-md px-2.5 py-1.5 font-mono text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  timeRange === tab.key
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Inspected Point Readout HUD */}
      {activePoint && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-6 py-2.5 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-medium text-slate-500">
              {hoverIndex !== null ? "Punto inspeccionado:" : "Lectura más reciente:"}
            </span>
            <span className="font-mono font-semibold text-slate-900 tabular-nums">
              {activePoint.time}
            </span>
            <span aria-hidden="true" className="text-slate-300">
              |
            </span>
            <span className="font-mono text-sm font-semibold text-slate-900 tabular-nums">
              {formatMetricValue(activeValue)}
            </span>
            <span
              className={`font-medium ${
                activeStatus.level === "critical"
                  ? "text-rose-700"
                  : activeStatus.level === "warning"
                    ? "text-amber-700"
                    : "text-emerald-700"
              }`}
            >
              {activeStatus.level === "critical" ? "✖" : activeStatus.level === "warning" ? "▲" : "●"}{" "}
              {activeStatus.label}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-3 bg-sky-600" />
              Sistólica
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-3 border-t-2 border-dashed border-slate-500" />
              Diastólica
            </span>
          </div>
        </div>
      )}

      {/* Interactive SVG Canvas */}
      <div className="px-4 pt-4 pb-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto cursor-crosshair select-none"
          onMouseMove={handleSvgMouseMove}
          onMouseLeave={() => setHoverIndex(null)}
          role="img"
          aria-label={`Gráfico interactivo de ${meta.title}`}
        >
          <defs>
            <linearGradient id="primaryAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={meta.primaryColor} stopOpacity="0.16" />
              <stop offset="100%" stopColor={meta.primaryColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Lines & Y-Axis Labels */}
          {yTicks.map((tick, idx) => (
            <g key={idx}>
              <line
                x1={pad.left}
                y1={tick.y}
                x2={pad.left + plotW}
                y2={tick.y}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
              <text
                x={pad.left - 8}
                y={tick.y + 3.5}
                textAnchor="end"
                className="fill-slate-400 font-mono text-[10px] tabular-nums"
              >
                {tick.label}
              </text>
            </g>
          ))}

          {/* Target Range Shaded Band */}
          {safeBandHeight > 0 && (
            <rect
              x={pad.left}
              y={safeBandTop}
              width={plotW}
              height={safeBandHeight}
              fill="#10b981"
              opacity="0.08"
            />
          )}

          {/* Optimal Reference Dashed Line */}
          <line
            x1={pad.left}
            y1={yPos(meta.rule.optimal)}
            x2={pad.left + plotW}
            y2={yPos(meta.rule.optimal)}
            stroke="#10b981"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.55"
          />

          {/* Area Fill under primary curve */}
          <path d={buildAreaPath(metricValues)} fill="url(#primaryAreaGrad)" />

          {/* Primary Line */}
          <polyline
            fill="none"
            stroke={meta.primaryColor}
            strokeWidth="2.4"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={buildPolyline(metricValues)}
          />

          {/* X-Axis Labels */}
          {chartData.map((pt, idx) => {
            if (idx % xLabelStride !== 0 && idx !== chartData.length - 1) return null;
            return (
              <text
                key={`${pt.time}-${idx}`}
                x={xPos(idx)}
                y={height - 10}
                textAnchor="middle"
                className="fill-slate-400 font-mono text-[10px] tabular-nums"
              >
                {pt.time}
              </text>
            );
          })}

          {/* Crosshair & Active Point */}
          {activePoint && (
            <g>
              <line
                x1={xPos(activeIdx)}
                y1={pad.top}
                x2={xPos(activeIdx)}
                y2={pad.top + plotH}
                stroke="#0f172a"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.45"
              />
              <circle
                cx={xPos(activeIdx)}
                cy={yPos(activeValue)}
                r="5"
                fill="#ffffff"
                stroke={meta.primaryColor}
                strokeWidth="2.5"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Summary Statistics Footer */}
      <div className="grid grid-cols-2 divide-y divide-slate-200 border-t border-slate-200 sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
        <div className="px-5 py-3">
          <div className="text-[11px] font-medium text-slate-500">Mínimo ventana</div>
          <div className="mt-0.5 font-mono text-sm font-semibold text-slate-900 tabular-nums">
            {stats.min.toFixed(meta.decimals)} {meta.unit}
          </div>
        </div>
        <div className="px-5 py-3">
          <div className="text-[11px] font-medium text-slate-500">Promedio ventana</div>
          <div className="mt-0.5 font-mono text-sm font-semibold text-slate-900 tabular-nums">
            {stats.avg.toFixed(meta.decimals)} {meta.unit}
          </div>
        </div>
        <div className="px-5 py-3">
          <div className="text-[11px] font-medium text-slate-500">Máximo ventana</div>
          <div className="mt-0.5 font-mono text-sm font-semibold text-slate-900 tabular-nums">
            {stats.max.toFixed(meta.decimals)} {meta.unit}
          </div>
        </div>
        <div className="px-5 py-3">
          <div className="text-[11px] font-medium text-slate-500">Umbral configurado</div>
          <div className="mt-0.5 font-mono text-sm font-semibold text-slate-900 tabular-nums">
            {meta.rule.min}–{meta.rule.max} {meta.unit}
          </div>
        </div>
      </div>
    </section>
  );
}

export default InteractiveChartsPanel;

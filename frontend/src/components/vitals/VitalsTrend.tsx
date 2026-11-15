"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";
import { type MockTrendPoint, type TrendMetric } from "@/services/mockData";
import { useLanguage } from "@/components/LanguageProvider";
import type { MessageKey } from "@/services/i18n";
import { getTripulantes, getTelemetriaTripulante } from "@/services/api";

const chartConfig: Record<TrendMetric, { label: MessageKey; unit: string; dataKey: string; color: string }> = {
  heart_rate: { label: "heartRate", unit: "bpm", dataKey: "heart_rate", color: "#bc5148" },
  spo2: { label: "oxygen", unit: "%", dataKey: "spo2", color: "#167b8b" },
  blood_pressure: { label: "systolicPressure", unit: "mmHg", dataKey: "systolic", color: "#9b6b10" },
  body_temperature: { label: "temperature", unit: "°C", dataKey: "body_temperature", color: "#bf633e" },
  blood_glucose: { label: "glucose", unit: "mg/dL", dataKey: "blood_glucose", color: "#6e639c" },
  respiratory_rate: { label: "respiratoryRate", unit: "rpm", dataKey: "respiratory_rate", color: "#20856b" },
};

export function VitalsTrend({ metric, trends }: { metric: TrendMetric; trends?: MockTrendPoint[] }) {
  const { t } = useLanguage();
  const [hours, setHours] = useState<3 | 6>(6);
  const [trendData, setTrendData] = useState<MockTrendPoint[]>(trends || []);
  const config = chartConfig[metric];
  const label = t(config.label);

  useEffect(() => {
    if (!trends) {
      async function cargar() {
        try {
          const tripulantes = await getTripulantes();
          if (tripulantes.length > 0) {
            const hist = await getTelemetriaTripulante(tripulantes[0].id, 15);
            const mapped: MockTrendPoint[] = hist.map((h: any) => ({
              time: h.fecha?.slice(11, 16) || "00:00",
              heart_rate: h.frecuencia_cardiaca || 72,
              spo2: h.spo2 || 98,
              systolic: h.presion_sistolica || 116,
              body_temperature: h.temperatura_c || 36.6,
              blood_glucose: h.glucosa_mg_dl || 92,
              respiratory_rate: h.estado_animo || 15,
            }));
            setTrendData(mapped);
          }
        } catch (e) {
          console.error("Error cargando tendencias:", e);
        }
      }
      cargar();
    }
  }, [trends]);

  const data = trendData.slice(hours === 3 ? -4 : undefined);

  return (
    <section className="panel trend-panel" id="tendencias" aria-labelledby="trend-title">
      <div className="panel-heading trend-heading">
        <div>
          <p className="eyebrow">{t("trendPeriodDemo").replace("{hours}", String(hours))}</p>
          <h2 id="trend-title">{t("measurementsTrend")}</h2>
          <p className="panel-subtitle">
            {label}. {t("simulatedPoints")}
          </p>
        </div>
        <div className="trend-controls" role="group" aria-label={t("trendPeriod") }>
          {[3, 6].map((period) => (
            <button
              className={`trend-period-button ${hours === period ? "trend-period-button-active" : ""}`}
              key={period}
              type="button"
              aria-pressed={hours === period}
              onClick={() => setHours(period as 3 | 6)}
            >
              {t("hoursLabel").replace("{hours}", String(period))}
            </button>
          ))}
          <span className="chart-unit" style={{ color: config.color }}>{config.unit}</span>
        </div>
      </div>
      <div className="chart-wrap" role="img" aria-label={t("chartDescription").replace("{metric}", label).replace("{hours}", String(hours))}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: -18 }}>
            <CartesianGrid stroke="#e9eeeb" strokeDasharray="3 5" vertical={false} />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#87928e", fontSize: 11 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#87928e", fontSize: 11 }}
              width={44}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                border: "1px solid #e5e9e6",
                borderRadius: 8,
                boxShadow: "0 8px 24px rgba(27, 45, 37, .08)",
                fontSize: 12,
              }}
              formatter={(value) => [`${value} ${config.unit}`, label]}
              labelFormatter={(time) => `${time} ${t("utc")}`}
            />
            <Line
              type="monotone"
              dataKey={config.dataKey}
              stroke={config.color}
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: "#fff", stroke: config.color, strokeWidth: 2 }}
              activeDot={{ r: 5, fill: config.color, stroke: "#fff", strokeWidth: 2 }}
              isAnimationActive
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-footnote">
        <span className="chart-legend-dot" style={{ backgroundColor: config.color }} aria-hidden="true" />
        <span>{t("exampleReadings")}</span>
      </div>
    </section>
  );
}

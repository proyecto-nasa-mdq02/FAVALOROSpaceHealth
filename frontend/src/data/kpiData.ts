/**
 * Datos de umbral y reglas para el panel de supervisión.
 * Adaptado de pulsovital-monitor/src/data/mockHealthData.ts
 */

export type ThresholdKey = 'systolic' | 'diastolic' | 'heart_rate' | 'spo2' | 'blood_glucose' | 'body_temperature';

export interface ThresholdRule {
  key: ThresholdKey;
  label: string;
  shortLabel: string;
  unit: string;
  min: number;
  optimal: number;
  max: number;
  scaleMin: number;
  scaleMax: number;
  step: number;
  enabled: boolean;
  soundAlert: boolean;
  priorityBanner: boolean;
}

export const DEFAULT_THRESHOLD_RULES: Record<ThresholdKey, ThresholdRule> = {
  systolic: {
    key: 'systolic',
    label: 'Presión Arterial Sistólica',
    shortLabel: 'PA Sistólica',
    unit: 'mmHg',
    min: 90,
    optimal: 118,
    max: 130,
    scaleMin: 80,
    scaleMax: 160,
    step: 1,
    enabled: true,
    soundAlert: false,
    priorityBanner: true,
  },
  diastolic: {
    key: 'diastolic',
    label: 'Presión Arterial Diastólica',
    shortLabel: 'PA Diastólica',
    unit: 'mmHg',
    min: 60,
    optimal: 76,
    max: 85,
    scaleMin: 45,
    scaleMax: 110,
    step: 1,
    enabled: true,
    soundAlert: false,
    priorityBanner: true,
  },
  heart_rate: {
    key: 'heart_rate',
    label: 'Frecuencia Cardíaca',
    shortLabel: 'FC',
    unit: 'bpm',
    min: 55,
    optimal: 72,
    max: 100,
    scaleMin: 40,
    scaleMax: 150,
    step: 1,
    enabled: true,
    soundAlert: true,
    priorityBanner: true,
  },
  blood_glucose: {
    key: 'blood_glucose',
    label: 'Glucosa Capilar',
    shortLabel: 'Gluc.',
    unit: 'mg/dL',
    min: 70,
    optimal: 95,
    max: 130,
    scaleMin: 50,
    scaleMax: 200,
    step: 2,
    enabled: true,
    soundAlert: false,
    priorityBanner: true,
  },
  body_temperature: {
    key: 'body_temperature',
    label: 'Temperatura Corporal',
    shortLabel: 'T°',
    unit: '°C',
    min: 35.0,
    optimal: 36.7,
    max: 37.5,
    scaleMin: 34.0,
    scaleMax: 40.0,
    step: 0.1,
    enabled: true,
    soundAlert: true,
    priorityBanner: true,
  },
  spo2: {
    key: 'spo2',
    label: 'Saturación de Oxígeno',
    shortLabel: 'SpO₂',
    unit: '%',
    min: 90,
    optimal: 98,
    max: 100,
    scaleMin: 85,
    scaleMax: 100,
    step: 1,
    enabled: true,
    soundAlert: true,
    priorityBanner: true,
  },
};

export function evaluateMetricStatus(
  value: number,
  rule: ThresholdRule | undefined
): { level: "normal" | "warning" | "critical"; label: string } {
  if (!rule) {
    return { level: "normal", label: "Sin umbral" };
  }

  const span = rule.max - rule.min;
  const criticalMargin = Math.max(rule.step * 2, span * 0.18);

  if (value > rule.max + criticalMargin || value < rule.min - criticalMargin) {
    return {
      level: "critical",
      label: value > rule.max ? "Crítico alto" : "Crítico bajo",
    };
  }
  if (value > rule.max || value < rule.min) {
    return {
      level: "warning",
      label: value > rule.max ? "Elevado" : "Bajo",
    };
  }
  return { level: "normal", label: "Normal" };
}

export function evaluateBloodPressureStatus(
  systolic: number,
  diastolic: number,
  sysRule: ThresholdRule,
  diaRule: ThresholdRule
): { level: "normal" | "warning" | "critical"; label: string } {
  const sysEval = evaluateMetricStatus(systolic, sysRule);
  const diaEval = evaluateMetricStatus(diastolic, diaRule);
  if (sysEval.level === 'critical' || diaEval.level === 'critical') {
    return {
      level: 'critical',
      label: sysEval.level === 'critical' ? sysEval.label : diaEval.label,
    };
  }
  if (sysEval.level === 'warning' || diaEval.level === 'warning') {
    return {
      level: 'warning',
      label: sysEval.level === 'warning' ? sysEval.label : diaEval.label,
    };
  }
  return { level: 'normal', label: 'Normal' };
}

export interface DailyKpiMetrics {
  timeInRangePct: number;
  timeInRangeDelta: number;
  avgHeartRate: number;
  hrvMs: number;
  avgGlucose: number;
  glucosePeak: number;
  meanTemperature: number;
  readingsCount: number;
  readingsTarget: number;
}
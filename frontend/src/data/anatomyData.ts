/**
 * Datos de anatomía y umbrales para el panel de supervisión.
 * Adaptado de la versión original de pulsovital-monitor.
 * Los datos de lectura provienen del backend FastAPI.
 */

export type VitalMetricKey = 'heart_rate' | 'spo2' | 'blood_pressure' | 'body_temperature' | 'blood_glucose';
export type ThresholdKey = 'systolic' | 'diastolic' | 'heart_rate' | 'blood_glucose' | 'body_temperature';
export type VitalStatusLevel = 'normal' | 'warning' | 'critical';
export type TimeRangeKey = '6h' | '12h' | '24h' | '7d';
export type AnatomicalRegionId = 'corazon' | 'arteria' | 'vena' | 'capilar';

export interface VitalReadingSnapshot {
  timestamp: string;
  label: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  glucose: number;
  temperature: number;
  spo2: number;
}

export interface ClinicalObservation {
  id: string;
  timestamp: string;
  author: string;
  category: 'Evolución' | 'Medicación' | 'Alerta' | 'Control';
  note: string;
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

export interface PatientProfile {
  id: string;
  recordCode: string;
  name: string;
  age: number;
  bloodType: string;
  unit: string;
  attendingPhysician: string;
  current: VitalReadingSnapshot;
  previous: VitalReadingSnapshot;
  series24h: VitalReadingSnapshot[];
  series7d: VitalReadingSnapshot[];
  dailyKpi: DailyKpiMetrics;
  observations: ClinicalObservation[];
}

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

export interface HealthNotification {
  id: string;
  patientId: string;
  patientName: string;
  metricKey: ThresholdKey;
  metricLabel: string;
  valueFormatted: string;
  thresholdContext: string;
  severity: 'warning' | 'critical';
  timestamp: string;
  read: boolean;
  mutedUntil?: number;
}

export interface AnatomicalRegionMeta {
  id: AnatomicalRegionId;
  title: string;
  latinSubtitle: string;
  linkedMetric: VitalMetricKey;
  description: string;
  clinicalFocus: string;
}

export const ANATOMICAL_REGIONS: Record<AnatomicalRegionId, AnatomicalRegionMeta> = {
  corazon: {
    id: 'corazon',
    title: 'Corazón',
    latinSubtitle: 'Bomba miocárdica · Ciclo cardíaco',
    linkedMetric: 'heart_rate',
    description:
      'Regula el gasto cardíaco y el ritmo sinusal. La frecuencia cardíaca y su variabilidad reflejan la carga autonómica y la respuesta metabólica.',
    clinicalFocus: 'Frecuencia Cardíaca (FC) y Variabilidad',
  },
  arteria: {
    id: 'arteria',
    title: 'Arteria',
    latinSubtitle: 'Circulación sistémica · Alta presión',
    linkedMetric: 'blood_pressure',
    description:
      'Conduce sangre oxigenada desde el ventrículo izquierdo hacia los tejidos. Su distensibilidad determina la presión arterial sistólica y diastólica.',
    clinicalFocus: 'Presión Arterial (PA Sistólica / Diastólica)',
  },
  vena: {
    id: 'vena',
    title: 'Vena',
    latinSubtitle: 'Retorno venoso · Transporte metabólico',
    linkedMetric: 'blood_glucose',
    description:
      'Retorna el flujo sanguíneo hacia la aurícula derecha y transporta sustratos metabólicos desde el sistema portal hepático.',
    clinicalFocus: 'Glucosa Capilar',
  },
  capilar: {
    id: 'capilar',
    title: 'Capilar',
    latinSubtitle: 'Microcirculación · Termorregulación',
    linkedMetric: 'body_temperature',
    description:
      'Red de intercambio tisular de oxígeno, nutrientes y calor. La vasodilatación capilar periférica modula la temperatura corporal basal.',
    clinicalFocus: 'Temperatura Corporal (T°) y Perfusión',
  },
};

export const DEFAULT_THRESHOLD_RULES: Record<ThresholdKey, ThresholdRule> = {
  systolic: {
    key: 'systolic',
    label: 'Presión Arterial Sistólica',
    shortLabel: 'PA Sistólica',
    unit: 'mmHg',
    min: 95,
    optimal: 118,
    max: 135,
    scaleMin: 80,
    scaleMax: 180,
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
    max: 88,
    scaleMin: 45,
    scaleMax: 115,
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
    max: 140,
    scaleMin: 50,
    scaleMax: 240,
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
    min: 36.0,
    optimal: 36.7,
    max: 38.0,
    scaleMin: 35.0,
    scaleMax: 40.0,
    step: 0.1,
    enabled: true,
    soundAlert: true,
    priorityBanner: true,
  },
};

export function evaluateMetricStatus(
  value: number,
  rule: ThresholdRule
): { level: VitalStatusLevel; label: string } {
  const span = rule.max - rule.min;
  const criticalMargin = Math.max(rule.step * 2, span * 0.18);

  if (value > rule.max + criticalMargin || value < rule.min - criticalMargin) {
    return {
      level: 'critical',
      label: value > rule.max ? 'Crítico alto' : 'Crítico bajo',
    };
  }
  if (value > rule.max || value < rule.min) {
    return {
      level: 'warning',
      label: value > rule.max ? 'Elevado' : 'Bajo',
    };
  }
  return { level: 'normal', label: 'Normal' };
}

export function evaluateBloodPressureStatus(
  systolic: number,
  diastolic: number,
  sysRule: ThresholdRule,
  diaRule: ThresholdRule
): { level: VitalStatusLevel; label: string } {
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

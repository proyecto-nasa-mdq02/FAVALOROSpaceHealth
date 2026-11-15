export type HealthStatus = "GREEN" | "YELLOW" | "RED";

export interface TelemetryResponse {
  status: "success";
  timestamp: string;
  data: {
    astronaut: {
      id: string;
      name: string;
      mission: string;
    };
    vitals: {
      heart_rate: { value: number; unit: string; status: HealthStatus };
      spo2: { value: number; unit: string; status: HealthStatus };
      blood_pressure: {
        systolic: number;
        diastolic: number;
        unit: string;
        status: HealthStatus;
      };
      body_temperature: { value: number; unit: string; status: HealthStatus };
      blood_glucose: { value: number; unit: string; status: HealthStatus };
      respiratory_rate: { value: number; unit: string; status: HealthStatus };
    };
    standard_measures: {
      actigraphy: {
        sleep_duration_hours: number;
        sleep_efficiency_pct: number;
        status: HealthStatus;
      };
      cognition: {
        vigilant_attention_score: number;
        spatial_orientation_score: number;
        status: HealthStatus;
      };
      behavioral_health: {
        mood_score_panas: number;
        team_cohesion_index: number;
        status: HealthStatus;
      };
      sensorimotor: {
        motion_sickness_rating_0_to_20: number;
        postural_stability: string;
        status: HealthStatus;
      };
    };
    smart_mirror_vision: {
      capture_timestamp: string;
      quality_gate_passed: boolean;
      facial_edema_index: number;
      paleness_colorimetry_ratio: number;
      ocular_fatigue_score: string;
      status: HealthStatus;
    };
    clinical_assessment: {
      overall_status: HealthStatus;
      engine_mode: string;
      active_alerts: string[];
      preventive_recommendation: string;
    };
    daily_kpi?: {
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
  };
}

export const MOCK_TELEMETRY: TelemetryResponse = {
  status: "success",
  timestamp: "2026-11-14T13:30:00Z",
  data: {
    astronaut: {
      id: "AST-004",
      name: "Alex Vance",
      mission: "Artemis III",
    },
    vitals: {
      heart_rate: { value: 74, unit: "bpm", status: "GREEN" },
      spo2: { value: 98, unit: "%", status: "GREEN" },
      blood_pressure: {
        systolic: 118,
        diastolic: 76,
        unit: "mmHg",
        status: "GREEN",
      },
      body_temperature: { value: 36.7, unit: "degC", status: "GREEN" },
      blood_glucose: { value: 95, unit: "mg/dL", status: "GREEN" },
      respiratory_rate: { value: 16, unit: "rpm", status: "GREEN" },
    },
    standard_measures: {
      actigraphy: {
        sleep_duration_hours: 7.2,
        sleep_efficiency_pct: 88.5,
        status: "GREEN",
      },
      cognition: {
        vigilant_attention_score: 94,
        spatial_orientation_score: 91,
        status: "GREEN",
      },
      behavioral_health: {
        mood_score_panas: 18,
        team_cohesion_index: 9.2,
        status: "GREEN",
      },
      sensorimotor: {
        motion_sickness_rating_0_to_20: 2,
        postural_stability: "STABLE",
        status: "GREEN",
      },
    },
    smart_mirror_vision: {
      capture_timestamp: "2026-11-14T07:30:00Z",
      quality_gate_passed: true,
      facial_edema_index: 1.04,
      paleness_colorimetry_ratio: 0.98,
      ocular_fatigue_score: "LOW",
      status: "GREEN",
    },
    clinical_assessment: {
      overall_status: "GREEN",
      engine_mode: "DETERMINISTIC_RULES",
      active_alerts: [],
      preventive_recommendation:
        "All health indicators within NASA HRP baseline ranges. Maintain scheduled hydration and resistive exercise.",
    },
  },
};

export const MOCK_ASTRONAUTS: TelemetryResponse[] = [
  MOCK_TELEMETRY,
  {
    ...MOCK_TELEMETRY,
    timestamp: "2026-11-14T13:30:00Z",
    data: {
      ...MOCK_TELEMETRY.data,
      astronaut: { id: "AST-DEMO-02", name: "Crew Sample 02", mission: "Demo mission" },
      vitals: {
        heart_rate: { value: 81, unit: "bpm", status: "YELLOW" },
        spo2: { value: 97, unit: "%", status: "GREEN" },
        blood_pressure: { systolic: 122, diastolic: 79, unit: "mmHg", status: "GREEN" },
        body_temperature: { value: 36.8, unit: "degC", status: "GREEN" },
        blood_glucose: { value: 101, unit: "mg/dL", status: "GREEN" },
        respiratory_rate: { value: 18, unit: "rpm", status: "GREEN" },
      },
      clinical_assessment: {
        ...MOCK_TELEMETRY.data.clinical_assessment,
        overall_status: "YELLOW",
        active_alerts: [],
      },
    },
  },
  {
    ...MOCK_TELEMETRY,
    timestamp: "2026-11-14T13:30:00Z",
    data: {
      ...MOCK_TELEMETRY.data,
      astronaut: { id: "AST-DEMO-03", name: "Crew Sample 03", mission: "Demo mission" },
      vitals: {
        heart_rate: { value: 69, unit: "bpm", status: "GREEN" },
        spo2: { value: 99, unit: "%", status: "GREEN" },
        blood_pressure: { systolic: 115, diastolic: 74, unit: "mmHg", status: "GREEN" },
        body_temperature: { value: 36.5, unit: "degC", status: "GREEN" },
        blood_glucose: { value: 91, unit: "mg/dL", status: "GREEN" },
        respiratory_rate: { value: 15, unit: "rpm", status: "GREEN" },
      },
    },
  },
];

export type TrendMetric =
  | "heart_rate"
  | "spo2"
  | "blood_pressure"
  | "body_temperature"
  | "blood_glucose"
  | "respiratory_rate";

export interface MockTrendPoint {
  time: string;
  heart_rate: number;
  spo2: number;
  systolic: number;
  body_temperature: number;
  blood_glucose: number;
  respiratory_rate: number;
}

export const MOCK_TRENDS: MockTrendPoint[] = [
  { time: "07:30", heart_rate: 72, spo2: 97, systolic: 116, body_temperature: 36.6, blood_glucose: 92, respiratory_rate: 15 },
  { time: "08:30", heart_rate: 76, spo2: 98, systolic: 119, body_temperature: 36.7, blood_glucose: 96, respiratory_rate: 16 },
  { time: "09:30", heart_rate: 73, spo2: 98, systolic: 117, body_temperature: 36.7, blood_glucose: 94, respiratory_rate: 16 },
  { time: "10:30", heart_rate: 78, spo2: 97, systolic: 121, body_temperature: 36.8, blood_glucose: 101, respiratory_rate: 17 },
  { time: "11:30", heart_rate: 75, spo2: 99, systolic: 118, body_temperature: 36.7, blood_glucose: 97, respiratory_rate: 16 },
  { time: "12:30", heart_rate: 74, spo2: 98, systolic: 118, body_temperature: 36.7, blood_glucose: 95, respiratory_rate: 16 },
  { time: "13:30", heart_rate: 74, spo2: 98, systolic: 118, body_temperature: 36.7, blood_glucose: 95, respiratory_rate: 16 },
];

export const MOCK_TRENDS_BY_ASTRONAUT: Record<string, MockTrendPoint[]> = Object.fromEntries(
  MOCK_ASTRONAUTS.map(({ data }) => {
    const base = MOCK_TELEMETRY.data.vitals;
    const offset = {
      heart_rate: data.vitals.heart_rate.value - base.heart_rate.value,
      spo2: data.vitals.spo2.value - base.spo2.value,
      systolic: data.vitals.blood_pressure.systolic - base.blood_pressure.systolic,
      body_temperature: data.vitals.body_temperature.value - base.body_temperature.value,
      blood_glucose: data.vitals.blood_glucose.value - base.blood_glucose.value,
      respiratory_rate: data.vitals.respiratory_rate.value - base.respiratory_rate.value,
    };
    return [data.astronaut.id, MOCK_TRENDS.map((point) => ({
      ...point,
      heart_rate: point.heart_rate + offset.heart_rate,
      spo2: point.spo2 + offset.spo2,
      systolic: point.systolic + offset.systolic,
      body_temperature: Number((point.body_temperature + offset.body_temperature).toFixed(1)),
      blood_glucose: point.blood_glucose + offset.blood_glucose,
      respiratory_rate: point.respiratory_rate + offset.respiratory_rate,
    }))];
  }),
);

"use client";

import {
  ANATOMICAL_REGIONS,
  DEFAULT_THRESHOLD_RULES,
  type AnatomicalRegionId,
  type VitalMetricKey,
  type ThresholdKey,
  evaluateBloodPressureStatus,
  evaluateMetricStatus,
} from "@/data/anatomyData";
import { MaterialSymbol } from "@/components/MaterialSymbol";
import { useLanguage } from "@/components/LanguageProvider";
import type { MessageKey } from "@/services/i18n";

interface AnatomyMapPanelProps {
  vitals: {
    heart_rate: { value: number; unit: string; status: string; label?: string; icon?: string; tone?: string };
    spo2: { value: number; unit: string; status: string; label?: string; icon?: string; tone?: string };
    blood_pressure: { systolic: number; diastolic: number; unit: string; status: string; label?: string; icon?: string; tone?: string };
    body_temperature: { value: number; unit: string; status: string; label?: string; icon?: string; tone?: string };
    blood_glucose: { value: number; unit: string; status: string; label?: string; icon?: string; tone?: string };
  };
  selectedRegion: AnatomicalRegionId;
  onSelectRegion: (regionId: AnatomicalRegionId, linkedMetric: VitalMetricKey) => void;
}

export function AnatomyMapPanel({ vitals, selectedRegion, onSelectRegion }: AnatomyMapPanelProps) {
  const { t } = useLanguage();

  // Mapear los datos del backend al formato esperado por el componente
  const current = {
    heartRate: vitals.heart_rate.value,
    spo2: vitals.spo2.value,
    systolic: vitals.blood_pressure.systolic,
    diastolic: vitals.blood_pressure.diastolic,
    glucose: vitals.blood_glucose.value,
    temperature: vitals.body_temperature.value,
  };

  // Obtener reglas de umbrales
  const rules = DEFAULT_THRESHOLD_RULES;

  // Evaluar estados de cada métrica
  const hrStatus = evaluateMetricStatus(current.heartRate, rules.heart_rate);
  const bpStatus = evaluateBloodPressureStatus(current.systolic, current.diastolic, rules.systolic, rules.diastolic);
  const glucStatus = evaluateMetricStatus(current.glucose, rules.blood_glucose);
  const tempStatus = evaluateMetricStatus(current.temperature, rules.body_temperature);

  const regionValues: Record<
    AnatomicalRegionId,
    { reading: string; level: 'normal' | 'warning' | 'critical'; label: string }
  > = {
    corazon: {
      reading: `${current.heartRate} lpm`,
      level: hrStatus.level,
      label: hrStatus.label,
    },
    arteria: {
      reading: `${current.systolic}/${current.diastolic} mmHg`,
      level: bpStatus.level,
      label: bpStatus.label,
    },
    vena: {
      reading: `${current.glucose} mg/dL`,
      level: glucStatus.level,
      label: glucStatus.label,
    },
    capilar: {
      reading: `${current.temperature.toFixed(1)} °C`,
      level: tempStatus.level,
      label: tempStatus.label,
    },
  };

  const getStatusColor = (level: 'normal' | 'warning' | 'critical') => {
    if (level === 'critical') return 'text-rose-700';
    if (level === 'warning') return 'text-amber-700';
    return 'text-emerald-700';
  };

  const getStatusStroke = (level: 'normal' | 'warning' | 'critical') => {
    if (level === 'critical') return '#be123c';
    if (level === 'warning') return '#b45309';
    return '#047857';
  };

  const regionButtons: { id: AnatomicalRegionId; top: string; align: 'left' | 'right' }[] = [
    { id: 'corazon', top: '23%', align: 'left' },
    { id: 'arteria', top: '41%', align: 'left' },
    { id: 'vena', top: '61%', align: 'left' },
    { id: 'capilar', top: '76%', align: 'left' },
  ];

  const activeMeta = ANATOMICAL_REGIONS[selectedRegion];

  return (
    <section
      aria-labelledby="anatomy-panel-heading"
      className="flex h-full max-h-[720px] flex-col rounded-xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <h2 id="anatomy-panel-heading" className="font-display text-base font-semibold text-slate-900">
            Mapa vascular y perfusión
          </h2>
          <p className="text-xs text-slate-500">
            Selecciona una estructura anatómica para vincular su signo vital
          </p>
        </div>
        <span className="font-mono text-xs text-slate-500 tabular-nums">
          SpO₂ {current.spo2}%
        </span>
      </div>

      {/* Interactive Anatomical SVG Stage */}
      <div className="relative flex flex-1 items-center justify-center bg-slate-50/50 px-4 py-6 min-h-[430px]">
        {/* Interactive Callout Selector Stack (Left side, mirroring sketch) */}
        <div className="relative z-10 flex w-full max-w-[460px] items-center justify-between gap-2">
          <div className="flex w-[165px] shrink-0 flex-col gap-3">
            {regionButtons.map(({ id }) => {
              const meta = ANATOMICAL_REGIONS[id];
              const val = regionValues[id];
              const isSelected = selectedRegion === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onSelectRegion(id, meta.linkedMetric)}
                  className={`group flex w-full flex-col items-start rounded-lg border px-3 py-2.5 text-left transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${
                    isSelected
                      ? 'border-sky-600 bg-white shadow-sm'
                      : 'border-slate-200 bg-white/85 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex w-full items-center justify-between gap-1">
                    <span
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-sky-700' : 'text-slate-800'
                      }`}
                    >
                      {meta.title}
                    </span>
                    <span className={`text-[11px] font-medium ${getStatusColor(val.level)}`}>
                      {val.label}
                    </span>
                  </div>
                  <span className="mt-1 font-mono text-xs font-semibold text-slate-900 tabular-nums">
                    {val.reading}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Crisp Clinical Anatomical SVG */}
          <div className="relative flex-1 flex justify-center">
            <svg
              viewBox="0 0 260 460"
              className="h-[395px] w-auto select-none"
              role="img"
              aria-label="Diagrama anatómico interactivo del sistema cardiovascular"
            >
              {/* Subtle reference grid */}
              <defs>
                <pattern id="anatomy-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path
                    d="M 20 0 L 0 0 0 20"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="0.6"
                    strokeDasharray="2 2"
                  />
                </pattern>
              </defs>
              <rect x="10" y="6" width="240" height="448" rx="12" fill="url(#anatomy-grid)" opacity="0.55" />

              {/* Human Anatomical Silhouette */}
              <g fill="#ffffff" stroke="#94a3b8" strokeWidth="1.6" strokeLinejoin="round">
                {/* Head & Neck */}
                <path d="M130 16 C113 16 104 29 104 47 C104 62 112 73 120 77 L120 88 L140 88 L140 77 C148 73 156 62 156 47 C156 29 147 16 130 16 Z" />
                {/* Torso & Arms */}
                <path d="M120 88 L88 97 C76 101 69 112 66 126 L46 218 C44 226 48 234 55 236 C61 237 66 232 68 225 L86 144 L91 144 L91 228 L83 324 L80 416 C79 426 86 434 94 434 C102 434 107 427 108 417 L116 318 L124 252 L136 252 L144 318 L152 417 C153 427 158 434 166 434 C174 434 181 426 180 416 L177 324 L169 228 L169 144 L174 144 L192 225 C194 232 199 237 205 236 C212 234 216 226 214 218 L194 126 C191 112 184 101 172 97 L140 88 Z" />
              </g>

              {/* Venous Network (Vena - Sky/Cobalt) */}
              <g
                fill="none"
                stroke={selectedRegion === 'vena' ? '#0284c7' : '#64748b'}
                strokeWidth={selectedRegion === 'vena' ? '2.4' : '1.4'}
                strokeLinecap="round"
                opacity={selectedRegion === 'vena' ? 1 : 0.6}
                className="transition-all duration-200 cursor-pointer"
                onClick={() => onSelectRegion('vena', 'blood_glucose')}
              >
                {/* Superior Vena Cava & Jugulars */}
                <path d="M122 45 L124 128" />
                <path d="M138 45 L136 128" />
                {/* Subclavian & Brachial Veins */}
                <path d="M124 106 L82 116 L58 214" />
                <path d="M136 106 L178 116 L202 214" />
                {/* Inferior Vena Cava & Iliac/Femoral Veins */}
                <path d="M127 148 L127 236 L104 312 L94 412" />
                <path d="M127 236 L156 312 L166 412" />
              </g>

              {/* Arterial Network (Arteria - Rose/Crimson) */}
              <g
                fill="none"
                stroke={selectedRegion === 'arteria' ? '#e11d48' : '#fb7185'}
                strokeWidth={selectedRegion === 'arteria' ? '2.6' : '1.6'}
                strokeLinecap="round"
                opacity={selectedRegion === 'arteria' ? 1 : 0.78}
                className="transition-all duration-200 cursor-pointer"
                onClick={() => onSelectRegion('arteria', 'blood_pressure')}
              >
                {/* Carotid Arteries */}
                <path d="M127 115 L126 38" />
                <path d="M133 115 L134 38" />
                {/* Aortic Arch & Descending Aorta */}
                <path d="M132 126 C132 110 139 109 139 124 L133 234" />
                {/* Subclavian & Radial Arteries */}
                <path d="M127 114 L86 120 L62 218" />
                <path d="M138 114 L174 120 L198 218" />
                {/* Renal & Mesenteric branches */}
                <path d="M133 182 L113 186" />
                <path d="M133 182 L150 186" />
                {/* Femoral & Tibial Arteries */}
                <path d="M133 234 L109 314 L98 414" />
                <path d="M133 234 L151 314 L162 414" />
              </g>

              {/* Capillary Micro-beds (Capilar - Left/Right extremities & pulmonary beds) */}
              <g
                fill="none"
                stroke={selectedRegion === 'capilar' ? '#0d9488' : '#94a3b8'}
                strokeWidth={selectedRegion === 'capilar' ? '1.6' : '1'}
                opacity={selectedRegion === 'capilar' ? 1 : 0.7}
                className="transition-all duration-200 cursor-pointer"
                onClick={() => onSelectRegion('capilar', 'body_temperature')}
              >
                {/* Pulmonary capillary bed */}
                <path d="M114 126 Q104 122 101 134 M114 134 Q102 138 100 148 M146 126 Q156 122 159 134 M146 134 Q158 138 160 148" />
                {/* Peripheral leg capillary network */}
                <path d="M98 336 C91 344 90 356 96 364 M98 342 C105 348 106 360 99 368" />
                <path d="M162 336 C169 344 170 356 164 364 M162 342 C155 348 154 360 161 368" />
                {/* Hand capillary bed */}
                <path d="M58 214 L52 227 M58 214 L58 229 M62 218 L64 228" />
                <path d="M202 214 L208 227 M202 214 L202 229 M198 218 L196 228" />
              </g>

              {/* Heart Organ (Corazón) */}
              <g
                className="cursor-pointer transition-transform duration-200"
                onClick={() => onSelectRegion('corazon', 'heart_rate')}
              >
                <path
                  d="M133 123 C127 118 119 122 119 131 C119 140 128 148 135 154 C141 149 146 141 145 132 C144 123 137 120 133 123 Z"
                  fill={selectedRegion === 'corazon' ? '#e11d48' : '#fda4af'}
                  stroke="#9f1239"
                  strokeWidth="1.6"
                />
                <circle
                  cx="133"
                  cy="135"
                  r={selectedRegion === 'corazon' ? 18 : 0}
                  fill="none"
                  stroke="#e11d48"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                  opacity="0.65"
                />
              </g>

              {/* Callout Leader Lines & Interactive Target Nodes */}
              {/* 1. Corazón */}
              <g
                className="cursor-pointer"
                onClick={() => onSelectRegion('corazon', 'heart_rate')}
              >
                <line
                  x1="12"
                  y1="135"
                  x2="120"
                  y2="135"
                  stroke={selectedRegion === 'corazon' ? '#0284c7' : '#94a3b8'}
                  strokeWidth={selectedRegion === 'corazon' ? '1.8' : '1'}
                  strokeDasharray={selectedRegion === 'corazon' ? 'none' : '3 3'}
                />
                <circle
                  cx="120"
                  cy="135"
                  r="4.5"
                  fill={selectedRegion === 'corazon' ? '#0284c7' : '#ffffff'}
                  stroke={getStatusStroke(regionValues.corazon.level)}
                  strokeWidth="2"
                />
              </g>

              {/* 2. Arteria */}
              <g
                className="cursor-pointer"
                onClick={() => onSelectRegion('arteria', 'blood_pressure')}
              >
                <line
                  x1="12"
                  y1="186"
                  x2="133"
                  y2="186"
                  stroke={selectedRegion === 'arteria' ? '#0284c7' : '#94a3b8'}
                  strokeWidth={selectedRegion === 'arteria' ? '1.8' : '1'}
                  strokeDasharray={selectedRegion === 'arteria' ? 'none' : '3 3'}
                />
                <circle
                  cx="133"
                  cy="186"
                  r="4.5"
                  fill={selectedRegion === 'arteria' ? '#0284c7' : '#ffffff'}
                  stroke={getStatusStroke(regionValues.arteria.level)}
                  strokeWidth="2"
                />
              </g>

              {/* 3. Vena */}
              <g
                className="cursor-pointer"
                onClick={() => onSelectRegion('vena', 'blood_glucose')}
              >
                <line
                  x1="12"
                  y1="278"
                  x2="115"
                  y2="278"
                  stroke={selectedRegion === 'vena' ? '#0284c7' : '#94a3b8'}
                  strokeWidth={selectedRegion === 'vena' ? '1.8' : '1'}
                  strokeDasharray={selectedRegion === 'vena' ? 'none' : '3 3'}
                />
                <circle
                  cx="115"
                  cy="278"
                  r="4.5"
                  fill={selectedRegion === 'vena' ? '#0284c7' : '#ffffff'}
                  stroke={getStatusStroke(regionValues.vena.level)}
                  strokeWidth="2"
                />
              </g>

              {/* 4. Capilar */}
              <g
                className="cursor-pointer"
                onClick={() => onSelectRegion('capilar', 'body_temperature')}
              >
                <line
                  x1="12"
                  y1="354"
                  x2="96"
                  y2="354"
                  stroke={selectedRegion === 'capilar' ? '#0284c7' : '#94a3b8'}
                  strokeWidth={selectedRegion === 'capilar' ? '1.8' : '1'}
                  strokeDasharray={selectedRegion === 'capilar' ? 'none' : '3 3'}
                />
                <circle
                  cx="96"
                  cy="354"
                  r="4.5"
                  fill={selectedRegion === 'capilar' ? '#0284c7' : '#ffffff'}
                  stroke={getStatusStroke(regionValues.capilar.level)}
                  strokeWidth="2"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Selected Anatomical Region Physiological Context */}
      <div className="border-t border-slate-200 px-6 py-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="flex flex-col items-baseline gap-2">
            <h3 className="font-display text-sm font-semibold text-slate-900">
              {activeMeta.title}
            </h3>
            <span className="text-xs text-slate-500">{activeMeta.latinSubtitle}</span>
          </div>
          <span className="text-xs font-medium text-sky-700">{activeMeta.clinicalFocus}</span>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{activeMeta.description}</p>
      </div>
    </section>
  );
}

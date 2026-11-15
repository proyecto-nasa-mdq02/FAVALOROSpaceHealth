import React from 'react';
import type { TelemetryResponse, TrendMetric } from '@/services/mockData';

interface MedicalAnatomyMapProps {
  selectedVital: TrendMetric;
  onSelectVital: (key: TrendMetric) => void;
  values: TelemetryResponse['data']['vitals'];
}

const CALLOUTS = [
  { id: 'temp-temporal', vitalKey: 'body_temperature', label: 'T°', sublabel: 'Temperatura corporal', side: 'left', labelY: 64, targetX: 196, targetY: 54, elbowX: 146 },
  { id: 'fc-heart', vitalKey: 'heart_rate', label: 'FC', sublabel: 'Corazón', side: 'left', labelY: 198, targetX: 218, targetY: 210, elbowX: 142 },
  { id: 'pa-brachial', vitalKey: 'blood_pressure', label: 'PA', sublabel: 'Presión arterial', side: 'left', labelY: 274, targetX: 140, targetY: 274, elbowX: 122 },
  { id: 'gluc-capillary', vitalKey: 'blood_glucose', label: 'Gluc.', sublabel: 'Glucosa en sangre', side: 'left', labelY: 420, targetX: 102, targetY: 420, elbowX: 90 },
  { id: 'fc-radial', vitalKey: 'heart_rate', label: 'Pulso', sublabel: 'Pulso periférico', side: 'right', labelY: 344, targetX: 292, targetY: 344, elbowX: 314 },
  { id: 'spo2-nailbed', vitalKey: 'spo2', label: 'SpO₂', sublabel: 'Oxígeno en sangre', side: 'right', labelY: 420, targetX: 320, targetY: 420, elbowX: 334 },
] satisfies { id: string; vitalKey: TrendMetric; label: string; sublabel: string; side: 'left' | 'right'; labelY: number; targetX: number; targetY: number; elbowX: number }[];

function metricStatus(values: TelemetryResponse['data']['vitals'], metric: TrendMetric) {
  switch (metric) {
    case 'heart_rate': return values.heart_rate.status;
    case 'spo2': return values.spo2.status;
    case 'blood_pressure': return values.blood_pressure.status;
    case 'body_temperature': return values.body_temperature.status;
    case 'blood_glucose': return values.blood_glucose.status;
    case 'respiratory_rate': return values.respiratory_rate.status;
  }
}

function statusStrokeColor(status: string, isSelected: boolean): string {
  if (status === 'RED') return '#DC2626';
  if (status === 'YELLOW') return '#D97706';
  if (status === 'GREEN') return '#059669';
  if (isSelected) return '#0284C7';
  return '#334155';
}

export const MedicalAnatomyMap: React.FC<MedicalAnatomyMapProps> = ({
  selectedVital,
  onSelectVital,
  values,
}) => {
  return (
    <section
      aria-label="Mapa anatómico clínico"
      className="flex flex-col bg-white text-slate-900 border border-slate-300/80 shadow-sm overflow-hidden h-full rounded-lg"
    >
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-slate-50/80">
        <span className="font-display text-xs font-bold tracking-wider uppercase text-slate-700">
          Sitios Anatómicos de Medición (Clínico)
        </span>
      </div>

      <div className="relative flex-1 flex items-center justify-center bg-white px-2 py-2 min-h-[460px]">
        <svg viewBox="0 0 420 715" className="w-full h-full max-h-[610px] select-none" role="img">
          <defs>
            <pattern id="clinical-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#F1F5F9" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="420" height="715" fill="url(#clinical-grid)" />

          {/* Silhouette */}
          <g fill="#F8FAFC" stroke="#1E293B" strokeWidth="1.45" strokeLinejoin="round" strokeLinecap="round">
            <path d="M210 22 C193 22 183 35 183 52 C183 68 188 83 197 91 L197 111 C194 117 184 121 171 126 C156 131 145 140 138 153 C132 166 128 185 124 207 L112 265 C108 286 104 301 101 316 C99 326 101 337 106 346 L112 355 C107 356 102 360 101 365 C100 369 103 372 107 370 L115 365 C111 371 109 377 111 380 C113 383 117 381 120 376 L126 367 C123 374 123 380 126 382 C130 384 132 379 134 374 L138 362 C143 352 145 340 143 327 C141 313 143 300 147 285 L160 236 C163 223 166 211 169 198 C169 224 168 247 166 270 C164 297 163 321 164 339 C164 354 160 366 157 382 C153 401 154 425 157 451 L164 529 C166 559 167 594 166 631 C166 647 164 661 160 673 C157 681 159 688 165 691 C171 695 179 692 183 687 C187 681 187 669 188 654 L197 552 C200 516 203 482 206 451 C207 430 208 407 210 385 C212 407 213 430 214 451 C217 482 220 516 223 552 L232 654 C233 669 233 681 237 687 C241 692 249 695 255 691 C261 688 263 681 260 673 C256 661 254 647 254 631 C253 594 254 559 256 529 L263 451 C266 425 267 401 263 382 C260 366 256 354 256 339 C257 321 256 297 254 270 C252 247 251 224 251 198 C254 211 257 223 260 236 L273 285 C277 300 279 313 277 327 C275 340 277 352 282 362 L286 374 C288 379 290 384 294 382 C297 380 297 374 294 367 L300 376 C303 381 307 383 309 380 C311 377 309 371 305 365 L313 370 C317 372 320 369 319 365 C318 360 313 356 308 355 L314 346 C319 337 321 326 319 316 C316 301 312 286 308 265 L296 207 C292 185 288 166 282 153 C275 140 264 131 249 126 C236 121 226 117 223 111 L223 91 C232 83 237 68 237 52 C237 35 227 22 210 22 Z" />
          </g>

          <g fill="none" stroke="#CBD5E1" strokeWidth="1.1" strokeLinecap="round">
            <path d="M 164 142 Q 187 136 206 142 M 256 142 Q 233 136 214 142 M 168 164 Q 186 172 204 170 M 252 164 Q 234 172 216 170 M 164 182 Q 186 192 204 188 M 256 182 Q 234 192 216 188 M 164 200 Q 186 212 204 206 M 256 200 Q 234 212 216 206 M 168 218 Q 186 229 202 224 M 252 218 Q 234 229 218 224 M 166 320 Q 184 342 210 344 Q 236 342 254 320" />
          </g>
          <g fill="none" stroke="#2563EB" strokeLinecap="round" strokeWidth="1.2" opacity=".58">
            <path d="M 205 138 L 205 292 M 202 138 L 198 70 M 216 138 L 222 70 M 204 142 Q 162 145 148 168 L 136 250 L 122 332 L 114 378 M 215 142 Q 258 145 272 168 L 284 250 L 298 332 L 306 378 M 205 292 L 188 330 L 180 460 L 176 585 L 174 662 M 206 292 L 232 330 L 240 460 L 244 585 L 246 662" />
          </g>
          <g fill="none" stroke="#DC2626" strokeLinecap="round" strokeWidth="1.5" opacity=".78">
            <path d="M 212 166 C 212 152 218 150 216 168 L 211 294 M 210 156 L 202 88 L 196 54 M 214 156 L 220 88 L 224 56 M 209 156 Q 160 150 148 178 L 140 274 L 126 344 L 112 392 L 102 420 M 214 156 Q 260 150 272 178 L 280 274 L 292 344 L 308 392 L 320 420 M 211 294 L 193 332 L 186 456 L 180 584 L 178 666 M 211 294 L 227 332 L 234 456 L 240 584 L 242 666" />
          </g>
          <g fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.3">
            <path d="M 203 154 C 186 150 171 168 169 194 C 167 216 172 232 186 233 C 196 234 203 224 204 208 Z" />
            <path d="M 217 154 C 234 150 249 168 251 194 C 253 216 248 232 234 233 C 226 234 222 225 220 214 C 218 202 216 182 217 154 Z" />
          </g>
          <path d="M 211 180 C 204 176 198 184 199 196 C 200 209 211 220 221 221 C 228 221 229 208 226 196 C 224 185 218 180 211 180 Z" fill="#FECACA" stroke="#B91C1C" strokeWidth="1.6" />

          {/* Vital Callouts */}
          {CALLOUTS.map((item) => {
            const isSelected = selectedVital === item.vitalKey;
            const status = metricStatus(values, item.vitalKey);
            const color = statusStrokeColor(status, isSelected);
            const isLeft = item.side === 'left';
            const lineStartX = isLeft ? 88 : 332;
            const textX = isLeft ? 10 : 410;

            return (
              <g key={item.id} onClick={() => onSelectVital(item.vitalKey)} className="cursor-pointer group" role="button" tabIndex={0} aria-label={`${item.label}: ${status}`} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelectVital(item.vitalKey); } }}>
                <polyline points={`${lineStartX},${item.labelY} ${item.elbowX},${item.labelY} ${item.targetX},${item.targetY}`} fill="none" stroke={color} strokeWidth="1.6" />
                <circle cx={item.targetX} cy={item.targetY} r="3.6" fill={color} stroke="#FFFFFF" strokeWidth="1" />
                <text x={textX} y={item.labelY - 3} textAnchor={isLeft ? 'start' : 'end'} fill={color} className="font-display font-bold" style={{ fontSize: '13px' }}>{item.label}</text>
                <text x={textX} y={item.labelY + 11} textAnchor={isLeft ? 'start' : 'end'} fill="#475569" className="font-sans font-medium" style={{ fontSize: '10px' }}>{item.sublabel}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
};

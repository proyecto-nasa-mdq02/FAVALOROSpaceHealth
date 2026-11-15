// ===================================================================================
//  FAVALORO SPACEHEALTH - MOTOR JS PURO (HTML/CSS/JS)
//  Funciona sin backend y sin conexión a internet (íconos SVG embebidos).
//  Stack actual: solo HTML, CSS y JavaScript vanilla. Sin React/Next.js/Tailwind.
// ===================================================================================

/* ------------------------------------------------------------------ */
/*  ÍCONOS SVG EMBEBIDOS (no dependen de Google Fonts ni de internet) */
/* ------------------------------------------------------------------ */

const ICON_SVG = {
  public: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  home: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  show_chart: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 14h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8"/><polyline points="18 14 12 18 6 14"/></svg>`,
  auto_awesome: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1l3 9h-5l3 -9"/><path d="M19 3l-5 5l3 9l-9 -3l-3 -9z"/><circle cx="12" cy="12" r="3"/></svg>`,
  monitoring: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  face: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 9c0 3.9 3.2 7 7 7h4c3.8 0 7-3.1 7-7V5l-4 -3l-4 3l-4 -3V9z"/><circle cx="9" cy="9" r="1"/><circle cx="15" cy="9" r="1"/><path d="M9 12c1.7 1.7 4.3 1.7 6 0"/></svg>`,
  settings: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-1a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1h-1a2 2 0 0 1-2-2 2 2 0 0 1 2-2h1a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v1a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1h1a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-1a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  health_and_safety: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12h6v6H9z"/><path d="M9 20h6a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"/></svg>`,
  check_circle: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="20 6 9 17 4 12"/></svg>`,
  arrow_forward: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  stars: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  arrow_back: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
  monitor_heart: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h3m6 0h3a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H9m0 12a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h3m6 0h3a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2z"/><line x1="12" y1="13" x2="12" y2="19"/><line x1="12" y1="5" x2="12" y2="11"/></svg>`,
  groups: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-4-4h-3a4 4 0 0 0-4 4v2"/></svg>`,
  schedule: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  play_arrow: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  refresh: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 4v6h6"/><path d="M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64-4.36A9 9 0 0 1 3.51 15"/></svg>`,
  close: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  science: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="4"/><line x1="12" y1="20" x2="12" y2="4"/><path d="M5 20h14"/><path d="M17 8h3"/></svg>`,
  military_tech: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-7a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v7"/><path d="M3 16l9-8 9 8"/><path d="M12 18l-4-6"/></svg>`,
  bedtime: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13h18v-8H3z"/><path d="M7 21v-5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v5"/><path d="M17 21v-4"/><path d="M9 21v-5"/></svg>`,
  psychology: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 19V3"/><path d="M5 19h14"/><circle cx="12" cy="8" r="2"/></svg>`,
  balance: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c4.713 0 7.052-2.167 9.039-5.323a10 10 0 0 0 0-9.354A10 10 0 0 0 19.052 3c-1.987-3.156-4.326-5.323-9.052-5.323S2.948 6.156 0.961 9.323a10 10 0 0 0 0 9.354A10 10 0 0 0 4.948 21c1.987 3.156 4.326 5.323 9.052 5.323z"/><circle cx="12" cy="12" r="2"/></svg>`,
  ecg_heart: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.284 13l-7.57-6.934c-.439-.402-1.134-.402-1.573 0l-7.57 6.934c-.439.402-.439 1.052 0 1.454l5.754 5.27c.242.222.56.333.886.333s.644-.111.886-.333l5.27-4.83c.439-.402.439-1.052 0-1.454z"/><path d="M17 16.41A3 3 0 1 1 17 10.41z"/></svg>`,
  air: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y1="3"/></svg>`,
  blood_pressure: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  device_thermostat: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="16" rx="2" ry="2"/><line x1="12" y1="15" x2="12" y2="23"/><line x1="12" y1="7" x2="12" y2="11"/><path d="M7 11H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"/><path d="M19 21H17a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2"/></svg>`,
  water_drop: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s6-4 6-10a5 5 0 0 0-5-5a5 5 0 0 0-5 5c0 6 6 10 6 10z"/></svg>`,
  visibility: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  photo_camera: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  arrow_outward: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 15v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5"/></svg>",
  menu: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
};

/* ------------------------------------------------------------------ */
/*  FUNCIÓN: reemplazar íconos material-symbols por SVG embebido       */
/* ------------------------------------------------------------------ */

function initIcons() {
  document.querySelectorAll(".material-symbols-rounded").forEach((el) => {
    const name = el.textContent.trim();
    const size = el.style.fontSize || "19px";
    const style = el.getAttribute("style") || "";
    const svg = ICON_SVG[name] || `<span>${name}</span>`;
    const wrapper = document.createElement("span");
    wrapper.className = "icon-svg";
    wrapper.style.cssText = `display:inline-block;width:${size};height:${size};vertical-align:middle;${style}`;
    wrapper.innerHTML = svg;
    el.parentNode.replaceChild(wrapper, el);
  });
}

/* ------------------------------------------------------------------ */
/*  DATOS MOCK EMBEBIDOS (funciona sin backend)                       */
/* ------------------------------------------------------------------ */

const DATA = {
  timestamp: "2026-11-14T13:30:00Z",
  astronaut: {
    id: 1,
    usuario: "esp_david",
    nombres: "David",
    apellidos: "Bravo",
    codigo_astronauta: "AST-004",
    racha_autocuidado: 5,
  },
  vitals: {
    heart_rate: { value: 74, unit: "bpm", status: "GREEN", label: "Frecuencia cardíaca", icon: "ecg_heart", tone: "heart" },
    spo2: { value: 98, unit: "%", status: "GREEN", label: "Oxígeno en sangre", icon: "air", tone: "oxygen" },
    blood_pressure: { systolic: 118, diastolic: 76, unit: "mmHg", status: "GREEN", label: "Presión arterial", icon: "blood_pressure", tone: "pressure" },
    body_temperature: { value: 36.7, unit: "°C", status: "GREEN", label: "Temperatura corporal", icon: "device_thermostat", tone: "temperature" },
    blood_glucose: { value: 95, unit: "mg/dL", status: "GREEN", label: "Glucosa en sangre", icon: "water_drop", tone: "glucose" },
  },
  analitica: {
    total_lecturas: 7,
    promedios: {
      frecuencia_cardiaca: 74,
      glucosa_mg_dl: 95,
      horas_sueno: 7.2,
      presion_media: 90,
      estado_animo: 5,
    },
    series: {
      fechas: ["07:30","08:30","09:30","10:30","11:30","12:30","13:30"],
      frecuencia_cardiaca: [72, 76, 73, 78, 75, 74, 74],
      presion_sistolica: [116, 119, 117, 121, 118, 118, 118],
      glucosa_mg_dl: [92, 96, 94, 101, 97, 95, 95],
    },
  },
};

/* ------------------------------------------------------------------ */
/*  UTILIDADES */
/* ------------------------------------------------------------------ */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function statusPill(status) {
  const map = { GREEN: "status-green", YELLOW: "status-yellow", RED: "status-red" };
  const label = { GREEN: "En rango", YELLOW: "Atención", RED: "Crítico" };
  return `<span class="status-pill ${map[status] || 'status-green'}"><span class="status-dot"></span>${label[status] || 'En rango'}</span>`;
}

/* ------------------------------------------------------------------ */
/*  SISTEMA DE IDIOMAS (ES / EN) - SIN REACT, SOLO JS PURO           */
/* ------------------------------------------------------------------ */

const currentLang = { value: "es" };

const TRANSLATIONS = {
  es: {
    appTitle: "FAVALORO SpaceHealth - Tu chequeo de hoy",
    hoy: "Hoy", tendencia: "Tendencia", plan: "Plan", medidas: "Medidas", espejo: "Espejo", admin: "Admin",
    tripulacion: "PANEL DE TRIPULACIÓN", demo: "DEMO",
    areaPersonal: "Área personal / tripulación", chequeoHoy: "Tu chequeo de hoy",
    resumenSalud: "Resumen de salud", datosDemo: "Datos de demostración",
    senalesRevisar: "señales por revisar", recomendacionPrev: "Recomendación preventiva",
    resumenDiario: "Resumen diario", lecturaActual: "Lectura actual",
    signosVitales: "Todos los signos vitales", verSignosVitales: "Ver signos vitales",
    planBienestar: "Tu plan de bienestar",
    accionesOpcionales: "Acciones pequeñas y opcionales basadas en la recomendación de ejemplo.",
    telemetriaSimulada: "Telemetría simulada", actualizado: "Actualizado 13:30 UTC",
    panelSupervision: "FAVALORO SpaceHealth - Panel de supervisión",
    healthMonitoring: "Health Monitoring", registroDemo: "Registro de demostración",
    monitor: "Monitor", resumen: "Resumen", notificaciones: "Notificaciones",
    contextoTripulacion: "Contexto de la tripulación", registroTripulacion: "Registro de tripulación",
    flujoDemoPausado: "Flujo demo pausado", reproducirMuestras: "Reproducir muestras",
    siguienteMuestra: "Siguiente muestra",
    lecturaActualAdmin: "Lectura actual", telemetriaEjemplo: "Telemetría de ejemplo",
    evolucionMediciones: "Evolución de tus mediciones", ultima6Horas: "Últimas 6 horas · Demo",
    lenguaje: "Idioma", espanol: "Español", ingles: "Inglés",
  },
  en: {
    appTitle: "FAVALORO SpaceHealth - Today's checkup",
    hoy: "Today", tendencia: "Trends", plan: "Plan", medidas: "Measures", espejo: "Mirror", admin: "Admin",
    tripulacion: "CREW DASHBOARD", demo: "DEMO",
    areaPersonal: "Personal area / crew", chequeoHoy: "Your check-up today",
    resumenSalud: "Health summary", datosDemo: "Demo data",
    senalesRevisar: "signals to review", recomendacionPrev: "Preventive recommendation",
    resumenDiario: "Daily summary", lecturaActual: "Current readings",
    signosVitales: "All vital signs", verSignosVitales: "View vital signs",
    planBienestar: "Your wellbeing plan",
    accionesOpcionales: "Small optional actions based on the demo recommendation.",
    telemetriaSimulada: "Simulated telemetry", actualizado: "Updated 13:30 UTC",
    panelSupervision: "FAVALORO SpaceHealth - Supervision panel",
    healthMonitoring: "Health Monitoring", registroDemo: "Demo record",
    monitor: "Monitor", resumen: "Summary", notificaciones: "Notifications",
    contextoTripulacion: "Crew context", registroTripulacion: "Crew record",
    flujoDemoPausado: "Demo flow paused", reproducirMuestras: "Play samples",
    siguienteMuestra: "Next sample",
    lecturaActualAdmin: "Current reading", telemetriaEjemplo: "Sample telemetry",
    evolucionMediciones: "Trend of your measurements", ultima6Horas: "Last 6 hours · Demo",
    lenguaje: "Language", espanol: "Spanish", ingles: "English",
  },
};

function setLanguage(lang) {
  currentLang.value = lang;
  try { localStorage.setItem("spacehealth-lang", lang); } catch {}
  applyLanguage();
}

function t(key) {
  return TRANSLATIONS[currentLang.value]?.[key] || key;
}

function applyLanguage() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  if (page === "index.html" || page === "") document.title = t("appTitle");
  else if (page === "admin.html") document.title = t("panelSupervision");

  const cap = document.querySelector(".crew-sidebar-caption");
  if (cap) cap.textContent = t("tripulacion");

  const demoChip = document.querySelector(".demo-chip");
  if (demoChip) demoChip.textContent = t("demo");

  $$(".lang-btn").forEach((b) => {
    b.className = `lang-btn ${b.dataset.lang === currentLang.value ? "lang-active" : ""}`;
  });

  // Re-render contenido de la página actual según idioma
  if (page === "index.html" || page === "") renderHoy();
  else if (page === "trends.html") renderTrends();
  else if (page === "plan.html") renderPlan();
  else if (page === "measures.html") renderMeasures();
  else if (page === "mirror.html") renderMirror();
  else if (page === "admin.html") renderAdmin();
}

/* ------------------------------------------------------------------ */
/*  PÁGINA: HOY (index.html) - Pantalla principal                     */
/* ------------------------------------------------------------------ */

function renderHoy() {
  const container = $("#vitals-highlights-container");
  if (!container) return;

  const items = [
    DATA.vitals.heart_rate,
    DATA.vitals.spo2,
    DATA.vitals.blood_pressure,
    DATA.vitals.body_temperature,
    DATA.vitals.blood_glucose,
  ];

  container.innerHTML = items.map((v) => {
    const value = v.blood_pressure
      ? `${v.systolic}/${v.diastolic}`
      : `${v.value} ${v.unit}`;
    return `
      <a href="trends.html" class="vitals-highlight vitals-highlight-${v.tone}" style="text-decoration:none;color:inherit;">
        <span class="vitals-highlight-top">
          <span class="vitals-highlight-icon">${ICON_SVG[v.icon]}</span>
          <span class="vitals-highlight-label">${v.label}</span>
        </span>
        <strong>${value}<small>${v.unit}</small></strong>
        ${statusPill(v.status)}
      </a>
    `;
  }).join("");

  const nombreEl = $("#nombre-astronauta");
  const misionEl = $("#mision-astronauta");
  if (nombreEl) nombreEl.textContent = `${DATA.astronaut.nombres} ${DATA.astronaut.apellidos}`;
  if (misionEl) misionEl.textContent = DATA.astronaut.codigo_astronauta;

  const rachaEl = document.getElementById("lbl-racha");
  if (rachaEl) rachaEl.textContent = `${DATA.astronaut.racha_autocuidado || 0} Días Sol`;
}

/* ------------------------------------------------------------------ */
/*  PÁGINA: TENDENCIAS (trends.html)                                 */
/* ------------------------------------------------------------------ */

let trendMetric = "heart_rate";
let trendHours = 6;

function drawTrendChart(canvasId, valores) {
  const canvas = $(`#${canvasId}`);
  if (!canvas || !valores || valores.length === 0) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const minVal = Math.min(...valores) * 0.9;
  const maxVal = Math.max(...valores) * 1.1 || 10;

  const padL = 42, padR = 20, padT = 10, padB = 20;

  ctx.strokeStyle = "#e9eeeb";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padT + ((H - padT - padB) / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(W - padR, y);
    ctx.stroke();
  }

  const color = trendMetric === "heart_rate" ? "#bc5148" : trendMetric === "spo2" ? "#167b8b" : trendMetric === "blood_pressure" ? "#9b6b10" : trendMetric === "body_temperature" ? "#bf633e" : "#6e639c";

  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  valores.forEach((v, i) => {
    const x = padL + (i / Math.max(valores.length - 1, 1)) * (W - padL - padR);
    const y = padT + (1 - (v - minVal) / (maxVal - minVal || 1)) * (H - padT - padB);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  valores.forEach((v, i) => {
    const x = padL + (i / Math.max(valores.length - 1, 1)) * (W - padL - padR);
    const y = padT + (1 - (v - minVal) / (maxVal - minVal || 1)) * (H - padT - padB);
    ctx.fillStyle = i === valores.length - 1 ? "#ff9800" : "#fff";
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });
}

async function renderTrends() {
  $$(".metric-picker-option").forEach((btn) => {
    const id = btn.id.replace("btn-trend-", "");
    btn.className = `metric-picker-option ${id === trendMetric ? "metric-picker-option-active" : ""}`;
    btn.setAttribute("aria-pressed", id === trendMetric);
    btn.onclick = () => { trendMetric = id; renderTrends(); };
  });

  $$(".trend-period-button").forEach((btn) => {
    const h = parseInt(btn.id.replace("btn-period-", ""), 10);
    btn.className = `trend-period-button ${h === trendHours ? "trend-period-button-active" : ""}`;
    btn.setAttribute("aria-pressed", h === trendHours);
    btn.onclick = () => { trendHours = h; renderTrends(); };
  });

  const configLabel = {
    heart_rate: "Frecuencia cardíaca",
    spo2: "Oxígeno en sangre",
    blood_pressure: "Presión arterial sistólica",
    body_temperature: "Temperatura corporal",
    blood_glucose: "Glucosa en sangre",
  };
  const configUnit = {
    heart_rate: "bpm",
    spo2: "%",
    blood_pressure: "mmHg",
    body_temperature: "°C",
    blood_glucose: "mg/dL",
  };
  const configColor = {
    heart_rate: "#bc5148",
    spo2: "#167b8b",
    blood_pressure: "#9b6b10",
    body_temperature: "#bf633e",
    blood_glucose: "#6e639c",
  };

  const titleEl = $("#trend-title");
  const unitEl = $("#trend-unit");
  if (titleEl) titleEl.textContent = configLabel[trendMetric];
  if (unitEl) { unitEl.textContent = configUnit[trendMetric]; unitEl.style.color = configColor[trendMetric]; }

  const eyebrow = $("#tendencias .eyebrow");
  if (eyebrow) eyebrow.textContent = `Últimas ${trendHours} horas · Demo`;

  const keyMap = {
    heart_rate: "frecuencia_cardiaca",
    spo2: "glucosa_mg_dl",
    blood_pressure: "presion_sistolica",
    body_temperature: "temperatura_c",
    blood_glucose: "glucosa_mg_dl",
  };
  const series = DATA.analitica.series[keyMap[trendMetric]] || [];

  drawTrendChart("trend-chart", series);
  drawTrendChart("admin-trend-chart", series);
}

/* ------------------------------------------------------------------ */
/*  PÁGINA: PLAN DE BIENESTAR (plan.html)                            */
/* ------------------------------------------------------------------ */

const PLAN_TASKS = [
  { id: "water", label: "Tomar agua según mi rutina" },
  { id: "exercise", label: "Realizar el ejercicio programado" },
];

const PLAN_MEDALS = [
  { id: "granite", title: "Granito de las Sierras", description: "Una medalla de piedra inspirada en las sierras graníticas del centro argentino.", icon: "terrain", tone: "granite", cost: 5 },
  { id: "rodocrosite", title: "Rodocrosita argentina", description: "Una medalla mineral rosada inspirada en la piedra nacional de Argentina.", icon: "diamond", tone: "rodocrosite", cost: 10 },
  { id: "basalt", title: "Basalto patagónico", description: "Una medalla de roca volcánica oscura inspirada en la Patagonia.", icon: "landscape", tone: "basalt", cost: 15 },
];

const PLAN_STORAGE_KEY = "spacehealth-wellbeing-rewards";

function getTodayKey() { return new Date().toISOString().slice(0, 10); }

let planState = { date: getTodayKey(), completedToday: [], creditedToday: [], points: 0, redeemedRewards: [] };

function loadPlan() {
  try {
    const saved = localStorage.getItem(PLAN_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const today = getTodayKey();
      const isSameDay = parsed.date === today;
      planState = {
        date: today,
        completedToday: isSameDay ? (parsed.completedToday || []).filter((id) => PLAN_TASKS.some((t) => t.id === id)) : [],
        creditedToday: isSameDay ? (parsed.creditedToday || []).filter((id) => PLAN_TASKS.some((t) => t.id === id)) : [],
        points: typeof parsed.points === "number" ? Math.max(0, parsed.points) : 0,
        redeemedRewards: (parsed.redeemedRewards || []).filter((id) => PLAN_MEDALS.some((m) => m.id === id)),
      };
    }
  } catch {}
}

function savePlan() { try { localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(planState)); } catch {} }

function toggleTask(taskId) {
  const today = getTodayKey();
  if (planState.date !== today) {
    planState = { ...planState, date: today, completedToday: [], creditedToday: [] };
  }
  const isComplete = planState.completedToday.includes(taskId);
  const shouldCredit = !isComplete && !planState.creditedToday.includes(taskId);

  planState.completedToday = isComplete
    ? planState.completedToday.filter((id) => id !== taskId)
    : [...planState.completedToday, taskId];
  if (shouldCredit) {
    planState.creditedToday = [...planState.creditedToday, taskId];
    planState.points += 5;
  }
  savePlan();
  renderPlan();
}

function redeemReward(medalId, cost) {
  if (planState.points < cost || planState.redeemedRewards.includes(medalId)) return;
  planState.points -= cost;
  planState.redeemedRewards = [...planState.redeemedRewards, medalId];
  savePlan();
  renderPlan();
}

function renderPlan() {
  if (!$("#plan-puntos")) return;

  const today = getTodayKey();
  if (planState.date !== today) {
    planState = { ...planState, date: today, completedToday: [], creditedToday: [] };
    savePlan();
  }

  const completedCount = planState.completedToday.length;
  const earnedToday = planState.creditedToday.length * 5;
  const totalTasks = PLAN_TASKS.length;

  $("#plan-puntos").textContent = planState.points;
  $("#plan-puntos").nextElementSibling && ($("#plan-puntos").nextElementSibling.textContent = "puntos");
  $("#plan-ganados").textContent = `+${earnedToday} ganados hoy`;
  $("#plan-progreso").textContent = `${completedCount} de ${totalTasks} acciones completadas`;
  $("#plan-prompt").textContent = completedCount === totalTasks
    ? "¡Buen trabajo! Completaste las acciones opcionales que elegiste."
    : "Elige la acción que encaje con tu rutina. No pasa nada si hoy la dejas para después.";
  const pct = totalTasks ? (completedCount / totalTasks) * 100 : 0;
  $("#plan-barra-progreso").style.width = `${pct}%`;
  $("#plan-medallas").textContent = `${planState.redeemedRewards.length} de ${PLAN_MEDALS.length} medallas reunidas`;

  const taskList = document.querySelector(".task-list");
  if (taskList) {
    taskList.innerHTML = PLAN_TASKS.map((task) => {
      const isCompleted = planState.completedToday.includes(task.id);
      return `
        <button type="button" class="task-row ${isCompleted ? "task-completed" : ""}" data-task="${task.id}" aria-pressed="${isComplete ? 'true' : 'false'}">
          <span class="task-checkbox" id="chk-${task.id}">${isCompleted ? ICON_SVG.check : ""}</span>
          <span>${task.label}</span>
        </button>
      `;
    }).join("");
    taskList.querySelectorAll("button").forEach((btn) => {
      btn.onclick = () => toggleTask(btn.dataset.task);
    });
  }

  const medalsContainer = $("#medallas-container");
  if (medalsContainer) {
    medalsContainer.innerHTML = PLAN_MEDALS.map((medal) => {
      const isRedeemed = planState.redeemedRewards.includes(medal.id);
      const canRedeem = planState.points >= medal.cost && !isRedeemed;
      return `
        <article class="medal-card medal-card-${medal.tone} ${isRedeemed ? "medal-card-collected" : ""}">
          <span class="medal-emblem" aria-hidden="true">
            <span class="medal-stone medal-stone-${medal.tone}"></span>
          </span>
          <strong>${medal.title}</strong>
          <p>${medal.description}</p>
          <span class="medal-cost">${ICON_SVG.stars} ${medal.cost} puntos</span>
          <button type="button" class="medal-button" ${!canRedeem ? "disabled" : ""}>
            ${isRedeemed ? "Añadida" : "Canjear"}
          </button>
          ${!isRedeemed && !canRedeem ? `<small class="medal-lock-note">Necesitas más puntos para esta recompensa.</small>` : ""}
        </article>
      `;
    }).join("");
    medalsContainer.querySelectorAll(".medal-button").forEach((btn, i) => {
      const medal = PLAN_MEDALS[i];
      const isRedeemed = planState.redeemedRewards.includes(medal.id);
      const canRedeem = planState.points >= medal.cost && !isRedeemed;
      if (!isRedeemed && canRedeem) btn.onclick = () => redeemReward(medal.id, medal.cost);
    });
  }
}

/* ------------------------------------------------------------------ */
/*  PÁGINA: MEDIDAS ESTÁNDAR (measures.html)                         */
/* ------------------------------------------------------------------ */

function renderMeasures() {
  const container = $("#measures-lista");
  if (!container) return;

  const sections = [
    {
      title: "Sueño y actividad", subtitle: "Actigrafía", tone: "sky", icon: "bedtime", status: "GREEN",
      values: [
        { label: "Tiempo de sueño", value: `${DATA.analitica.promedios.horas_sueno} h`, explanation: "Duración total del sueño registrada." },
        { label: "Eficiencia del sueño", value: "88.5%", explanation: "Porcentaje estimado de tiempo dormido." },
      ],
    },
    {
      title: "Cognición", subtitle: "Pruebas cognitivas", tone: "lilac", icon: "psychology", status: "GREEN",
      values: [
        { label: "Atención sostenida", value: "94", explanation: "Puntaje de una tarea de atención." },
        { label: "Orientación espacial", value: "91", explanation: "Puntaje de una tarea de orientación." },
      ],
    },
    {
      title: "Bienestar conductual", subtitle: "Encuestas de bienestar", tone: "lemon", icon: "groups", status: "GREEN",
      values: [
        { label: "Estado de ánimo (PANAS)", value: Math.round(DATA.analitica.promedios.estado_animo), explanation: "Resultado del cuestionario de estado de ánimo." },
        { label: "Cohesión del equipo", value: "9.2", explanation: "Índice informado para el equipo." },
      ],
    },
    {
      title: "Sensorimotor", subtitle: "Equilibrio y movimiento", tone: "coral", icon: "balance", status: "GREEN",
      values: [
        { label: "Mareo por movimiento", value: "2 / 20", explanation: "Puntaje en la escala indicada en el registro." },
        { label: "Estabilidad postural", value: "Estable", explanation: "Resumen de la prueba de postura." },
      ],
    },
  ];

  container.innerHTML = sections.map((s) => {
    const valuesHtml = s.values.map((v) => `
      <div class="measure-value">
        <span>${v.label}</span>
        <strong>${v.value}</strong>
        <small>${v.explanation}</small>
      </div>
    `).join("");
    return `
      <article class="measure-item">
        <div class="measure-icon metric-icon-${s.tone}">${ICON_SVG[s.icon]}</div>
        <div class="measure-content">
          <div class="measure-title-row">
            <div><h3>${s.title}</h3><span>${s.subtitle}</span></div>
            ${statusPill(s.status)}
          </div>
          <div class="measure-values">${valuesHtml}</div>
        </div>
      </article>
    `;
  }).join("");
}

/* ------------------------------------------------------------------ */
/*  PÁGINA: ESPEJO INTELIGENTE (mirror.html)                         */
/* ------------------------------------------------------------------ */

function renderMirror() {
  const m = { facial_edema_index: 1.04, paleness_colorimetry_ratio: 0.98, ocular_fatigue_score: "LOW", quality_gate_passed: true, capture_timestamp: new Date().toISOString() };
  const capEl = $("#mirror-captura");
  if (capEl) {
    const d = new Date(m.capture_timestamp);
    capEl.textContent = `Captura demostrativa · ${d.getUTCHours().toString().padStart(2, "0")}:${d.getUTCMinutes().toString().padStart(2, "0")} UTC`;
  }

  const indicadores = $("#mirror-indicadores");
  if (indicadores) {
    indicadores.innerHTML = `
      <div class="mirror-indicator">
        <span class="mirror-indicator-icon">${ICON_SVG.face}</span>
        <span class="mirror-indicator-label">Índice de edema facial</span>
        <strong>${m.facial_edema_index}</strong>
        <small>Indicador visual sin unidad especificada.</small>
      </div>
      <div class="mirror-indicator">
        <span class="mirror-indicator-icon">${ICON_SVG.visibility}</span>
        <span class="mirror-indicator-label">Colorimetría de palidez</span>
        <strong>${m.paleness_colorimetry_ratio}</strong>
        <small>Relación de color sin unidad especificada.</small>
      </div>
      <div class="mirror-indicator mirror-indicator-wide">
        <span class="mirror-indicator-icon">${ICON_SVG.visibility}</span>
        <span class="mirror-indicator-label">Fatiga ocular</span>
        <strong>${m.ocular_fatigue_score === "LOW" ? "Baja" : m.ocular_fatigue_score}</strong>
        <small>Puntaje descrito en el registro.</small>
      </div>
    `;
  }

  const checkEl = document.querySelector(".capture-check");
  if (checkEl) {
    checkEl.className = `capture-check ${m.quality_gate_passed ? "capture-passed" : "capture-failed"}`;
    checkEl.innerHTML = m.quality_gate_passed ? ICON_SVG.check : ICON_SVG.photo_camera;
  }
}

/* ------------------------------------------------------------------ */
/*  PÁGINA: ADMIN (admin.html)                                        */
/* ------------------------------------------------------------------ */

let adminSection = "monitor";

function renderAdmin() {
  const tAdminTitle = $("#admin-title-monitor");
  if (tAdminTitle) tAdminTitle.textContent = t("healthMonitoring");
  const tAdminRegistro = $("#admin-registro-demo");
  if (tAdminRegistro) tAdminRegistro.textContent = t("registroDemo");

  $$(".admin-nav-link").forEach((link) => {
    const href = link.getAttribute("href").replace("#", "");
    link.className = `admin-nav-link ${href === adminSection ? "admin-nav-link-active" : ""}`;
    link.setAttribute("aria-current", href === adminSection ? "page" : "undefined");
    link.onclick = (e) => { e.preventDefault(); adminSection = href; renderAdmin(); };
  });

  const secciones = ["monitor", "resumen", "tendencias", "medidas", "alertas"];
  secciones.forEach((s) => {
    const el = $(`#${s}`);
    if (el) el.style.display = s === adminSection ? (s === "monitor" ? "grid" : "block") : "none";
  });

  const vitalsGrid = $("#admin-vitals-grid");
  if (vitalsGrid && adminSection === "monitor") {
    const vitals = [
      DATA.vitals.heart_rate,
      DATA.vitals.spo2,
      DATA.vitals.blood_pressure,
      DATA.vitals.body_temperature,
    ];
    vitalsGrid.innerHTML = vitals.map((v) => {
      const toneMap = { heart: "mint", oxygen: "sky", pressure: "coral", temperature: "lemon" };
      const tone = v.tone ? toneMap[v.tone] : "mint";
      const value = v.blood_pressure ? `${v.systolic}/${v.diastolic} ${v.unit}` : `${v.value} ${v.unit}`;
      return `
        <div class="metric-card metric-card-${tone} metric-card-selected">
          <div class="metric-icon metric-icon-${tone}">${ICON_SVG[v.icon]}</div>
          <div class="metric-label">${v.label}</div>
          <div class="metric-reading">${value}</div>
          <div class="metric-description">Lectura de demostración</div>
          <div class="metric-status"><span class="metric-trend-hint">Sin variación crítica</span>${statusPill(v.status)}</div>
        </div>
      `;
    }).join("");
  }

  const adminMeasures = $("#admin-measures-lista");
  if (adminMeasures && adminSection === "medidas") {
    renderMeasuresInto(adminMeasures);
  }
}

function renderMeasuresInto(container) {
  const sections = [
    {
      title: "Sueño y actividad", subtitle: "Actigrafía", tone: "sky", icon: "bedtime", status: "GREEN",
      values: [
        { label: "Tiempo de sueño", value: `${DATA.analitica.promedios.horas_sueno} h`, explanation: "Duración total del sueño registrada." },
        { label: "Eficiencia del sueño", value: "88.5%", explanation: "Porcentaje estimado de tiempo dormido." },
      ],
    },
    {
      title: "Cognición", subtitle: "Pruebas cognitivas", tone: "lilac", icon: "psychology", status: "GREEN",
      values: [
        { label: "Atención sostenida", value: "94", explanation: "Puntaje de una tarea de atención." },
        { label: "Orientación espacial", value: "91", explanation: "Puntaje de una tarea de orientación." },
      ],
    },
    {
      title: "Bienestar conductual", subtitle: "Encuestas de bienestar", tone: "lemon", icon: "groups", status: "GREEN",
      values: [
        { label: "Estado de ánimo (PANAS)", value: Math.round(DATA.analitica.promedios.estado_animo), explanation: "Resultado del cuestionario de estado de ánimo." },
        { label: "Cohesión del equipo", value: "9.2", explanation: "Índice informado para el equipo." },
      ],
    },
    {
      title: "Sensorimotor", subtitle: "Equilibrio y movimiento", tone: "coral", icon: "balance", status: "GREEN",
      values: [
        { label: "Mareo por movimiento", value: "2 / 20", explanation: "Puntaje en la escala indicada en el registro." },
        { label: "Estabilidad postural", value: "Estable", explanation: "Resumen de la prueba de postura." },
      ],
    },
  ];

  container.innerHTML = sections.map((s) => {
    const valuesHtml = s.values.map((v) => `
      <div class="measure-value">
        <span>${v.label}</span>
        <strong>${v.value}</strong>
        <small>${v.explanation}</small>
      </div>
    `).join("");
    return `
      <article class="measure-item">
        <div class="measure-icon metric-icon-${s.tone}">${ICON_SVG[s.icon]}</div>
        <div class="measure-content">
          <div class="measure-title-row">
            <div><h3>${s.title}</h3><span>${s.subtitle}</span></div>
            ${statusPill(s.status)}
          </div>
          <div class="measure-values">${valuesHtml}</div>
        </div>
      </article>
    `;
  }).join("");
}

/* ------------------------------------------------------------------ */
/*  INICIALIZACIÓN (se ejecuta inmediatamente)                        */
/* ------------------------------------------------------------------ */

function init() {
  // 1. Reemplazar todos los íconos material-symbols-rounded por SVG embebido
  initIcons();

  // 2. Restaurar idioma guardado
  try {
    const saved = localStorage.getItem("spacehealth-lang");
    if (saved && (saved === "es" || saved === "en")) {
      currentLang.value = saved;
    }
  } catch {}

  const path = window.location.pathname;
  const page = path.split("/").pop() || "index.html";

  // 3. Navegación activa común (si existe el elemento)
  $$(".nav-menu li a").forEach((a) => {
    a.className = a.getAttribute("href") === page ? "active" : "";
  });

  // 4. Renderizar página actual
  if (page === "index.html" || page === "") renderHoy();
  else if (page === "trends.html") renderTrends();
  else if (page === "plan.html") { loadPlan(); renderPlan(); }
  else if (page === "measures.html") renderMeasures();
  else if (page === "mirror.html") renderMirror();
  else if (page === "admin.html") renderAdmin();
}

// Ejecutar inmediatamente (no esperar a DOMContentLoaded porque el script carga al final del <body>)
init();
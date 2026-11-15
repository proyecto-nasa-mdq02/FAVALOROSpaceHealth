# FAVALORO SpaceHealth - NASA Space Apps Challenge 2026

## Frontend & Project Integration Guide (README v3)

---

## 1. Project Summary (NASA Space Apps Submission Format)

**Project Title**: FAVALORO SpaceHealth - First Autonomous Vital Analysis & Longitudinal Observational Response in Orbit

**Summary**:
Long-duration space missions expose astronauts to critical occupational hazards, including cosmic radiation, microgravity fluid shifts, isolation, and hostile closed environments. Named in honor of Dr. René Favaloro, pioneer of cardiovascular surgery, FAVALORO SpaceHealth (First Autonomous Vital Analysis & Longitudinal Observational Response in Orbit) is an autonomous, non-invasive health monitoring platform designed to provide crew self-assessment without relying blindly on black-box AI algorithms.

The platform integrates two core operational layers:
1. **Continuous Physiological Telemetry Ingestion**: Real-time tracking of vital signs (heart rate, SpO2, blood pressure, body temperature, and glucose) governed by a **Deterministic Clinical Rule Engine (Human-in-the-Loop)** based on medical standards.
2. **The Cabin Smart Mirror**: Passive, zero-friction 3-times-daily visual facial biomarker tracking (facial edema, skin colorimetry/paleness, ocular fatigue) featuring quality-gated capture validation.

Aligned with **NASA Standard Measures** and **HRP 5 Spaceflight Hazards**, FAVALORO SpaceHealth delivers instant color-coded clinical alerts (Green/Yellow/Red) and actionable preventive countermeasures to preserve astronaut well-being on lunar and Martian exploration missions.

---

## 2. Project Demonstration & Submission Requirements

- **Demo Link**: Publicly accessible URL (Video <= 30 seconds or Slide Deck <= 7 slides).
- **Project Link**: Public GitHub Repository / Deployment URL.
- **Access Control**: No passwords, permissions, or registration required for judges.

---

## 3. NASA Data & Partner Resources

### NASA Spaceflight Standard Measures (SSM)
- **Investigation**: Spaceflight Standard Measures - collects core measurements related to human spaceflight risks from astronauts before, during, and after ISS missions
- **Purpose**: Ensure consistent capture of an optimized set of measurements to characterize adaptive responses to living and working in space
- **Data Repository**: Populates a data repository enabling high-level monitoring of countermeasure effectiveness and meaningful interpretation of health and performance outcomes
- **Categories Include**:
  - **Actigraphy**: Actiwatch Spectrum Plus system for sleep-wake patterns and circadian alignment
  - **Cognition**: Computer-based test battery (10 brief tests) evaluating visual object learning, memory, attention, abstraction, spatial orientation, emotion recognition, risk decision making, sensorimotor ability, and vigilant attention
  - **Sleep**: Questionnaires post-sleep and pre-sleep focusing on sleep quality, mood, team cohesion, and habitability
  - **Behavioral Health**: Monthly questionnaires on team dynamics and performance
  - **Sensorimotor Tests**: Sit-to-stand, walk and turn, recovery from fall, tandem walk, and motion sickness evaluation (0-20 scale)
  - **Metabolic/Immune**: Blood and saliva samples for comprehensive metabolic panels, chemistry panels, and immune function assessment
  - **Microbiome**: Saliva, fecal, skin, and nasal swabs collected before, during, and after flight
  - **Cardiovascular**: Ultrasound scans, blood pressure, and heart rate measurements
  - **Isometric Mid-Thigh Pull (IMTP)**: Muscle strength assessment added for participants launching after Crew-8

### Additional NASA Resources
- **NASA Human Research Program (HRP)**: 5 Hazards of Human Spaceflight taxonomy
- **NASA Open Science Data Repository (OSDR)**: Inspiration4 (I4) civilian astronaut datasets
- **Canadian Space Agency (CSA)**: CANS Radiation Monitoring research
- **NASA Life Sciences Portal**: Standard Measures entry at https://nlsp.nasa.gov/explore/?alias=standardmeasures

---

## 4. Super Intelligence (SI) / AI Disclosure

- **Tool Usage**: LLM assistance used strictly for API schema design, code scaffolding, and mock data generation.
- **Branding Compliance**: No official NASA logos, flags, or mission identifiers were altered or embedded into AI-generated graphics.

---

## 5. Frontend Architecture & Setup

### NASA Investigation & Standard Measures
This project implements NASA **Spaceflight Standard Measures** - a set of core measurements related to human spaceflight risks collected from astronauts before, during, and after ISS missions. The platform provides autonomous vital analysis aligned with NASA HRP 5 Spaceflight Hazards and SSM categories.

### Tech Stack

#### Frontend
- **Framework**: HTML5 pure + JavaScript fetch API + Custom CSS (no build tools, no node_modules)
- **Mocking**: Mock data in `frontend/app.js` for parallel development
- **UI Components**: Custom CSS + Dynamic canvas charts
- **Visualization**: Native Canvas replacement for Recharts + Interactive SVG for digital twin

#### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Server**: uvicorn
- **Security**: bcrypt for crew authentication
- **Database**: SQLite with SQLAlchemy (lightweight persistence, 100% offline-first)
- **Testing**: pytest + httpx for API testing
- **Data Analysis**: pandas for biomedical time-series processing
- **HTTP Client**: requests for external service integration

### Directory Structure
```text
frontend/
├── index.html              # FAVALORO SpaceHealth application structure
├── estilos.css             # NASA dark theme CSS, GREEN/YELLOW/RED color coding
└── app.js                  # JavaScript fetch connecting to FastAPI backend

backend/
├── api/
│   ├── servidor.py         # Main FastAPI server (app)
│   ├── rutas_tripulacion.py # Crew and login routes
│   ├── rutas_telemetria.py  # Telemetry, binquill, simulations routes
│   ├── inyector_dependencias.py # Dependency injection
│   └── esquemas_validacion.py   # Pydantic data validation schemas
│
src/
├── dominio/                # Entities and domain rules
│   ├── entidades.py
│   ├── puertos.py
│   ├── excepciones.py
│   ├── evaluador_riesgo_espacial.py
│   └── politicas_rbac.py
├── aplicación/             # Use cases
│   ├── casos_uso_tripulacion.py
│   ├── casos_uso_telemetria.py
│   └── casos_uso_botiquin.py
└── infraestructura/        # Adapters and persistence
    ├── __init__.py
    ├── seguridad/
    │   └── adaptador_bcrypt.py
    ├── api/
    │   └── esquemas_validacion.py
    ├── persistencia/
    │   ├── gestor_sqlite.py
    │   ├── repositorio_tripulantes_sql.py
    │   ├── repositorio_telemetria_sql.py
    │   └── repositorio_botiquin_sql.py
    └── api/
        └── inyector_dependencias.py
```

---

## 6. Official API Contract (JSON v2 Specification)

`GET /api/v1/astronauts/{astronaut_id}/telemetry/current`

```json
{
  "status": "success",
  "timestamp": "2026-11-14T13:30:00Z",
  "data": {
    "astronaut": {
      "id": "AST-004",
      "name": "Alex Vance",
      "mission": "Artemis III"
    },
    "vitals": {
      "heart_rate": { "value": 74, "unit": "bpm", "status": "GREEN" },
      "spo2": { "value": 98, "unit": "%", "status": "GREEN" },
      "blood_pressure": { "systolic": 118, "diastolic": 76, "unit": "mmHg", "status": "GREEN" },
      "body_temperature": { "value": 36.7, "unit": "degC", "status": "GREEN" },
      "blood_glucose": { "value": 95, "unit": "mg/dL", "status": "GREEN" }
    },
    "standard_measures": {
      "actigraphy": { "sleep_duration_hours": 7.2, "sleep_efficiency_pct": 88.5, "status": "GREEN" },
      "cognition": { "vigilant_attention_score": 94, "spatial_orientation_score": 91, "status": "GREEN" },
      "behavioral_health": { "mood_score_panas": 18, "team_cohesion_index": 9.2, "status": "GREEN" },
      "sensorimotor": { "motion_sickness_rating_0_to_20": 2, "postural_stability": "STABLE", "status": "GREEN" }
    },
    "smart_mirror_vision": {
      "capture_timestamp": "2026-11-14T07:30:00Z",
      "quality_gate_passed": true,
      "facial_edema_index": 1.04,
      "paleness_colorimetry_ratio": 0.98,
      "ocular_fatigue_score": "LOW",
      "status": "GREEN"
    },
    "clinical_assessment": {
      "overall_status": "GREEN",
      "engine_mode": "DETERMINISTIC_RULES",
      "active_alerts": [],
      "preventive_recommendation": "All health indicators within NASA HRP baseline ranges. Maintain scheduled hydration and resistive exercise."
    }
  }
}
```

---

## 7. Medical Safety & Color-Coding Standard

- **GREEN (Normal)**: All vitals within baseline.
- **YELLOW (Caution)**: Early drift detected; preventive actions recommended.
- **RED (Critical)**: Deterministic alert triggered; requires crew action and Flight Surgeon notification.

---

## 8. Frontend HTML Screens (Migrated to HTML/CSS/JS Pure)

The frontend was migrated from the previous React/Next.js/Tailwind stack to pure **HTML5 + CSS + JavaScript vanilla** (no build tools, no `node_modules`, no framework). All screens live under `frontend/` and can be opened directly in a browser or served statically.

### Screen Order (Navigation)


| Screen | File | Purpose |
|--------|------|---------|
| **Hoy / Dashboard** | `index.html` | Main entry: crew context, vitals highlights, clinical summary, daily sample summary, plan teaser |
| **Trends** | `trends.html` | Vital sign trends over time (3h/6h), metric picker, canvas chart |
| **Plan** | `plan.html` | Wellbeing plan: daily tasks, points wallet, progress bar, rewards medals |
| **Measures** | `measures.html` | Standard measures: sleep, cognition, behavioral health, sensorimotor |
| **Mirror** | `mirror.html` | Smart mirror: facial edema, paleness colorimetry, ocular fatigue, capture quality gate |
| **Admin** | `admin.html` | Supervisor workspace: monitor, summary, trends, measures, alerts sections |

### How to Run the Static Frontend

The project is pure HTML/CSS/JS — no installation or build step required.

**Option A — Python (recommended, fastest):**
```powershell
cd "C:\Users\User\FAVALOROSpaceHealth\frontend"
python -m http.server 8000
```
Then open: `http://localhost:8000`

**Option B — Node.js (npx):**
```powershell
cd "C:\Users\User\FAVALOROSpaceHealth\frontend"
npx serve
# or
npx http-server
```

**Option C — VS Code Live Server:**
Install the **Live Server** extension, right-click `index.html`, and select *"Open with Live Server"*.

### Tech Stack (Current)
- **Frontend**: HTML5 + CSS3 + JavaScript vanilla (Fetch API, Canvas charts, SVG icons)
- **Icons**: Google Material Symbols Rounded
- **Fonts**: Manrope + Space Grotesk (Google Fonts)
- **Mock data**: Embedded in `frontend/app.js` for offline development
- **Backend**: FastAPI (Python), SQLite, SQLAlchemy — connects via `fetch` to `http://localhost:8000/api`

---

## 9. Estado Actual del Proyecto (Hasta Acá) y Cómo Abrir el Frontend Hoy

### Cómo abrir el frontend HOY (Admin Panel - React/Next.js + Tailwind):

```powershell
# Terminal 1 - Backend FastAPI (puerto 8000)
cd "C:\Users\Jazmín\Downloads\FAVALOROSpaceHealth"
python -m uvicorn backend.api.servidor:app --reload --port 8000

# Terminal 2 - Frontend Admin (puerto 3001)
cd "C:\Users\Jazmín\Downloads\FAVALOROSpaceHealth\frontend"
npm run dev

# Luego abrir en el navegador:
http://localhost:3001/admin
```

### Estado actual de la integración (hasta acá):

- **Backend**: FastAPI corriendo en puerto 8000 (`/api/tripulantes`, `/api/telemetria/tripulante/{id}`, `/api/analitica/{id}`, `/api/botiquin`).
- **Frontend Admin**: Next.js + React + Tailwind (frontend/src/) en puerto 3001. El proxy `/api` → `http://localhost:8000/api` está configurado en `frontend/next.config.js`.
- **VitalSignsPanel**: Migrado desde `pulsovital-monitor/src/components/VitalSignsPanel.tsx` al `frontend/src/components/vitals/VitalSignsPanel.tsx` (correcciones de runtime aplicadas: banda blanca, barras animadas, colores de estado, fallback seguro en `VerticalGraduatedScale`).
- **InteractiveChartsPanel**: Restaurado con gráfico SVG interactivo (rejilla, banda de rango objetivo, línea óptima, área, crosshair, estadísticas de ventana).
- **Vínculo anatómico**: al seleccionar un signo vital (tarjeta de signos vitales o pestaña del gráfico), la estructura anatómica correspondiente se selecciona automáticamente (corazón ↔ FC, arteria ↔ PA, vena ↔ glucosa, capilar ↔ temperatura).

### Troubleshooting rapido:

- **Error `Failed to fetch`**: backend FastAPI no corriendo en puerto 8000.
- **Error runtime en vitals**: fallback seguro aplicado, no debe romper con reglas faltantes.

#   F A V A L O R O S p a c e H e a l t h  
 
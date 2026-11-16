# FAVALORO SpaceHealth

**NASA Space Apps Challenge 2026** - A vital signs monitoring platform for spaceflight crew health.

---

## Project Summary

FAVALORO SpaceHealth is an autonomous, non-invasive health monitoring platform designed to provide crew self-assessment without relying on black-box AI algorithms. The platform integrates continuous physiological telemetry with clinical rule-based analysis aligned with NASA standards.

**Core layers:**
1. **Continuous Physiological Telemetry Ingestion** - Real-time tracking of vital signs (heart rate, SpO2, blood pressure, body temperature, glucose)
2. **Clinical Rule Engine** - Deterministic rules based on medical standards (GREEN/YELLOW/RED color coding)
3. **Cabin Smart Mirror** - Passive 3-times-daily facial biomarker tracking

Aligned with **NASA Spaceflight Standard Measures** and **HRP 5 Spaceflight Hazards**.

---

## Tech Stack

### Frontend
- **Framework**: Next.js 15 + React 19 + Tailwind CSS
- **Icons**: Google Material Symbols
- **Fonts**: Manrope + Space Grotesk (Google Fonts)
- **State Management**: React Context + Hooks
- **Responsive**: Mobile-first design
- **Pages**: index, trends, plan, measures, mirror, admin

### Backend
- **Framework**: FastAPI (Python 3.15+)
- **Server**: uvicorn
- **Proxy**: Next.js proxy `/api/:path*` → `http://localhost:8000/api/:path*`
- **Database**: SQLite (lightweight, offline-first)
- **API Endpoints**: `/api/tripulantes`, `/api/telemetria/tripulante/{id}`, `/api/analitica/{id}`, `/api/botiquin`

### Development
- **Dev servers**: Frontend at `localhost:3001`, Backend at `localhost:8000`
- **TypeScript**: Clean in `src/`
- **Build**: `next build` compiles successfully

---

## Project Status

### ✅ Completed
- Frontend Next.js + React + Tailwind with pages (index, trends, plan, measures, mirror, admin)
- Backend FastAPI on port 8000 with endpoints `/api/tripulantes`, `/api/telemetria/tripulante/{id}`, `/api/analitica/{id}`, `/api/botiquin`
- `next.config.js` proxy `/api/:path*` → `http://localhost:8000/api/:path*`
- AnatomyMapPanel migrated and integrated in Monitor
- DailySummaryKPIPanel integrated in Summary (fix thermalDelta)
- VitalSignsPanel migrated with iterative fixes
- InteractiveChartsPanel migrated with fixes (tick keys, NaN handling, SVG)
- kpiData.ts created with rules/thresholds/evaluators
- TypeScript clean in `src/`
- `.gitignore` configured (ignores `pulsovital-monitor/` and `test-static.html`)

### 🟢 Active
- Frontend admin panel (`http://localhost:3001/admin`) with VitalSignsPanel and InteractiveChartsPanel
- Backend FastAPI running on port 8000 (`python -m uvicorn backend.api.servidor:app --port 8000`)
- Frontend on port 3001 (`npm run dev`)
- Layout: sidebar izquierdo, topbar con logo/idioma/hamburger, admin layout
- Components migrated one by one



### 🌐 URLs
- **Frontend**: `http://localhost:3001` (dev) / `http://localhost:3001/admin` (admin panel)
- **Backend**: `http://localhost:8000` (FastAPI with auto-docs at `/docs`)

---

## Related Repositories & Experimental Modules

- 🔗 **ASTRO_MED_HUD_V2**: [https://github.com/proyecto-nasa-mdq02/ASTRO_MED_HUD_V2](https://github.com/proyecto-nasa-mdq02/ASTRO_MED_HUD_V2)  
  *Experimental Head-Up Display (HUD) & visual telemetry interface developed by team members during the hackathon. Retained for future integration into the main FAVALORO SpaceHealth platform.*

---


## Development Notes

### Running the project
```bash
# Backend (port 8000)
python -m uvicorn backend.api.servidor:app --port 8000

# Frontend (port 3001)
npm run dev
```

### API Proxy
Next.js config proxies all `/api/*` requests to the backend:
```
http://localhost:8000/api/tripulantes
http://localhost:8000/api/telemetria/tripulante/1
http://localhost:8000/api/analitica/1
http://localhost:8000/api/botiquin
```

### Color Coding (NASA standards)
- **GREEN** (Normal): All vitals within baseline
- **AMBER** (Caution): Early drift detected
- **RED** (Critical): Deterministic alert triggered

### Icons
- Google Material Symbols Rounded used throughout
- ES/EN language selector in topbar

